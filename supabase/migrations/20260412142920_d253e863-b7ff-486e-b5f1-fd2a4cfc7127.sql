
CREATE OR REPLACE FUNCTION public.trigger_waiver_sync()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
DECLARE payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW), 'type', 'waiver');
  PERFORM net.http_post(
    url := 'https://ikkqxadrlmyyawrcxhph.supabase.co/functions/v1/google-sheets-sync',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload::text
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Sync trigger failed: %', SQLERRM;
  RETURN NEW;
END; $$;

CREATE OR REPLACE FUNCTION public.trigger_transaction_sync()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$
DECLARE payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW), 'type', 'transaction');
  PERFORM net.http_post(
    url := 'https://ikkqxadrlmyyawrcxhph.supabase.co/functions/v1/google-sheets-sync',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload::text
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Sync trigger failed: %', SQLERRM;
  RETURN NEW;
END; $$;

-- Recreate triggers (they were missing)
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
