-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'support', 'affiliate', 'customer', 'provider');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_roles table for RBAC
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create routes table
CREATE TABLE public.routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin_lat DOUBLE PRECISION,
  origin_lng DOUBLE PRECISION,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  estimated_hours DOUBLE PRECISION,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create truck_types table
CREATE TABLE public.truck_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  capacity_kg INTEGER NOT NULL,
  price_per_km DECIMAL(10,2) NOT NULL,
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  route_id UUID REFERENCES public.routes(id),
  truck_type_id UUID REFERENCES public.truck_types(id),
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  origin_lat DOUBLE PRECISION,
  origin_lng DOUBLE PRECISION,
  destination_lat DOUBLE PRECISION,
  destination_lng DOUBLE PRECISION,
  pickup_date DATE NOT NULL,
  package_weight DECIMAL(10,2),
  package_length DECIMAL(10,2),
  package_width DECIMAL(10,2),
  package_height DECIMAL(10,2),
  package_description TEXT,
  distance_km DOUBLE PRECISION,
  estimated_hours DOUBLE PRECISION,
  base_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled')),
  provider_id UUID REFERENCES auth.users(id),
  tracking_updates JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Routes policies (public read for all authenticated users)
CREATE POLICY "Routes are viewable by authenticated users" ON public.routes
  FOR SELECT TO authenticated USING (is_active = true);

-- Truck types policies (public read)
CREATE POLICY "Truck types are viewable by everyone" ON public.truck_types
  FOR SELECT USING (is_active = true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Providers can view assigned bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = provider_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Assign default customer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to generate booking number
CREATE OR REPLACE FUNCTION public.generate_booking_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.booking_number := 'BK' || TO_CHAR(NOW(), 'YYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$;

-- Create trigger for booking number generation
CREATE TRIGGER generate_booking_number_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.generate_booking_number();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON public.routes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default truck types
INSERT INTO public.truck_types (name, code, capacity_kg, price_per_km, icon, description) VALUES
  ('Mini Truck', 'mini', 500, 15.00, '🚐', 'Small cargo up to 500kg'),
  ('LCV', 'lcv', 1500, 22.00, '🚛', 'Light commercial vehicle up to 1.5 tons'),
  ('HCV', 'hcv', 5000, 35.00, '🚚', 'Heavy commercial vehicle up to 5 tons'),
  ('Container', 'container', 20000, 55.00, '📦', 'Full container load up to 20 tons'),
  ('Reefer', 'reefer', 10000, 65.00, '❄️', 'Refrigerated truck for perishables');