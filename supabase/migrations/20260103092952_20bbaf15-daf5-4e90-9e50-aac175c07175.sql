-- Enable realtime for bookings table
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- Add admin policy to view all bookings
CREATE POLICY "Admins can view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add admin policy to update any booking
CREATE POLICY "Admins can update all bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add support policy to view all bookings
CREATE POLICY "Support can view all bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'support'));

-- Add admin policy to manage truck types
CREATE POLICY "Admins can manage truck types" ON public.truck_types
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add admin policy to manage routes
CREATE POLICY "Admins can manage routes" ON public.routes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add provider policy to view their own roles
CREATE POLICY "Providers can view assigned bookings for update" ON public.bookings
  FOR UPDATE TO authenticated
  USING (auth.uid() = provider_id);