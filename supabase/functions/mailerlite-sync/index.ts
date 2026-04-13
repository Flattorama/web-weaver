const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

async function upsertSubscriber(
  apiKey: string,
  email: string,
  name: string,
  phone: string,
  groupId: string,
  fields: Record<string, string> = {}
): Promise<void> {
  const nameParts = name.trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const body = {
    email,
    fields: {
      name: firstName,
      last_name: lastName,
      phone: phone || "",
      ...fields,
    },
    groups: [groupId],
    status: "active",
  };

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`MailerLite API error (${res.status}): ${errText}`);
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("MAILERLITE_API_KEY");
    const waiverGroupId = Deno.env.get("MAILERLITE_GROUP_ID_WAIVER");
    const purchaserGroupId = Deno.env.get("MAILERLITE_GROUP_ID_PURCHASER") || waiverGroupId;

    if (!apiKey || !waiverGroupId) {
      return new Response(
        JSON.stringify({ error: "MailerLite not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { record, type } = await req.json();

    if (type === "waiver") {
      await upsertSubscriber(
        apiKey,
        record.attendee_email,
        record.attendee_name,
        record.attendee_phone,
        waiverGroupId,
        {
          ticket_type: record.ticket_type || "",
          referral_code: record.referral_code || "",
        }
      );
    } else if (type === "transaction") {
      await upsertSubscriber(
        apiKey,
        record.customer_email,
        record.customer_name,
        "",
        purchaserGroupId!,
        {
          ticket_type: record.ticket_type || "",
          amount_paid: record.amount_total ? (Number(record.amount_total) / 100).toFixed(2) : "",
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: `Unknown type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[mailerlite-sync] ERROR:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
