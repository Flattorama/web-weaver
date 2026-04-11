const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// ── Google Auth ──────────────────────────────────────────────────────────────

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getGoogleAccessToken(serviceAccountJson: string): Promise<string> {
  const sa = JSON.parse(serviceAccountJson);
  const now = Math.floor(Date.now() / 1000);

  const header = base64urlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64urlEncode(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));

  // Import private key
  const pemBody = sa.private_key
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\n/g, "");
  const keyData = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sigInput = new TextEncoder().encode(`${header}.${payload}`);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, sigInput);
  const jwt = `${header}.${payload}.${base64url(signature)}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Google auth failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

// ── Sheets helpers ───────────────────────────────────────────────────────────

const SHEETS_BASE = "https://sheets.googleapis.com/v4/spreadsheets";

async function ensureSheetTab(token: string, spreadsheetId: string, sheetName: string) {
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId}?fields=sheets.properties.title`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  const exists = data.sheets?.some((s: any) => s.properties?.title === sheetName);
  if (!exists) {
    await fetch(`${SHEETS_BASE}/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ requests: [{ addSheet: { properties: { title: sheetName } } }] }),
    });
  }
}

async function ensureHeaders(token: string, spreadsheetId: string, sheetName: string, headers: string[]) {
  const lastCol = String.fromCharCode(64 + headers.length);
  const res = await fetch(`${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:${lastCol}1`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!data.values || data.values.length === 0) {
    await fetch(
      `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:${lastCol}1?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ values: [headers] }),
      }
    );
  }
}

async function appendToSheet(token: string, spreadsheetId: string, sheetName: string, values: string[][]) {
  await fetch(
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(sheetName)}!A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ values }),
    }
  );
}

// ── Row builders ─────────────────────────────────────────────────────────────

function buildWaiverRow(record: Record<string, string>): string[] {
  return [
    record.id || "",
    record.attendee_name || "",
    record.attendee_email || "",
    record.attendee_phone || "",
    record.attendee_address || "",
    record.ticket_type || "",
    record.referral_code || "",
    record.waiver_version || "",
    record.created_at || "",
  ];
}

function buildTransactionRow(record: Record<string, string>): string[] {
  return [
    record.id || "",
    record.checkout_session_id || "",
    record.customer_name || "",
    record.customer_email || "",
    record.ticket_type || "",
    record.amount_total ? (Number(record.amount_total) / 100).toFixed(2) : "",
    record.currency || "",
    record.payment_status || "",
    record.status || "",
    record.created_at || "",
  ];
}

// ── Config ───────────────────────────────────────────────────────────────────

const SHEET_CONFIG: Record<string, { name: string; headers: string[]; buildRow: (r: Record<string, string>) => string[] }> = {
  waiver: {
    name: "Waiver Acceptances",
    headers: ["ID", "Name", "Email", "Phone", "Address", "Ticket Type", "Referral Code", "Waiver Version", "Accepted At"],
    buildRow: buildWaiverRow,
  },
  transaction: {
    name: "Transactions",
    headers: ["ID", "Session ID", "Customer Name", "Customer Email", "Ticket Type", "Amount", "Currency", "Payment Status", "Status", "Created At"],
    buildRow: buildTransactionRow,
  },
};

// ── Main ─────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const serviceAccountJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_KEY");
    const spreadsheetId = Deno.env.get("GOOGLE_SPREADSHEET_ID") || "12DcglDFpBsEP_Tm_Q9lK4yx5H6V1uEZUifr6v3caLyE";

    if (!serviceAccountJson || !spreadsheetId) {
      return new Response(
        JSON.stringify({ error: "Google Sheets not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { record, type } = await req.json();
    const config = SHEET_CONFIG[type];

    if (!config) {
      return new Response(
        JSON.stringify({ error: `Unknown type: ${type}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accessToken = await getGoogleAccessToken(serviceAccountJson);
    await ensureSheetTab(accessToken, spreadsheetId, config.name);
    await ensureHeaders(accessToken, spreadsheetId, config.name, config.headers);
    await appendToSheet(accessToken, spreadsheetId, config.name, [config.buildRow(record)]);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[google-sheets-sync] ERROR:", msg);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
