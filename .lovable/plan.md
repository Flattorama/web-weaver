

## Waiver-Gated Checkout System

This is a multi-step feature requiring Supabase (database + edge functions) and Stripe integration. **Neither is currently set up on this project.**

### Prerequisites (before any code)

1. **Enable Supabase** — Lovable Cloud will spin up a backend. This must happen first so we have a database and edge function runtime.
2. **Enable Stripe** — We need the Stripe secret key to create Checkout Sessions from the edge function.

### Implementation Steps

#### Step 1: Database Migration
Create `supabase/migrations/20260815_create_waiver_acceptances.sql` with the `waiver_acceptances` table (id, attendee_name, attendee_email, attendee_phone, attendee_address, ticket_type, waiver_version, referral_code, created_at). RLS enabled with open insert policy for service-role usage.

#### Step 2: WaiverContent Component
Create `src/components/WaiverContent.tsx` — the legal text with warning header, numbered liability sections, and optional per-section checkboxes. Styled to match the site's gold/cream/dark palette.

#### Step 3: WaiverDialog Component
Create `src/components/WaiverDialog.tsx` — modal using the existing `Dialog` UI component:
- Sticky header, scrollable waiver body with fade gradient
- Form fields: Name (required), Email (required), Phone, Address
- "I agree" checkbox + "Proceed to Payment" button (disabled until valid)
- On submit: POST to the edge function, then redirect to Stripe

#### Step 4: Edge Function
Create `supabase/functions/create-checkout/index.ts`:
- CORS handling
- Validate input (Zod)
- Insert waiver acceptance row via service-role client
- Create Stripe Checkout Session (CAD currency, $75 GA / $100 Bed)
- Return session URL

#### Step 5: Wire Up Index.tsx
- Replace the two `<a>` Stripe links (lines 737–749, 772–784) with `<button>` elements calling `handlePurchaseClick`
- Add state for dialog open/close and selected ticket
- Render `<WaiverDialog>` at the bottom of the Tickets section

### Technical Details
- Edge function uses `STRIPE_SECRET_KEY` (runtime secret) and `SUPABASE_SERVICE_ROLE_KEY` (auto-available)
- Supabase project URL and anon key will come from the Lovable Cloud integration (`src/integrations/supabase/client.ts`)
- Waiver version hardcoded as `"v1.0_2026-08-15"`
- All styling matches existing palette constants (C.gold, C.cream, C.bg, etc.)

### Files Created/Modified
- `supabase/migrations/20260815_create_waiver_acceptances.sql` (new)
- `src/components/WaiverContent.tsx` (new)
- `src/components/WaiverDialog.tsx` (new)
- `supabase/functions/create-checkout/index.ts` (new)
- `src/pages/Index.tsx` (modified)

