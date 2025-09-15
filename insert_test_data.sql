-- Test Data Insertion Script for Vama Buzau
-- Run this after creating test users through Supabase Auth

-- First, let's see the user IDs (run this to get the actual IDs)
-- SELECT id, email, full_name, role FROM auth.users;

-- Insert test properties (replace the owner_id values with actual user IDs from above query)
INSERT INTO public.properties (
  id,
  owner_id,
  title,
  description,
  property_type,
  address,
  city,
  country,
  latitude,
  longitude,
  max_guests,
  bedrooms,
  bathrooms,
  price_per_night,
  amenities,
  house_rules,
  status
) VALUES 
(
  uuid_generate_v4(),
  (SELECT id FROM auth.users WHERE email = 'owner1@test.com' LIMIT 1),
  'Apartament Central Buzău',
  'Apartament modern în centrul orașului Buzău, perfect pentru turiști și călători de afaceri. Situat la doar 5 minute de mers pe jos de centrul vechi și principalele atracții turistice.',
  'apartment',
  'Strada Republicii, Nr. 15, Buzău',
  'Buzău',
  'România',
  45.1500,
  26.8333,
  4,
  2,
  1,
  150.00,
  ARRAY['wifi', 'kitchen', 'parking', 'air_conditioning', 'tv', 'washing_machine'],
  'No smoking, No pets, Quiet hours 22:00-08:00',
  'active'
),
(
  uuid_generate_v4(),
  (SELECT id FROM auth.users WHERE email = 'owner1@test.com' LIMIT 1),
  'Casa de Vacanță Mudava',
  'Casă tradițională românească renovată, situată în zona pitorească Mudava. Ideală pentru familii care doresc să se bucure de natură și liniște, cu grădină mare și vedere la munte.',
  'house',
  'Strada Mudava, Nr. 42, Buzău',
  'Buzău',
  'România',
  45.1200,
  26.8100,
  6,
  3,
  2,
  200.00,
  ARRAY['wifi', 'kitchen', 'parking', 'garden', 'fireplace', 'bbq', 'pet_friendly'],
  'No smoking indoors, Pets allowed with deposit, Respect neighbors',
  'active'
),
(
  uuid_generate_v4(),
  (SELECT id FROM auth.users WHERE email = 'owner2@test.com' LIMIT 1),
  'Studio Modern Dacia',
  'Studio modern și confortabil în cartierul Dacia. Perfect pentru cupluri sau călători singuri. Complet mobilat și utilat, cu toate facilitățile necesare pentru un sejur plăcut.',
  'studio',
  'Bulevardul Dacia, Nr. 28, Buzău',
  'Buzău',
  'România',
  45.1600,
  26.8400,
  2,
  1,
  1,
  100.00,
  ARRAY['wifi', 'kitchen', 'air_conditioning', 'tv', 'washing_machine'],
  'No smoking, No parties, Check-in after 15:00',
  'active'
),
(
  uuid_generate_v4(),
  (SELECT id FROM auth.users WHERE email = 'owner2@test.com' LIMIT 1),
  'Vila Luxury Crâng',
  'Vilă de lux în zona Crâng, cu piscină și grădină amenajată. Perfectă pentru grupuri mari sau evenimente speciale. Oferă toate facilitățile moderne într-un cadru elegant.',
  'villa',
  'Strada Crângului, Nr. 7, Buzău',
  'Buzău',
  'România',
  45.1400,
  26.8200,
  8,
  4,
  3,
  350.00,
  ARRAY['wifi', 'kitchen', 'parking', 'pool', 'garden', 'air_conditioning', 'tv', 'washing_machine', 'bbq'],
  'No smoking, No loud music after 22:00, Pool supervision required for children',
  'active'
);

-- Insert property images
INSERT INTO public.property_images (property_id, image_url, caption, sort_order)
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
  'Interior apartament modern',
  1
FROM public.properties p WHERE p.title = 'Apartament Central Buzău'
UNION ALL
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
  'Bucătărie modernă',
  2
FROM public.properties p WHERE p.title = 'Apartament Central Buzău'
UNION ALL
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
  'Exterior casă tradițională',
  1
FROM public.properties p WHERE p.title = 'Casa de Vacanță Mudava'
UNION ALL
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
  'Grădină și spațiu exterior',
  2
FROM public.properties p WHERE p.title = 'Casa de Vacanță Mudava'
UNION ALL
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=600&fit=crop',
  'Studio modern',
  1
FROM public.properties p WHERE p.title = 'Studio Modern Dacia'
UNION ALL
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop',
  'Vila de lux exterior',
  1
FROM public.properties p WHERE p.title = 'Vila Luxury Crâng'
UNION ALL
SELECT 
  p.id,
  'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=800&h=600&fit=crop',
  'Piscină și grădină',
  2
FROM public.properties p WHERE p.title = 'Vila Luxury Crâng';

-- Insert availability for the next 6 months
INSERT INTO public.availability (property_id, date, is_available, price_override)
SELECT 
  p.id,
  date_series.date,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (5, 6) 
    THEN CASE WHEN random() > 0.2 THEN true ELSE false END  -- Weekend availability (80% available)
    ELSE CASE WHEN random() > 0.1 THEN true ELSE false END  -- Weekday availability (90% available)
  END,
  CASE 
    WHEN EXTRACT(DOW FROM date_series.date) IN (5, 6)
    THEN p.price_per_night * 1.15  -- 15% weekend premium
    ELSE NULL
  END
FROM public.properties p
CROSS JOIN (
  SELECT CURRENT_DATE + INTERVAL '1 day' * generate_series(1, 180) as date
) date_series;

-- Insert some sample bookings
INSERT INTO public.bookings (
  id,
  property_id,
  guest_id,
  check_in_date,
  check_out_date,
  guests_count,
  total_price,
  status,
  guest_name,
  guest_email,
  guest_phone,
  special_requests
) 
SELECT 
  uuid_generate_v4(),
  p.id,
  (SELECT id FROM auth.users WHERE email = 'guest1@test.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '10 days',
  CURRENT_DATE - INTERVAL '7 days',
  2,
  p.price_per_night * 3,
  'completed'::booking_status,
  'John Guest',
  'guest1@test.com',
  '+40734567890',
  'Arrival around 18:00'
FROM public.properties p WHERE p.title = 'Apartament Central Buzău'
UNION ALL
SELECT 
  uuid_generate_v4(),
  p.id,
  (SELECT id FROM auth.users WHERE email = 'guest2@test.com' LIMIT 1),
  CURRENT_DATE + INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '8 days',
  4,
  p.price_per_night * 3,
  'confirmed'::booking_status,
  'Maria Guest',
  'guest2@test.com',
  '+40745678901',
  'Need parking space'
FROM public.properties p WHERE p.title = 'Casa de Vacanță Mudava';

-- Insert some reviews
INSERT INTO public.reviews (
  id,
  property_id,
  reviewer_id,
  booking_id,
  rating,
  comment
)
SELECT 
  uuid_generate_v4(),
  b.property_id,
  b.guest_id,
  b.id,
  5,
  'Apartament excelent! Foarte curat, bine poziționat și cu toate facilitățile necesare. Proprietarul a fost foarte amabil și disponibil. Recomand cu încredere!'
FROM public.bookings b 
JOIN public.properties p ON b.property_id = p.id
WHERE p.title = 'Apartament Central Buzău' AND b.status = 'completed';

-- Insert some messages (property inquiries)
INSERT INTO public.messages (
  id,
  sender_id,
  recipient_id,
  subject,
  content
)
SELECT 
  uuid_generate_v4(),
  (SELECT id FROM auth.users WHERE email = 'guest2@test.com' LIMIT 1),
  p.owner_id,
  'Întrebare despre disponibilitate',
  'Bună ziua! Sunt interesată să rezerv proprietatea pentru weekendul viitor. Aveți disponibilitate pentru 2 persoane? Mulțumesc!'
FROM public.properties p WHERE p.title = 'Vila Luxury Crâng';

-- Summary query to verify inserted data
SELECT 
  'Properties' as table_name,
  COUNT(*) as record_count
FROM public.properties
UNION ALL
SELECT 
  'Property Images',
  COUNT(*)
FROM public.property_images
UNION ALL
SELECT 
  'Availability Records',
  COUNT(*)
FROM public.availability
UNION ALL
SELECT 
  'Bookings',
  COUNT(*)
FROM public.bookings
UNION ALL
SELECT 
  'Reviews',
  COUNT(*)
FROM public.reviews
UNION ALL
SELECT 
  'Messages',
  COUNT(*)
FROM public.messages;

-- Display properties with their details
SELECT 
  p.title,
  p.property_type,
  p.city,
  p.price_per_night,
  p.status,
  u.email as owner_email
FROM public.properties p
JOIN auth.users u ON p.owner_id = u.id
ORDER BY p.title;