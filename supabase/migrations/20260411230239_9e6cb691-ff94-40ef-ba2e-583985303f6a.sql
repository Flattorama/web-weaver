
-- Create stripe_orders table
CREATE TABLE IF NOT EXISTS public.stripe_orders (
  id BIGSERIAL PRIMARY KEY,
  checkout_session_id TEXT UNIQUE NOT NULL,
  payment_intent_id TEXT,
  customer_id TEXT,
  customer_email TEXT,
  customer_name TEXT,
  amount_subtotal BIGINT,
  amount_total BIGINT,
  currency TEXT,
  payment_status TEXT,
  status TEXT DEFAULT 'completed',
  ticket_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.stripe_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow edge function inserts via service role"
  ON public.stripe_orders
  FOR INSERT
  WITH CHECK (true);

-- Enable pg_net for async HTTP from Postgres
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Waiver sync trigger
CREATE OR REPLACE FUNCTION trigger_waiver_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW), 'type', 'waiver');

  PERFORM net.http_post(
    url := 'https://srfvfknvhmxvxkmnnprp.supabase.co/functions/v1/google-sheets-sync',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload::text
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Sync trigger failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_waiver_acceptance_insert ON waiver_acceptances;

CREATE TRIGGER on_waiver_acceptance_insert
  AFTER INSERT ON waiver_acceptances
  FOR EACH ROW
  EXECUTE FUNCTION trigger_waiver_sync();

-- Stripe orders sync trigger
CREATE OR REPLACE FUNCTION trigger_transaction_sync()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  payload jsonb;
BEGIN
  payload := jsonb_build_object('record', row_to_json(NEW), 'type', 'transaction');

  PERFORM net.http_post(
    url := 'https://srfvfknvhmxvxkmnnprp.supabase.co/functions/v1/google-sheets-sync',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := payload::text
  );

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Sync trigger failed: %', SQLERRM;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_stripe_order_insert ON stripe_orders;

CREATE TRIGGER on_stripe_order_insert
  AFTER INSERT ON stripe_orders
  FOR EACH ROW
  EXECUTE FUNCTION trigger_transaction_sync();
