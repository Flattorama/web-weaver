

## Fix: Recreate Missing Database Triggers

### Problem
Both edge functions (`google-sheets-sync` and `mailerlite-sync`) work correctly — confirmed by direct test calls returning `{"success": true}`. However, the database has **no triggers attached** to the `waivers` or `stripe_orders` tables, so new inserts never call the sync functions.

Despite multiple past migrations creating these triggers, they are not present in the database. This likely means a later migration or schema change dropped them.

### Solution
A single new migration to recreate both triggers:

```sql
DROP TRIGGER IF EXISTS on_waiver_insert ON public.waivers;
CREATE TRIGGER on_waiver_insert
  AFTER INSERT ON public.waivers
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_waiver_sync();

DROP TRIGGER IF EXISTS on_stripe_order_insert ON public.stripe_orders;
CREATE TRIGGER on_stripe_order_insert
  AFTER INSERT ON public.stripe_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_transaction_sync();
```

### After Deploying
- Submit a test waiver to verify it appears in both Google Sheets and MailerLite
- Backfill any recent waiver submissions that were missed while triggers were absent

### Files Changed
- New migration file only

