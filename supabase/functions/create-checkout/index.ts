import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const TICKETS: Record<string, { name: string; description: string; amount: number }> = {
  "general-admission": {
    name: "General Admission",
    description: "Entry to the evening. Music, food, and atmosphere included.",
    amount: 7500,
  },
  "bed-space": {
    name: "Bed Space",
    description: "Bed and restroom access (shared).",
    amount: 10000,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { ticketType, attendeeName, attendeeEmail, attendeePhone, attendeeAddress } =
      await req.json();

    // Validate
    if (!ticketType || !attendeeName || !attendeeEmail) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: ticketType, attendeeName, attendeeEmail" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const ticket = TICKETS[ticketType];
    if (!ticket) {
      return new Response(
        JSON.stringify({ error: `Invalid ticket type: ${ticketType}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Insert waiver acceptance
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabaseAdmin.from("waiver_acceptances").insert({
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
      attendee_phone: attendeePhone || "",
      attendee_address: attendeeAddress || "",
      ticket_type: ticketType,
      waiver_version: "v1.0_2026-08-15",
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to record waiver acceptance" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Stripe Checkout Session
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: "2023-10-16",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: attendeeEmail,
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: ticket.name,
              description: ticket.description,
            },
            unit_amount: ticket.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        attendee_name: attendeeName,
        attendee_email: attendeeEmail,
        ticket_type: ticketType,
      },
      success_url: `${req.headers.get("origin") || "https://roaring20s.lovable.app"}/?payment=success`,
      cancel_url: `${req.headers.get("origin") || "https://roaring20s.lovable.app"}/?payment=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
