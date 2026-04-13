

## MailerLite Integration

### What This Does
Automatically syncs waiver submissions and Stripe purchases to MailerLite, adding subscribers to the correct group so you can manage email marketing segments.

- **Waiver group ID**: `184592025467750052`
- **Purchaser group ID**: `184592049528375065`

### Steps

**1. Store the MailerLite API key as a secret**
Use the `add_secret` tool to store `MAILERLITE_API_KEY` plus two group ID secrets (`MAILERLITE_GROUP_ID_WAIVER`, `MAILERLITE_GROUP_ID_PURCHASER`).

**2. Create the edge function** (`supabase/functions/mailerlite-sync/index.ts`)
- Receives `{ record, type }` from DB triggers
- Calls MailerLite's `POST /api/subscribers` to upsert the subscriber with name, email, phone, and custom fields (ticket_type, referral_code, amount_paid)
- Assigns to the waiver or purchaser group based on `type`
- Code as provided in your instructions above

**3. Update `supabase/config.toml`**
Add `[functions.mailerlite-sync]` with `verify_jwt = false`.

**4. Database migration** — update trigger functions
Recreate `trigger_waiver_sync()` and `trigger_transaction_sync()` to add a second `net.http_post` call targeting `mailerlite-sync`, with the `apikey` header included.

Also recreate the triggers themselves (`on_waiver_acceptance_insert` on `waivers`, `on_stripe_order_insert` on `stripe_orders`) since the DB currently shows no triggers.

**5. Backfill existing records**
Call the `mailerlite-sync` edge function for each of the 5 existing waiver rows and any stripe_orders rows so historical data is synced to MailerLite.

### Files Changed
- `supabase/functions/mailerlite-sync/index.ts` (new)
- `supabase/config.toml` (add function config)
- New migration SQL file (trigger updates)
- No app code changes

