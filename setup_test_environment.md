# Test Environment Setup Guide

This guide will help you set up test data for the Vama Buzau application to test all website functionality.

## Prerequisites

1. Supabase project is set up and running
2. Database schema has been created using `database_schema.sql`
3. You have access to the Supabase SQL Editor

## Step 1: Create Test Users

Since users are managed by Supabase Auth, you'll need to create test users through the authentication system. You can do this in two ways:

### Option A: Through Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" and create the following test users:

**Property Owner 1:**
- Email: `owner1@test.com`
- Password: `TestPass123!`
- Role: owner

**Property Owner 2:**
- Email: `owner2@test.com`
- Password: `TestPass123!`
- Role: owner

**Guest User 1:**
- Email: `guest1@test.com`
- Password: `TestPass123!`
- Role: client

**Guest User 2:**
- Email: `guest2@test.com`
- Password: `TestPass123!`
- Role: client

**Admin User:**
- Email: `admin@test.com`
- Password: `TestPass123!`
- Role: admin

### Option B: Through Application Registration
1. Start your application (`npm run dev`)
2. Go to the registration page
3. Register the test users listed above

## Step 2: Update User Profiles

After creating users, run this SQL in Supabase SQL Editor to update their profiles:

```sql
-- Update user profiles with roles and additional info
UPDATE public.users 
SET 
  full_name = 'Property Owner One',
  phone = '+40712345678',
  role = 'owner'
WHERE email = 'owner1@test.com';

UPDATE public.users 
SET 
  full_name = 'Property Owner Two',
  phone = '+40723456789',
  role = 'owner'
WHERE email = 'owner2@test.com';

UPDATE public.users 
SET 
  full_name = 'John Guest',
  phone = '+40734567890',
  role = 'client'
WHERE email = 'guest1@test.com';

UPDATE public.users 
SET 
  full_name = 'Maria Guest',
  phone = '+40745678901',
  role = 'client'
WHERE email = 'guest2@test.com';

UPDATE public.users 
SET 
  full_name = 'Admin User',
  phone = '+40756789012',
  role = 'admin'
WHERE email = 'admin@test.com';
```

## Step 3: Insert Test Properties

Run the `insert_test_data.sql` script, but first update the owner_id values with the actual user IDs:

```sql
-- Get user IDs for property owners
SELECT id, email, full_name FROM public.users WHERE role = 'owner';
```

Then update the `insert_test_data.sql` file with the correct user IDs before running it.

## Step 4: Additional Test Data

Run this additional SQL to create more comprehensive test data:

```sql
-- Insert more varied availability data
INSERT INTO public.availability (property_id, date, is_available, price_override)
SELECT 
  p.id,
  date_series.date,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (5, 6) 
    THEN CASE WHEN random() > 0.3 THEN true ELSE false END  -- Weekend availability
    ELSE CASE WHEN random() > 0.1 THEN true ELSE false END  -- Weekday availability
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (5, 6)
    THEN p.price_per_night * 1.2  -- Weekend premium
    ELSE NULL
  END
FROM public.properties p
CROSS JOIN (
  SELECT CURRENT_DATE + INTERVAL '1 day' * generate_series(90, 180) as date
) date_series
ON CONFLICT (property_id, date) DO UPDATE SET
  is_available = EXCLUDED.is_available,
  price_override = EXCLUDED.price_override;

-- Insert some blocked dates for maintenance
INSERT INTO public.availability (property_id, date, is_available)
SELECT 
  id,
  CURRENT_DATE + INTERVAL '30 days',
  false
FROM public.properties
WHERE id = (SELECT id FROM public.properties LIMIT 1)
ON CONFLICT (property_id, date) DO UPDATE SET
  is_available = EXCLUDED.is_available;
```

## Step 5: Test Scenarios

After setting up the data, you can test these scenarios:

### Property Search and Booking
1. **Search Properties**: Go to `/search` and test filtering by:
   - Location (Buzău)
   - Date ranges
   - Number of guests
   - Property type
   - Price range

2. **View Property Details**: Click on any property to see:
   - Property information
   - Image gallery
   - Amenities
   - Reviews
   - Availability calendar

3. **Make a Booking**: 
   - Select dates
   - Enter guest information
   - Complete booking process

### User Authentication
1. **Register**: Test user registration with validation
2. **Login**: Test login with the created test users
3. **Profile Management**: Update user profiles

### Property Management (for owners)
1. **Add Property**: Login as owner and add new properties
2. **Edit Property**: Modify existing property details
3. **Manage Availability**: Update availability calendar
4. **View Bookings**: Check incoming bookings

### Admin Functions
1. **User Management**: View and manage all users
2. **Property Moderation**: Approve/reject properties
3. **Booking Management**: Handle booking disputes

## Test Credentials Summary

| Role | Email | Password | Purpose |
|------|-------|----------|----------|
| Owner | owner1@test.com | TestPass123! | Property management testing |
| Owner | owner2@test.com | TestPass123! | Multiple owner testing |
| Guest | guest1@test.com | TestPass123! | Booking and review testing |
| Guest | guest2@test.com | TestPass123! | Additional guest testing |
| Admin | admin@test.com | TestPass123! | Admin functionality testing |

## Troubleshooting

### Common Issues

1. **Properties not showing**: Check that property status is 'active'
2. **Booking errors**: Verify availability data exists for selected dates
3. **Authentication issues**: Ensure RLS policies are properly set up
4. **Image loading**: Verify image URLs are accessible

### Useful SQL Queries for Debugging

```sql
-- Check property status
SELECT id, title, status, owner_id FROM public.properties;

-- Check availability for a specific property
SELECT * FROM public.availability 
WHERE property_id = 'YOUR_PROPERTY_ID' 
AND date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
ORDER BY date;

-- Check user roles
SELECT id, email, full_name, role FROM public.users;

-- Check bookings
SELECT b.*, p.title FROM public.bookings b
JOIN public.properties p ON b.property_id = p.id
ORDER BY b.created_at DESC;
```

## Next Steps

After setting up the test data:

1. Test all major user flows
2. Verify responsive design on different devices
3. Test error handling scenarios
4. Performance test with the sample data
5. Test edge cases (fully booked properties, past dates, etc.)

This test environment will give you a comprehensive setup to validate all aspects of your Vama Buzau application functionality.