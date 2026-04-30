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
    name: "Early Bird General Admission",
    description: "Entry to the evening. Early Bird offer available until May 5, 2026.",
    amount: 7500,
  },
  "bed-space": {
    name: "Shared Luxury Trailer Space",
    description: "Shared luxury trailer space, per person per night.",
    amount: 10000,
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");

    if (!supabaseUrl || !serviceRoleKey || !stripeSecretKey) {
      console.error("Missing checkout configuration", {
        hasSupabaseUrl: Boolean(supabaseUrl),
        hasServiceRoleKey: Boolean(serviceRoleKey),
        hasStripeSecretKey: Boolean(stripeSecretKey),
      });

      return new Response(
        JSON.stringify({ error: "Checkout is not fully configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { ticketType, attendeeName, attendeeEmail, attendeePhone, attendeeAddress } =
      await req.json();

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

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const waiverRecord = {
      attendee_name: attendeeName,
      attendee_email: attendeeEmail,
      attendee_phone: attendeePhone || "",
      attendee_address: attendeeAddress || "",
      ticket_type: ticketType,
      waiver_version: "v1.0_2026-08-15",
    };

    const waiverCreatedAt = new Date().toISOString();

    const { error: dbError } = await supabaseAdmin.from("waivers").insert({
      ...waiverRecord,
      created_at: waiverCreatedAt,
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(
        JSON.stringify({ error: "Failed to record waiver acceptance" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Waiver inserted for checkout:", attendeeEmail, ticketType, waiverCreatedAt);

    if (anonKey) {
      const syncPayload = JSON.stringify({
        record: {
          ...waiverRecord,
          created_at: waiverCreatedAt,
        },
        type: "waiver",
      });

      EdgeRuntime.waitUntil((async () => {
        for (const [name, url] of [
          ["google-sheets-sync", `${supabaseUrl}/functions/v1/google-sheets-sync`],
          ["mailerlite-sync", `${supabaseUrl}/functions/v1/mailerlite-sync`],
        ] as const) {
          try {
            console.log(`Starting ${name} sync for`, attendeeEmail);

            const response = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: anonKey,
                Authorization: `Bearer ${anonKey}`,
              },
              body: syncPayload,
            });

            if (!response.ok) {
              console.error(`${name} failed:`, response.status, await response.text());
              continue;
            }

            await response.text();
            console.log(`${name} sync completed for`, attendeeEmail);
          } catch (syncError) {
            console.error(`${name} request failed:`, syncError);
          }
        }
      })());
    } else {
      console.warn("SUPABASE_ANON_KEY is missing; skipping background sync calls");
    }

    const stripe = new Stripe(stripeSecretKey, {
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
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
