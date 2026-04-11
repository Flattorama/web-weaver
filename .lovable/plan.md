

## Fix Waiver Table Name & Re-create Triggers

**Issue:** The table is currently named `waiver_acceptances` but you want it named `waivers`. Additionally, the DB triggers were never created (they show as missing in the database state).

### Step 1: New Database Migration
A single migration that:
- Renames `waiver_acceptances` → `waivers` (preserves all data and policies)
- Re-creates the `trigger_waiver_sync()` trigger on the `waivers` table
- Re-creates the `trigger_transaction_sync()` trigger on `stripe_orders` (also missing)

```sql
ALTER TABLE public.waiver_acceptances RENAME TO waivers;

DROP TRIGGER IF EXISTS on_waiver_acceptance_insert ON waivers;
CREATE TRIGGER on_waiver_acceptance_insert
  AFTER INSERT ON waivers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_waiver_sync();

DROP TRIGGER IF EXISTS on_stripe_order_insert ON stripe_orders;
CREATE TRIGGER on_stripe_order_insert
  AFTER INSERT ON stripe_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_transaction_sync();
```

### Step 2: Update Edge Function Reference
In `supabase/functions/create-checkout/index.ts`, change `.from("waiver_acceptances")` → `.from("waivers")`.

### Step 3: Update Google Sheets Sync Edge Function
Check and update any references in `supabase/functions/google-sheets-sync/index.ts` if needed.

### Note
`src/integrations/supabase/types.ts` will auto-regenerate after the migration — no manual edit needed.

### Files Modified
- New migration SQL file
- `supabase/functions/create-checkout/index.ts` (table name reference)
- Redeploy both edge functions

