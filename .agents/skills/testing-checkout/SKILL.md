---
name: testing-checkout
description: Test the Web Weaver event ticket checkout flow end-to-end through the waiver modal and Stripe Checkout. Use when verifying ticket purchase or Stripe Price ID changes.
---

# Web Weaver Checkout Testing

## Devin Secrets Needed

- `STRIPE_LIVE_RESTRICTED_KEY`: live Stripe key with at least Products, Prices, and Checkout Sessions access for validation. Prefer restricted permissions.
- Supabase publishable anon key for project `ikkqxadrlmyyawrcxhph` when testing the deployed Edge Function from the real frontend.
- Supabase service/management access may be needed to verify Edge Function secrets and waiver persistence. Do not print secret values.

## What to verify

- The ticket cards are reachable from the `Get Your Ticket` CTA.
- General Admission opens `Liability Waiver Agreement - General Admission`.
- Bed Space opens `Liability Waiver Agreement - Bed Space`.
- The waiver submit button stays disabled until required name, email, and agreement checkbox are completed.
- Submitting the waiver redirects to Stripe Checkout.
- Stripe Checkout displays saved live product names and one-time CAD prices, not old inline/ad-hoc product names.

## Stripe validation

Use the Stripe API to confirm each configured Price ID before browser testing:

- `active` is `true`.
- `livemode` is `true`.
- `type` is `one_time` for event tickets sold through Checkout `mode: "payment"`.
- Currency and amount match the public ticket card.
- Expanded product name matches the expected checkout display.

If Stripe rejects a Checkout Session with a recurring-price error, the Price ID is a subscription price and should not be used with `payment` mode.

## Local testing workaround

If deployed Supabase secrets are unavailable, local UI testing can still verify the browser waiver flow and live Stripe price behavior by running Vite with `VITE_SUPABASE_URL` pointed at a temporary local harness that implements `/functions/v1/create-checkout` and creates live Stripe Checkout Sessions using the same Price IDs.

Call out this limitation clearly: a local harness does not verify deployed Supabase Edge Function secrets, waiver database insert, Google Sheets sync, or MailerLite sync.

## Full deployed verification

For full production confidence, verify the Supabase project `ikkqxadrlmyyawrcxhph` has these Edge Function secrets configured before testing the deployed site:

- `STRIPE_SECRET_KEY`
- `STRIPE_GENERAL_ADMISSION_PRICE_ID`
- `STRIPE_BED_SPACE_PRICE_ID`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

Then submit one checkout flow per ticket type from the deployed frontend and confirm both Stripe Checkout display and waiver/sync side effects.
