# VAMA Buzău - Accommodation Booking Platform

A modern, full-stack accommodation booking platform built with Next.js, TypeScript, Mantine UI, and Supabase. This platform allows property owners to list their accommodations and guests to search, book, and review properties in Buzău, Romania.

## 🚀 Features

### For Guests
- **Property Search & Filtering**: Advanced search with location, dates, guests, price range, amenities
- **Property Details**: Comprehensive property information with image galleries
- **Booking System**: Real-time availability checking and secure booking process
- **Review System**: Rate and review properties after your stay
- **User Dashboard**: Manage bookings, view history, and account settings

### For Property Owners
- **Property Management**: Full CRUD operations for property listings
- **Booking Management**: View and manage incoming bookings
- **Analytics Dashboard**: Track property performance and bookings
- **Calendar Integration**: Real-time availability management

### For Administrators
- **User Management**: Manage user accounts and roles
- **Content Moderation**: Review and approve property listings and reviews
- **Platform Analytics**: Comprehensive platform statistics
- **System Configuration**: Manage platform settings

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, TypeScript, Mantine UI
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Styling**: Mantine Components, CSS-in-JS
- **State Management**: React Context API
- **Authentication**: Supabase Auth with role-based access
- **Database**: PostgreSQL with Row Level Security
- **File Storage**: Supabase Storage for images

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- A Supabase account

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd vama_buzau
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://app.supabase.com)
2. Go to Settings > API to get your project credentials
3. Update the `.env.local` file with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 4. Set Up Database Schema

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy and paste the contents of `database_schema.sql` into the SQL editor
4. Run the script to create all necessary tables, policies, and functions

The schema includes:
- User management with role-based access (Client, Owner, Admin)
- Property listings with full details and amenities
- Booking system with availability checking
- Review and rating system
- Messaging system for communication
- Row Level Security policies for data protection

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── booking/           # Booking pages
│   ├── dashboard/         # User dashboard
│   ├── properties/        # Property pages
│   ├── reviews/           # Review pages
│   └── search/            # Search page
├── components/            # Reusable components
│   └── layout/           # Layout components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── styles/               # Global styles
```

## 🔐 Authentication & Authorization

The platform uses role-based authentication with three user types:

- **Client**: Can search, book properties, and leave reviews
- **Owner**: Can manage properties and bookings
- **Admin**: Full platform access and moderation capabilities

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## 📝 Environment Variables

**Important**: You must configure your Supabase credentials in `.env.local` for the application to work properly.

See the `.env.local` file for all required environment variables.

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Error**: Ensure your environment variables are correctly set with valid Supabase URLs and keys
2. **Authentication Issues**: Check your Supabase auth settings and redirect URLs
3. **Database Errors**: Verify your database schema is properly set up

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review [Supabase documentation](https://supabase.com/docs)
- Check [Mantine documentation](https://mantine.dev/)

---

**VAMA Buzău** - Connecting travelers with unique accommodations in beautiful Buzău, Romania. 🏠✨
