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