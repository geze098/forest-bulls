# Quick Test Data Setup

This is a simplified guide to quickly set up test data for your Vama Buzau application.

## Step 1: Create Test Users (Choose One Method)

### Method A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Users**
3. Click **"Add user"** and create these 5 test users:

```
owner1@test.com - TestPass123!
owner2@test.com - TestPass123!
guest1@test.com - TestPass123!
guest2@test.com - TestPass123!
admin@test.com - TestPass123!
```

### Method B: Using Your Application

1. Start your app: `npm run dev`
2. Go to the registration page
3. Register each of the 5 test users above

## Step 2: Run the Database Script

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire content of `insert_test_data.sql`
4. Click **"Run"**

## Step 3: Verify Setup

After running the script, you should see:
- 4 properties in Buzău
- Multiple property images
- Availability data for the next 6 months
- 2 sample bookings
- 2 reviews
- 1 message inquiry

## Step 4: Test the Application

### Login Credentials

| Email | Password | Role | Use For |
|-------|----------|------|----------|
| owner1@test.com | TestPass123! | Owner | Property management |
| owner2@test.com | TestPass123! | Owner | Multiple owner testing |
| guest1@test.com | TestPass123! | Guest | Booking and reviews |
| guest2@test.com | TestPass123! | Guest | Additional guest testing |
| admin@test.com | TestPass123! | Admin | Admin functions |

### Test Scenarios

1. **Search Properties**: Go to `/search` and filter by dates, guests, etc.
2. **View Property Details**: Click on any property to see full details
3. **Make a Booking**: Select dates and complete booking process
4. **Property Management**: Login as owner to manage properties
5. **Admin Functions**: Login as admin to manage users and properties

## Properties Available for Testing

1. **Apartament Central Buzău** - €150/night - 2 bedrooms, 4 guests
2. **Casa de Vacanță Mudava** - €200/night - 3 bedrooms, 6 guests
3. **Studio Modern Dacia** - €100/night - 1 bedroom, 2 guests
4. **Vila Luxury Crâng** - €350/night - 4 bedrooms, 8 guests

## Troubleshooting

**If properties don't show up:**
- Check that the SQL script ran without errors
- Verify users were created successfully
- Check browser console for any JavaScript errors

**If booking fails:**
- Make sure you're selecting future dates
- Check that the property has availability for those dates
- Verify you're logged in as a guest user

**If images don't load:**
- The images use Unsplash URLs which should work automatically
- Check your internet connection
- Verify the image URLs in the database

That's it! Your test environment should now be fully functional for testing all website features.