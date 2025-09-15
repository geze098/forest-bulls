export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'client' | 'owner' | 'administrator'
          email_verified: boolean
          phone_verified: boolean
          preferred_language: string
          preferred_currency: string
          date_of_birth: string | null
          gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          address: string | null
          city: string | null
          country: string | null
          postal_code: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          marketing_consent: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'client' | 'owner' | 'administrator'
          email_verified?: boolean
          phone_verified?: boolean
          preferred_language?: string
          preferred_currency?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          address?: string | null
          city?: string | null
          country?: string | null
          postal_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          marketing_consent?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'client' | 'owner' | 'administrator'
          email_verified?: boolean
          phone_verified?: boolean
          preferred_language?: string
          preferred_currency?: string
          date_of_birth?: string | null
          gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null
          address?: string | null
          city?: string | null
          country?: string | null
          postal_code?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          marketing_consent?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          property_type: 'hotel' | 'apartment' | 'house' | 'villa' | 'hostel' | 'resort' | 'other'
          address: string
          city: string
          country: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          base_price: number
          currency: string
          max_guests: number
          bedrooms: number
          bathrooms: number
          area_sqm: number | null
          check_in_time: string
          check_out_time: string
          minimum_stay: number
          maximum_stay: number | null
          cancellation_policy: 'flexible' | 'moderate' | 'strict'
          house_rules: string | null
          status: 'draft' | 'active' | 'inactive' | 'suspended'
          featured: boolean
          instant_booking: boolean
          rating_average: number
          rating_count: number
          views_count: number
          bookings_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description: string
          property_type: 'hotel' | 'apartment' | 'house' | 'villa' | 'hostel' | 'resort' | 'other'
          address: string
          city: string
          country: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          base_price: number
          currency?: string
          max_guests: number
          bedrooms: number
          bathrooms: number
          area_sqm?: number | null
          check_in_time: string
          check_out_time: string
          minimum_stay?: number
          maximum_stay?: number | null
          cancellation_policy?: 'flexible' | 'moderate' | 'strict'
          house_rules?: string | null
          status?: 'draft' | 'active' | 'inactive' | 'suspended'
          featured?: boolean
          instant_booking?: boolean
          rating_average?: number
          rating_count?: number
          views_count?: number
          bookings_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          property_type?: 'hotel' | 'apartment' | 'house' | 'villa' | 'hostel' | 'resort' | 'other'
          address?: string
          city?: string
          country?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          base_price?: number
          currency?: string
          max_guests?: number
          bedrooms?: number
          bathrooms?: number
          area_sqm?: number | null
          check_in_time?: string
          check_out_time?: string
          minimum_stay?: number
          maximum_stay?: number | null
          cancellation_policy?: 'flexible' | 'moderate' | 'strict'
          house_rules?: string | null
          status?: 'draft' | 'active' | 'inactive' | 'suspended'
          featured?: boolean
          instant_booking?: boolean
          rating_average?: number
          rating_count?: number
          views_count?: number
          bookings_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          property_id: string
          room_type_id: string | null
          check_in_date: string
          check_out_date: string
          guests_count: number
          adults_count: number
          children_count: number
          infants_count: number
          total_amount: number
          currency: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed'
          payment_method: string | null
          confirmation_code: string
          special_requests: string | null
          guest_notes: string | null
          host_notes: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          refund_amount: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          room_type_id?: string | null
          check_in_date: string
          check_out_date: string
          guests_count: number
          adults_count: number
          children_count?: number
          infants_count?: number
          total_amount: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          payment_status?: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed'
          payment_method?: string | null
          confirmation_code?: string
          special_requests?: string | null
          guest_notes?: string | null
          host_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          refund_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          room_type_id?: string | null
          check_in_date?: string
          check_out_date?: string
          guests_count?: number
          adults_count?: number
          children_count?: number
          infants_count?: number
          total_amount?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          payment_status?: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed'
          payment_method?: string | null
          confirmation_code?: string
          special_requests?: string | null
          guest_notes?: string | null
          host_notes?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          refund_amount?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          property_id: string
          booking_id: string | null
          rating: number
          title: string | null
          comment: string | null
          cleanliness_rating: number | null
          location_rating: number | null
          value_rating: number | null
          service_rating: number | null
          amenities_rating: number | null
          status: 'pending' | 'approved' | 'rejected'
          helpful_count: number
          response_from_owner: string | null
          response_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          property_id: string
          booking_id?: string | null
          rating: number
          title?: string | null
          comment?: string | null
          cleanliness_rating?: number | null
          location_rating?: number | null
          value_rating?: number | null
          service_rating?: number | null
          amenities_rating?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          helpful_count?: number
          response_from_owner?: string | null
          response_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          property_id?: string
          booking_id?: string | null
          rating?: number
          title?: string | null
          comment?: string | null
          cleanliness_rating?: number | null
          location_rating?: number | null
          value_rating?: number | null
          service_rating?: number | null
          amenities_rating?: number | null
          status?: 'pending' | 'approved' | 'rejected'
          helpful_count?: number
          response_from_owner?: string | null
          response_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      amenities: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          category: 'basic' | 'safety' | 'entertainment' | 'kitchen' | 'bathroom' | 'outdoor' | 'accessibility' | 'services'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          category: 'basic' | 'safety' | 'entertainment' | 'kitchen' | 'bathroom' | 'outdoor' | 'accessibility' | 'services'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          category?: 'basic' | 'safety' | 'entertainment' | 'kitchen' | 'bathroom' | 'outdoor' | 'accessibility' | 'services'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      property_amenities: {
        Row: {
          id: string
          property_id: string
          amenity_id: string
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          amenity_id: string
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          amenity_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          alt_text: string | null
          display_order: number
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          alt_text?: string | null
          display_order?: number
          is_primary?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
      room_types: {
        Row: {
          id: string
          property_id: string
          name: string
          description: string | null
          base_price: number
          max_occupancy: number
          bed_configuration: string | null
          room_size_sqm: number | null
          quantity_available: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          name: string
          description?: string | null
          base_price: number
          max_occupancy: number
          bed_configuration?: string | null
          room_size_sqm?: number | null
          quantity_available?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          name?: string
          description?: string | null
          base_price?: number
          max_occupancy?: number
          bed_configuration?: string | null
          room_size_sqm?: number | null
          quantity_available?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_types_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_property_rating: {
        Args: {
          property_id: string
        }
        Returns: undefined
      }
      generate_confirmation_code: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_role: 'client' | 'owner' | 'administrator'
      property_type: 'hotel' | 'apartment' | 'house' | 'villa' | 'hostel' | 'resort' | 'other'
      property_status: 'draft' | 'active' | 'inactive' | 'suspended'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
      payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed'
      review_status: 'pending' | 'approved' | 'rejected'
      cancellation_policy: 'flexible' | 'moderate' | 'strict'
      amenity_category: 'basic' | 'safety' | 'entertainment' | 'kitchen' | 'bathroom' | 'outdoor' | 'accessibility' | 'services'
      gender: 'male' | 'female' | 'other' | 'prefer_not_to_say'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[keyof Database]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never