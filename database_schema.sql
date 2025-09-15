-- VAMA Buzău Database Schema
-- Run this script in your Supabase SQL editor to create all necessary tables and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('client', 'owner', 'admin');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'villa', 'studio', 'room');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE property_status AS ENUM ('draft', 'active', 'inactive', 'suspended');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'client',
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties table
CREATE TABLE public.properties (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type property_type NOT NULL,
  address TEXT NOT NULL,
  city TEXT DEFAULT 'Buzău',
  country TEXT DEFAULT 'Romania',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  max_guests INTEGER NOT NULL DEFAULT 1,
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  price_per_night DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  security_deposit DECIMAL(10, 2) DEFAULT 0,
  amenities TEXT[] DEFAULT '{}',
  house_rules TEXT,
  check_in_time TIME DEFAULT '15:00',
  check_out_time TIME DEFAULT '11:00',
  minimum_stay INTEGER DEFAULT 1,
  maximum_stay INTEGER DEFAULT 365,
  status property_status DEFAULT 'draft',
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  security_deposit DECIMAL(10, 2) DEFAULT 0,
  status booking_status DEFAULT 'pending',
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  special_requests TEXT,
  payment_intent_id TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
  location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
  value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  check_in_rating INTEGER CHECK (check_in_rating >= 1 AND check_in_rating <= 5),
  accuracy_rating INTEGER CHECK (accuracy_rating >= 1 AND accuracy_rating <= 5),
  comment TEXT,
  is_approved BOOLEAN DEFAULT TRUE,
  is_reported BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id) -- One review per booking
);

-- Availability calendar table
CREATE TABLE public.availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  price_override DECIMAL(10, 2),
  minimum_stay_override INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, date)
);

-- Property images table
CREATE TABLE public.property_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for communication
CREATE TABLE public.messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_property_type ON public.properties(property_type);
CREATE INDEX idx_properties_price ON public.properties(price_per_night);
CREATE INDEX idx_properties_location ON public.properties USING GIST(ST_Point(longitude, latitude));

CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_reviewer_id ON public.reviews(reviewer_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);

CREATE INDEX idx_availability_property_date ON public.availability(property_id, date);
CREATE INDEX idx_availability_date ON public.availability(date);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Properties policies
CREATE POLICY "Anyone can view active properties" ON public.properties
  FOR SELECT USING (status = 'active');

CREATE POLICY "Owners can view their own properties" ON public.properties
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert their own properties" ON public.properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own properties" ON public.properties
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own properties" ON public.properties
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can manage all properties" ON public.properties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    auth.uid() = guest_id OR 
    auth.uid() IN (
      SELECT owner_id FROM public.properties 
      WHERE id = property_id
    )
  );

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = guest_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (
    auth.uid() = guest_id OR 
    auth.uid() IN (
      SELECT owner_id FROM public.properties 
      WHERE id = property_id
    )
  );

CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Reviews policies
CREATE POLICY "Anyone can view approved reviews" ON public.reviews
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can view their own reviews" ON public.reviews
  FOR SELECT USING (auth.uid() = reviewer_id);

CREATE POLICY "Property owners can view reviews for their properties" ON public.reviews
  FOR SELECT USING (
    auth.uid() IN (
      SELECT owner_id FROM public.properties 
      WHERE id = property_id
    )
  );

CREATE POLICY "Users can create reviews for their bookings" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = reviewer_id AND
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE id = booking_id AND guest_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Users can update their own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Availability policies
CREATE POLICY "Anyone can view availability" ON public.availability
  FOR SELECT USING (true);

CREATE POLICY "Property owners can manage availability" ON public.availability
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM public.properties 
      WHERE id = property_id
    )
  );

-- Property images policies
CREATE POLICY "Anyone can view property images" ON public.property_images
  FOR SELECT USING (true);

CREATE POLICY "Property owners can manage their property images" ON public.property_images
  FOR ALL USING (
    auth.uid() IN (
      SELECT owner_id FROM public.properties 
      WHERE id = property_id
    )
  );

-- Messages policies
CREATE POLICY "Users can view their own messages" ON public.messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own messages" ON public.messages
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Functions and triggers

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check booking availability
CREATE OR REPLACE FUNCTION public.check_booking_availability(
  p_property_id UUID,
  p_check_in DATE,
  p_check_out DATE
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  -- Check for overlapping bookings
  SELECT COUNT(*)
  INTO conflict_count
  FROM public.bookings
  WHERE property_id = p_property_id
    AND status IN ('confirmed', 'pending')
    AND (
      (check_in_date <= p_check_in AND check_out_date > p_check_in) OR
      (check_in_date < p_check_out AND check_out_date >= p_check_out) OR
      (check_in_date >= p_check_in AND check_out_date <= p_check_out)
    );
  
  -- Check availability calendar
  IF conflict_count = 0 THEN
    SELECT COUNT(*)
    INTO conflict_count
    FROM public.availability
    WHERE property_id = p_property_id
      AND date >= p_check_in
      AND date < p_check_out
      AND is_available = false;
  END IF;
  
  RETURN conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate property average rating
CREATE OR REPLACE FUNCTION public.get_property_average_rating(p_property_id UUID)
RETURNS DECIMAL(3,2) AS $$
DECLARE
  avg_rating DECIMAL(3,2);
BEGIN
  SELECT ROUND(AVG(rating), 2)
  INTO avg_rating
  FROM public.reviews
  WHERE property_id = p_property_id
    AND is_approved = true;
  
  RETURN COALESCE(avg_rating, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample data (optional - remove in production)
-- This creates a sample admin user and some test data

-- Note: You'll need to manually create the admin user through Supabase Auth
-- then update their role in the users table

COMMIT;

-- Success message
SELECT 'Database schema created successfully! Remember to:' as message
UNION ALL
SELECT '1. Create your first admin user through Supabase Auth'
UNION ALL
SELECT '2. Update their role to "admin" in the users table'
UNION ALL
SELECT '3. Configure your environment variables'
UNION ALL
SELECT '4. Test the application functionality';