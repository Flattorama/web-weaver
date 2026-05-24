# Web Weaver

Roaring Twenties event site with Supabase Edge Functions for waiver capture, Stripe Checkout, Google Sheets sync, and MailerLite sync.

## Active Supabase project

All app and function configuration should point to:

```text
https://ikkqxadrlmyyawrcxhph.supabase.co
```

Frontend deployment variables:

```text
VITE_SUPABASE_PROJECT_ID=ikkqxadrlmyyawrcxhph
VITE_SUPABASE_URL=https://ikkqxadrlmyyawrcxhph.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable anon key from project ikkqxadrlmyyawrcxhph>
```

Supabase Edge Function secrets needed in the same project:

```text
STRIPE_SECRET_KEY=<Stripe secret key>
STRIPE_GENERAL_ADMISSION_PRICE_ID=price_1Tafho949kCD6D1UxW2WgIze
STRIPE_BED_SPACE_PRICE_ID=price_1Tafjb949kCD6D1UWtZ9asnE
SUPABASE_SERVICE_ROLE_KEY=<service role key from project ikkqxadrlmyyawrcxhph>
SUPABASE_ANON_KEY=<anon key from project ikkqxadrlmyyawrcxhph>
GOOGLE_SERVICE_ACCOUNT_KEY=<Google service account JSON>
GOOGLE_SPREADSHEET_ID=<target spreadsheet id>
MAILERLITE_API_KEY=<MailerLite API key>
MAILERLITE_GROUP_ID_WAIVER=<MailerLite group id>
MAILERLITE_GROUP_ID_PURCHASER=<optional purchaser group id>
```

## Checkout troubleshooting

1. Confirm the live website deployment uses the `ikkqxadrlmyyawrcxhph` Supabase URL and publishable key. A stale key from another project can cause browser-side `failed to fetch` or authorization errors.
2. Confirm these Edge Functions are deployed in Supabase project `ikkqxadrlmyyawrcxhph`: `create-checkout`, `google-sheets-sync`, and `mailerlite-sync`.
3. In Supabase, open Edge Function logs for `create-checkout`, then submit the waiver form. If no log appears, the site is not reaching the active Supabase project. If a log appears with `Checkout is not fully configured`, one of the function secrets is missing.
4. If the function logs show `Failed to record waiver acceptance`, inspect the `waivers` table schema and confirm the function has the active project's `SUPABASE_SERVICE_ROLE_KEY`.
5. Confirm `STRIPE_SECRET_KEY` is a live-mode key when selling live tickets, and that the configured price IDs are active live-mode prices in the same Stripe account.
6. If the function reaches Stripe but fails there, inspect Stripe API logs for the matching timestamp and compare the error message with the Supabase function log.
7. The app currently creates Stripe Checkout sessions directly from `create-checkout`. A separate Stripe webhook is still recommended if completed payments need to be reliably recorded in `stripe_orders` after payment succeeds.

## Client content requests noted

- FAQ should state that camping is available.
- Shared luxury trailer space should be described as available for $100 per person per night.
- Early Bird checkout copy should mention May 5, 2026.
- Adult wording should include babies in arms where relevant.
- Mobile waiver flow should keep the submit/payment button reachable after the waiver form is completed.
