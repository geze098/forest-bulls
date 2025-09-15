# Vama Buzau - Database Schema

## Overview

This document outlines the complete database schema for the Vama Buzau booking platform. The schema is designed for PostgreSQL with Supabase and includes Row Level Security (RLS) policies for role-based access control.

## User Roles

```sql
CREATE TYPE user_role AS ENUM ('client', 'owner', 'administrator');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE property_status AS ENUM ('draft', 'active', 'inactive', 'suspended');
CREATE TYPE room_type AS ENUM ('single', 'double', 'twin', 'suite', 'apartment', 'villa');
CREATE TYPE amenity_category AS ENUM ('basic', 'comfort', 'entertainment', 'business', 'accessibility');
```

## Core Tables

### 1. Users Table (extends Supabase auth.users)

```sql
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    avatar_url TEXT,
    role user_role DEFAULT 'client' NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    preferred_language VARCHAR(5) DEFAULT 'en',
    marketing_consent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_active ON public.users(is_active);
```

### 2. User Profiles Table

```sql
CREATE TABLE public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    bio TEXT,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
```

### 3. Properties Table

```sql
CREATE TABLE public.properties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    property_type VARCHAR(50) NOT NULL, -- hotel, apartment, villa, etc.
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    check_in_time TIME DEFAULT '15:00:00',
    check_out_time TIME DEFAULT '11:00:00',
    min_stay_nights INTEGER DEFAULT 1,
    max_stay_nights INTEGER DEFAULT 365,
    cancellation_policy TEXT,
    house_rules TEXT,
    status property_status DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    average_rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_location ON public.properties(city, country);
CREATE INDEX idx_properties_featured ON public.properties(featured);
CREATE INDEX idx_properties_rating ON public.properties(average_rating);
```

### 4. Property Images Table

```sql
CREATE TABLE public.property_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_primary ON public.property_images(property_id, is_primary);
```

### 5. Rooms Table

```sql
CREATE TABLE public.rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    room_type room_type NOT NULL,
    max_occupancy INTEGER NOT NULL,
    bed_count INTEGER DEFAULT 1,
    bathroom_count INTEGER DEFAULT 1,
    size_sqm DECIMAL(8, 2),
    base_price DECIMAL(10, 2) NOT NULL,
    weekend_price DECIMAL(10, 2),
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    security_deposit DECIMAL(10, 2) DEFAULT 0,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rooms_property_id ON public.rooms(property_id);
CREATE INDEX idx_rooms_type ON public.rooms(room_type);
CREATE INDEX idx_rooms_available ON public.rooms(is_available);
```

### 6. Room Images Table

```sql
CREATE TABLE public.room_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_room_images_room_id ON public.room_images(room_id);
```

### 7. Amenities Table

```sql
CREATE TABLE public.amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    category amenity_category NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_amenities_category ON public.amenities(category);
CREATE INDEX idx_amenities_active ON public.amenities(is_active);
```

### 8. Property Amenities Junction Table

```sql
CREATE TABLE public.property_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(property_id, amenity_id)
);

CREATE INDEX idx_property_amenities_property ON public.property_amenities(property_id);
CREATE INDEX idx_property_amenities_amenity ON public.property_amenities(amenity_id);
```

### 9. Room Amenities Junction Table

```sql
CREATE TABLE public.room_amenities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    amenity_id UUID REFERENCES public.amenities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, amenity_id)
);

CREATE INDEX idx_room_amenities_room ON public.room_amenities(room_id);
CREATE INDEX idx_room_amenities_amenity ON public.room_amenities(amenity_id);
```

### 10. Bookings Table

```sql
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guest_count INTEGER NOT NULL,
    adult_count INTEGER NOT NULL,
    child_count INTEGER DEFAULT 0,
    total_nights INTEGER NOT NULL,
    base_amount DECIMAL(10, 2) NOT NULL,
    cleaning_fee DECIMAL(10, 2) DEFAULT 0,
    service_fee DECIMAL(10, 2) DEFAULT 0,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status booking_status DEFAULT 'pending',
    special_requests TEXT,
    guest_notes TEXT,
    owner_notes TEXT,
    confirmation_code VARCHAR(20) UNIQUE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date),
    CONSTRAINT valid_guests CHECK (guest_count > 0 AND adult_count > 0)
);

-- Indexes
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_confirmation ON public.bookings(confirmation_code);
```

### 11. Reviews Table

```sql
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    location_rating INTEGER CHECK (location_rating >= 1 AND location_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_moderated BOOLEAN DEFAULT false,
    moderated_by UUID REFERENCES public.users(id),
    moderated_at TIMESTAMP WITH TIME ZONE,
    owner_response TEXT,
    owner_response_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id) -- One review per booking
);

CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_property_id ON public.reviews(property_id);
CREATE INDEX idx_reviews_rating ON public.reviews(rating);
CREATE INDEX idx_reviews_verified ON public.reviews(is_verified);
CREATE INDEX idx_reviews_featured ON public.reviews(is_featured);
```

### 12. Availability Calendar Table

```sql
CREATE TABLE public.availability_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN DEFAULT true,
    price_override DECIMAL(10, 2),
    min_stay_override INTEGER,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(room_id, date)
);

CREATE INDEX idx_availability_room_date ON public.availability_calendar(room_id, date);
CREATE INDEX idx_availability_date ON public.availability_calendar(date);
CREATE INDEX idx_availability_available ON public.availability_calendar(is_available);
```

### 13. Notifications Table

```sql
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- booking, review, system, promotion
    related_id UUID, -- ID of related entity (booking, property, etc.)
    is_read BOOLEAN DEFAULT false,
    is_email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    action_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(is_read);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_created ON public.notifications(created_at);
```

### 14. Favorites Table

```sql
CREATE TABLE public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_property_id ON public.favorites(property_id);
```

### 15. Search History Table

```sql
CREATE TABLE public.search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    search_query JSONB NOT NULL,
    results_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_search_history_user_id ON public.search_history(user_id);
CREATE INDEX idx_search_history_created ON public.search_history(created_at);
```

### 16. Analytics Events Table

```sql
CREATE TABLE public.analytics_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    page_url TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX idx_analytics_events_session ON public.analytics_events(session_id);
```

## Row Level Security (RLS) Policies

### Users Table Policies

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile and public info of others
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" ON public.users
    FOR SELECT USING (role IN ('owner', 'client'));

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Admins can view and manage all users
CREATE POLICY "Admins can manage users" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );
```

### Properties Table Policies

```sql
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Anyone can view active properties
CREATE POLICY "Anyone can view active properties" ON public.properties
    FOR SELECT USING (status = 'active');

-- Owners can manage their own properties
CREATE POLICY "Owners can manage own properties" ON public.properties
    FOR ALL USING (auth.uid() = owner_id);

-- Admins can manage all properties
CREATE POLICY "Admins can manage all properties" ON public.properties
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );
```

### Bookings Table Policies

```sql
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

-- Property owners can view bookings for their properties
CREATE POLICY "Owners can view property bookings" ON public.bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE id = property_id AND owner_id = auth.uid()
        )
    );

-- Users can create bookings
CREATE POLICY "Users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings (limited)
CREATE POLICY "Users can update own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Property owners can update bookings for their properties
CREATE POLICY "Owners can update property bookings" ON public.bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE id = property_id AND owner_id = auth.uid()
        )
    );

-- Admins can manage all bookings
CREATE POLICY "Admins can manage all bookings" ON public.bookings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );
```

### Reviews Table Policies

```sql
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can view moderated reviews
CREATE POLICY "Anyone can view moderated reviews" ON public.reviews
    FOR SELECT USING (is_moderated = true);

-- Users can view their own reviews
CREATE POLICY "Users can view own reviews" ON public.reviews
    FOR SELECT USING (auth.uid() = user_id);

-- Property owners can view reviews for their properties
CREATE POLICY "Owners can view property reviews" ON public.reviews
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE id = property_id AND owner_id = auth.uid()
        )
    );

-- Users can create reviews for their completed bookings
CREATE POLICY "Users can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.bookings
            WHERE id = booking_id AND user_id = auth.uid() AND status = 'completed'
        )
    );

-- Property owners can respond to reviews
CREATE POLICY "Owners can respond to reviews" ON public.reviews
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE id = property_id AND owner_id = auth.uid()
        )
    );

-- Admins can moderate all reviews
CREATE POLICY "Admins can moderate reviews" ON public.reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'administrator'
        )
    );
```

## Functions and Triggers

### Update Timestamps Function

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at BEFORE UPDATE ON public.rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Generate Confirmation Code Function

```sql
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.confirmation_code IS NULL THEN
        NEW.confirmation_code := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_booking_confirmation_code
    BEFORE INSERT ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION generate_confirmation_code();
```

### Update Property Rating Function

```sql
CREATE OR REPLACE FUNCTION update_property_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.properties
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating), 0)
            FROM public.reviews
            WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
            AND is_moderated = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews
            WHERE property_id = COALESCE(NEW.property_id, OLD.property_id)
            AND is_moderated = true
        )
    WHERE id = COALESCE(NEW.property_id, OLD.property_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

CREATE TRIGGER update_property_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION update_property_rating();
```

## Indexes for Performance

```sql
-- Composite indexes for common queries
CREATE INDEX idx_bookings_property_dates ON public.bookings(property_id, check_in_date, check_out_date);
CREATE INDEX idx_properties_location_rating ON public.properties(city, country, average_rating DESC);
CREATE INDEX idx_rooms_property_available ON public.rooms(property_id, is_available);
CREATE INDEX idx_reviews_property_moderated ON public.reviews(property_id, is_moderated, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_properties_search ON public.properties USING GIN(to_tsvector('english', name || ' ' || description));
CREATE INDEX idx_amenities_search ON public.amenities USING GIN(to_tsvector('english', name || ' ' || description));
```

This comprehensive database schema provides a solid foundation for the booking platform with proper relationships, security policies, and performance optimizations. The schema supports all the required functionality while maintaining data integrity and security through Row Level Security policies.