## Fix: Add `apikey` Header to Trigger Functions

### Problem

The `trigger_waiver_sync()` and `trigger_transaction_sync()` database functions use `pg_net` to call the edge function, but they omit the required `apikey` header. The Supabase gateway rejects these calls before they reach `google-sheets-sync`.

### Solution

A single database migration to recreate both trigger functions with the `apikey` header included, using the `SUPABASE_ANON_KEY` (safe since `verify_jwt = false`).

### Migration SQL

```sql
CREATE OR REPLACE FUNCTION public.trigger_waiver_sync()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
DECLARE payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW), 'type', 'waiver');
  PERFORM net.http_post(
    url := 'https://srfvfknvhmxvxkmnnprp.supabase.co/functions/v1/google-sheets-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', '<ANON_KEY>'
    ),
    body := payload::text
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Sync trigger failed: %', SQLERRM;
  RETURN NEW;
END; $$;

-- Same fix for trigger_transaction_sync()
```

### Files Changed

- New migration file only (no app code changes needed)

### After Deploying

The existing 5 waiver rows were inserted before the fix, so they won't auto-sync. We should  backfill them with a one-time script so that we can see all of the waiver rows from before the fix populate into the connected Google Sheet