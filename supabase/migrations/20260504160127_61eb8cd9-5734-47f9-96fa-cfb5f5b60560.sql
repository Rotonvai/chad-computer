
ALTER FUNCTION public.set_updated_at() SET search_path = public;
ALTER FUNCTION public.recalc_installment_paid() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recalc_installment_paid() FROM PUBLIC, anon, authenticated;

DROP POLICY IF EXISTS "anyone insert lead" ON public.leads;
CREATE POLICY "anyone insert lead" ON public.leads FOR INSERT
WITH CHECK (
  char_length(name) BETWEEN 1 AND 120
  AND char_length(coalesce(phone,'')) <= 30
  AND char_length(coalesce(email,'')) <= 200
  AND char_length(coalesce(course_interest,'')) <= 120
  AND char_length(coalesce(message,'')) <= 2000
);
