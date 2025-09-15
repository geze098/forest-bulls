import { createMiddlewareSupabaseClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/dashboard': ['client', 'owner', 'administrator'],
  '/dashboard/properties': ['owner', 'administrator'],
  '/dashboard/bookings': ['client', 'owner', 'administrator'],
  '/dashboard/reviews': ['client', 'owner', 'administrator'],
  '/dashboard/analytics': ['owner', 'administrator'],
  '/admin': ['administrator'],
  '/admin/users': ['administrator'],
  '/admin/properties': ['administrator'],
  '/admin/analytics': ['administrator'],
  '/admin/settings': ['administrator'],
  '/owner': ['owner', 'administrator'],
  '/owner/properties': ['owner', 'administrator'],
  '/owner/bookings': ['owner', 'administrator'],
  '/owner/analytics': ['owner', 'administrator'],
};

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/properties',
  '/property',
  '/search',
  '/about',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/api/auth',
  '/api/public',
];

// API routes that require authentication
const protectedApiRoutes = {
  '/api/bookings': ['client', 'owner', 'administrator'],
  '/api/properties': ['owner', 'administrator'],
  '/api/reviews': ['client', 'owner', 'administrator'],
  '/api/users': ['administrator'],
  '/api/analytics': ['owner', 'administrator'],
  '/api/admin': ['administrator'],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth/callback') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Create Supabase client
  const { supabase, response } = createMiddlewareSupabaseClient(request);

  try {
    // Get authenticated user (secure method)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      // Only log non-session-missing errors as actual errors
      if (userError.message !== 'Auth session missing!') {
        console.error('User authentication error:', userError);
      }
    }
    let userRole: string | null = null;

    // Get user role if authenticated
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single() as { data: { role: string } | null };
      
      userRole = profile?.role || null;
      
      // Update last login timestamp
      await supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() } as any)
        .eq('id', user.id);
    }

    // Check if route is public
    const isPublicRoute = publicRoutes.some(route => {
      if (route === '/') return pathname === '/';
      return pathname.startsWith(route);
    });

    // Handle API routes
    if (pathname.startsWith('/api/')) {
      // Check if API route requires authentication
      const protectedApiRoute = Object.keys(protectedApiRoutes).find(route => 
        pathname.startsWith(route)
      );

      if (protectedApiRoute) {
        if (!user) {
          return NextResponse.json(
            { error: 'Authentication required' },
            { status: 401 }
          );
        }

        const requiredRoles = protectedApiRoutes[protectedApiRoute as keyof typeof protectedApiRoutes];
        if (!userRole || !requiredRoles.includes(userRole)) {
          return NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          );
        }
      }

      return response;
    }

    // Handle page routes
    if (isPublicRoute) {
      // Redirect authenticated users away from auth pages
      if (user && pathname.startsWith('/auth/')) {
        const redirectUrl = new URL('/dashboard', request.url);
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // Check if route requires authentication
    const protectedRoute = Object.keys(protectedRoutes).find(route => 
      pathname.startsWith(route)
    );

    if (protectedRoute) {
      // Redirect to login if not authenticated
      if (!user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check role permissions
      const requiredRoles = protectedRoutes[protectedRoute as keyof typeof protectedRoutes];
      if (!userRole || !requiredRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        let redirectPath = '/dashboard';
        if (userRole === 'administrator') {
          redirectPath = '/admin';
        } else if (userRole === 'owner') {
          redirectPath = '/owner';
        }
        
        const redirectUrl = new URL(redirectPath, request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // Handle role-based redirects for dashboard routes
    if (pathname === '/dashboard' && userRole) {
      if (userRole === 'administrator') {
        const adminUrl = new URL('/admin', request.url);
        return NextResponse.redirect(adminUrl);
      } else if (userRole === 'owner') {
        const ownerUrl = new URL('/owner', request.url);
        return NextResponse.redirect(ownerUrl);
      }
    }

    // Add user info to headers for server components
    if (user && userRole) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', user.id);
      requestHeaders.set('x-user-role', userRole);
      requestHeaders.set('x-user-email', user.email || '');
      
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    
    // On error, allow public routes and redirect protected routes to login
    const isPublicRouteOnError = publicRoutes.some(route => {
      if (route === '/') return pathname === '/';
      return pathname.startsWith(route);
    });
    
    if (isPublicRouteOnError) {
      return NextResponse.next();
    }
    
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

// Helper function to get user from request headers (for server components)
export function getUserFromHeaders(headers: Headers) {
  const userId = headers.get('x-user-id');
  const userRole = headers.get('x-user-role');
  const userEmail = headers.get('x-user-email');
  
  if (!userId || !userRole) {
    return null;
  }
  
  return {
    id: userId,
    role: userRole as 'client' | 'owner' | 'administrator',
    email: userEmail || '',
  };
}

// Helper function to check if user has required role
export function hasRequiredRole(
  userRole: string | null,
  requiredRoles: string[]
): boolean {
  return userRole !== null && requiredRoles.includes(userRole);
}

// Helper function to get redirect URL based on user role
export function getRoleBasedRedirect(role: string): string {
  switch (role) {
    case 'administrator':
      return '/admin';
    case 'owner':
      return '/owner';
    case 'client':
    default:
      return '/dashboard';
  }
}