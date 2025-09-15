// Core type definitions for the Vama Buzau booking platform

export type UserRole = 'client' | 'owner' | 'administrator';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PropertyStatus = 'draft' | 'active' | 'inactive' | 'suspended';
export type RoomType = 'single' | 'double' | 'twin' | 'suite' | 'apartment' | 'villa';
export type AmenityCategory = 'basic' | 'comfort' | 'entertainment' | 'business' | 'accessibility';

// User types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  avatar_url?: string;
  role: UserRole;
  is_active: boolean;
  email_verified: boolean;
  preferred_language: string;
  marketing_consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  bio?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Property types
export interface Property {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  property_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  check_in_time: string;
  check_out_time: string;
  min_stay_nights: number;
  max_stay_nights: number;
  cancellation_policy?: string;
  house_rules?: string;
  status: PropertyStatus;
  featured: boolean;
  average_rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
  // Relations
  owner?: User;
  images?: PropertyImage[];
  rooms?: Room[];
  amenities?: Amenity[];
  reviews?: Review[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Room {
  id: string;
  property_id: string;
  name: string;
  description?: string;
  room_type: RoomType;
  max_occupancy: number;
  bed_count: number;
  bathroom_count: number;
  size_sqm?: number;
  base_price: number;
  weekend_price?: number;
  cleaning_fee: number;
  security_deposit: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  property?: Property;
  images?: RoomImage[];
  amenities?: Amenity[];
  availability?: AvailabilityCalendar[];
}

export interface RoomImage {
  id: string;
  room_id: string;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

export interface Amenity {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  category: AmenityCategory;
  is_active: boolean;
  created_at: string;
}

// Booking types
export interface Booking {
  id: string;
  user_id: string;
  property_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  adult_count: number;
  child_count: number;
  total_nights: number;
  base_amount: number;
  cleaning_fee: number;
  service_fee: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  status: BookingStatus;
  special_requests?: string;
  guest_notes?: string;
  owner_notes?: string;
  confirmation_code: string;
  cancelled_at?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  property?: Property;
  room?: Room;
  review?: Review;
}

export interface AvailabilityCalendar {
  id: string;
  room_id: string;
  date: string;
  is_available: boolean;
  price_override?: number;
  min_stay_override?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Review types
export interface Review {
  id: string;
  booking_id: string;
  user_id: string;
  property_id: string;
  rating: number;
  title?: string;
  comment?: string;
  cleanliness_rating?: number;
  location_rating?: number;
  value_rating?: number;
  service_rating?: number;
  is_verified: boolean;
  is_featured: boolean;
  is_moderated: boolean;
  moderated_by?: string;
  moderated_at?: string;
  owner_response?: string;
  owner_response_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  user?: User;
  property?: Property;
  booking?: Booking;
}

// Notification types
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
  is_read: boolean;
  is_email_sent: boolean;
  email_sent_at?: string;
  action_url?: string;
  expires_at?: string;
  created_at: string;
}

// Search and filter types
export interface SearchFilters {
  location?: string;
  check_in_date?: string;
  check_out_date?: string;
  guest_count?: number;
  adult_count?: number;
  child_count?: number;
  min_price?: number;
  max_price?: number;
  property_type?: string[];
  room_type?: RoomType[];
  amenities?: string[];
  min_rating?: number;
  sort_by?: 'price_asc' | 'price_desc' | 'rating_desc' | 'distance' | 'newest';
}

export interface SearchResult {
  properties: Property[];
  total_count: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  role: UserRole;
  marketing_consent: boolean;
}

export interface PropertyForm {
  name: string;
  description: string;
  property_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  check_in_time: string;
  check_out_time: string;
  min_stay_nights: number;
  max_stay_nights: number;
  cancellation_policy?: string;
  house_rules?: string;
  amenities: string[];
}

export interface RoomForm {
  name: string;
  description?: string;
  room_type: RoomType;
  max_occupancy: number;
  bed_count: number;
  bathroom_count: number;
  size_sqm?: number;
  base_price: number;
  weekend_price?: number;
  cleaning_fee: number;
  security_deposit: number;
  amenities: string[];
}

export interface BookingForm {
  property_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  adult_count: number;
  child_count: number;
  special_requests?: string;
}

export interface ReviewForm {
  rating: number;
  title?: string;
  comment?: string;
  cleanliness_rating?: number;
  location_rating?: number;
  value_rating?: number;
  service_rating?: number;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  session_id: string;
  event_type: string;
  event_data: Record<string, any>;
  page_url?: string;
  user_agent?: string;
  ip_address?: string;
  created_at: string;
}

export interface DashboardStats {
  total_properties: number;
  total_bookings: number;
  total_revenue: number;
  average_rating: number;
  occupancy_rate: number;
  recent_bookings: Booking[];
  recent_reviews: Review[];
}

// Utility types
export interface PaginationParams {
  page: number;
  per_page: number;
}

export interface SortParams {
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

export interface DateRange {
  start_date: string;
  end_date: string;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface FormState<T> extends LoadingState {
  data: T;
  isDirty: boolean;
  isValid: boolean;
}

// Store types for Zustand
export interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export interface BookingStore {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  fetchBookings: () => Promise<void>;
  createBooking: (data: BookingForm) => Promise<Booking>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
}

export interface PropertyStore {
  properties: Property[];
  currentProperty: Property | null;
  searchResults: SearchResult | null;
  isLoading: boolean;
  fetchProperties: (filters?: SearchFilters) => Promise<void>;
  fetchProperty: (id: string) => Promise<void>;
  createProperty: (data: PropertyForm) => Promise<Property>;
  updateProperty: (id: string, data: Partial<PropertyForm>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  searchProperties: (filters: SearchFilters) => Promise<void>;
}