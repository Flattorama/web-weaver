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