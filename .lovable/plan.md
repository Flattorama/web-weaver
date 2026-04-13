

## Fix: Call Sync Functions Directly Instead of Relying on DB Triggers

### Problem
Database triggers on the `waivers` and `stripe_orders` tables keep getting removed by the environment despite multiple migrations creating them. The trigger functions exist, `pg_net` exists, but the triggers themselves are consistently absent. This has happened across 3+ migration attempts.

### Solution
Stop relying on database triggers. Instead, call the `google-sheets-sync` and `mailerlite-sync` edge functions **directly from the `create-checkout` edge function** after the waiver insert succeeds. This is more reliable since it doesn't depend on trigger persistence.

### Changes

**1. Update `supabase/functions/create-checkout/index.ts`**

After the successful waiver insert (line 62), add direct HTTP calls to both sync functions:

```typescript
// After successful waiver insert, sync to Google Sheets and MailerLite
const waiverRecord = {
  attendee_name: attendeeName,
  attendee_email: attendeeEmail,
  attendee_phone: attendeePhone || "",
  attendee_address: attendeeAddress || "",
  ticket_type: ticketType,
  waiver_version: "v1.0_2026-08-15",
  created_at: new Date().toISOString(),
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

// Fire-and-forget — don't block checkout on sync
Promise.all([
  fetch(`${supabaseUrl}/functions/v1/google-sheets-sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": anonKey },
    body: JSON.stringify({ record: waiverRecord, type: "waiver" }),
  }),
  fetch(`${supabaseUrl}/functions/v1/mailerlite-sync`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "apikey": anonKey },
    body: JSON.stringify({ record: waiverRecord, type: "waiver" }),
  }),
]).catch(err => console.error("Sync calls failed:", err));
```

**2. Redeploy `create-checkout`**

**3. Backfill the latest test entries** that were missed (the two April 13 submissions visible in the CSV but not in Google Sheets/MailerLite).

### Why This Approach
- Triggers have been unreliable in this environment (dropped 3+ times)
- Direct function calls from the edge function are deterministic and testable
- Fire-and-forget pattern keeps checkout fast — sync failures don't block payment
- No migration needed

### Files Changed
- `supabase/functions/create-checkout/index.ts` (add sync calls)

