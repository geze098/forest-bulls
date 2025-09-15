import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

// Environment variables validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase client
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

// Note: Server-side functions moved to supabase-server.ts to avoid client-side import issues

// Note: Database helper functions moved to supabase-server.ts to avoid server-side import issues

// Real-time subscriptions
export const subscribeToBookings = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('bookings')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `user_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
};

export const subscribeToPropertyBookings = (propertyId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('property-bookings')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bookings',
        filter: `property_id=eq.${propertyId}`,
      },
      callback
    )
    .subscribe();
};

// Storage helpers
export const uploadPropertyImage = async (file: File, propertyId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('property-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName);
    
  return publicUrl;
};

export const uploadUserAvatar = async (file: File, userId: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `avatars/${userId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);
    
  return publicUrl;
};

// Error handling
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  if (error?.code === 'PGRST301') {
    return 'Resource not found';
  }
  
  if (error?.code === 'PGRST116') {
    return 'Invalid request parameters';
  }
  
  if (error?.message?.includes('JWT')) {
    return 'Authentication required';
  }
  
  if (error?.message?.includes('RLS')) {
    return 'Access denied';
  }
  
  return error?.message || 'An unexpected error occurred';
};

// Type exports for better TypeScript support
export type SupabaseClient = typeof supabase;
export type { Database } from '@/types/database';