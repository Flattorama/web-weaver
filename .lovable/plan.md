

## Google Sheets Sync Integration

### What We're Building
An automated pipeline that syncs new waiver acceptances and Stripe orders to a Google Sheet whenever a row is inserted. Uses a database trigger → edge function → Google Sheets API flow.

### Prerequisites (secrets needed)
Two new secrets must be added before this works:
- **GOOGLE_SERVICE_ACCOUNT_KEY** — full JSON of the Google service account key file
- **GOOGLE_SPREADSHEET_ID** — `12DcglDFpBsEP_Tm_Q9lK4yx5H6V1uEZUifr6v3caLyE`

The Google Sheet must be shared with the service account email (`sheets-sync-service-account@roaring20s-493015.iam.gserviceaccount.com`) as Editor.

### Implementation Steps

#### Step 1: Database Migration
Create a migration that:
- Creates `stripe_orders` table (id, checkout_session_id, payment_intent_id, customer_id, customer_email, customer_name, amount_subtotal, amount_total, currency, payment_status, status, ticket_type, created_at) with RLS
- Enables `pg_net` extension
- Creates `trigger_waiver_sync()` function + trigger on `waiver_acceptances` AFTER INSERT — fires async HTTP POST to the edge function with `{record, type: "waiver"}`
- Creates `trigger_transaction_sync()` function + trigger on `stripe_orders` AFTER INSERT — fires async HTTP POST with `{record, type: "transaction"}`
- Both triggers use `EXCEPTION WHEN OTHERS` so sync failures never block inserts
- Uses project ref `srfvfknvhmxvxkmnnprp` in the trigger URLs

#### Step 2: Create `google-sheets-sync` Edge Function
New file: `supabase/functions/google-sheets-sync/index.ts`
- JWT-based Google service account auth using `crypto.subtle` for RS256 signing
- `ensureSheetTab()` — creates tab if missing
- `ensureHeaders()` — writes header row if tab is empty
- `appendToSheet()` — appends data row
- Two sheet configs: "Waiver Acceptances" (9 columns) and "Transactions" (10 columns)
- Row builders that map record fields to column arrays
- CORS headers on all responses
- `verify_jwt = false` in config.toml since triggers don't send auth headers

#### Step 3: Update `create-checkout` Edge Function
Update the existing function to also populate `customer_name` and `ticket_type` in Stripe session metadata (already done), ensuring the webhook can pass these to `stripe_orders`.

*Note: A `stripe-webhook` edge function to handle Stripe webhook events and insert into `stripe_orders` is referenced but not yet built. That would be a separate follow-up task.*

### Files Created/Modified
- `supabase/migrations/YYYYMMDD_add_stripe_orders_and_sync_triggers.sql` (new)
- `supabase/functions/google-sheets-sync/index.ts` (new)
- `supabase/config.toml` (add `verify_jwt = false` for google-sheets-sync)

### Technical Notes
- The `pg_net` extension makes async HTTP calls from Postgres — inserts are never blocked by sync failures
- The edge function uses `Deno.serve()` (modern API) instead of the deprecated `serve()` import
- Google auth uses Web Crypto API (`crypto.subtle`) which is available in Deno edge runtime

