-- Fix for infinite recursion in RLS policies
-- The issue is that admin policies reference the users table from within the users table policy

-- First, drop the problematic admin policies
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Admins can moderate reviews" ON public.reviews;

-- Create a function to check if current user is admin
-- This function will be SECURITY DEFINER and can bypass RLS
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role IN ('admin', 'administrator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- Now recreate the admin policies using the function
-- This avoids the circular reference because the function bypasses RLS

-- Users table admin policy
CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage all users" ON public.users
  FOR ALL USING (public.is_admin());

-- Properties table admin policy
CREATE POLICY "Admins can manage all properties" ON public.properties
  FOR ALL USING (public.is_admin());

-- Bookings table admin policy
CREATE POLICY "Admins can manage all bookings" ON public.bookings
  FOR ALL USING (public.is_admin());

-- Reviews table admin policy
CREATE POLICY "Admins can manage all reviews" ON public.reviews
  FOR ALL USING (public.is_admin());

-- Also fix any other admin policies that might exist
DROP POLICY IF EXISTS "Admins can manage users" ON public.users;
CREATE POLICY "Admins can manage users" ON public.users
  FOR ALL USING (public.is_admin());

-- Success message
SELECT 'RLS policies fixed successfully! Infinite recursion should be resolved.' as message;