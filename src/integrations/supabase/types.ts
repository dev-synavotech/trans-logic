export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          base_price: number | null
          booking_number: string
          created_at: string | null
          destination: string
          destination_lat: number | null
          destination_lng: number | null
          distance_km: number | null
          estimated_hours: number | null
          id: string
          origin: string
          origin_lat: number | null
          origin_lng: number | null
          package_description: string | null
          package_height: number | null
          package_length: number | null
          package_weight: number | null
          package_width: number | null
          pickup_date: string
          provider_id: string | null
          route_id: string | null
          status: string | null
          total_price: number | null
          tracking_updates: Json | null
          truck_type_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          base_price?: number | null
          booking_number: string
          created_at?: string | null
          destination: string
          destination_lat?: number | null
          destination_lng?: number | null
          distance_km?: number | null
          estimated_hours?: number | null
          id?: string
          origin: string
          origin_lat?: number | null
          origin_lng?: number | null
          package_description?: string | null
          package_height?: number | null
          package_length?: number | null
          package_weight?: number | null
          package_width?: number | null
          pickup_date: string
          provider_id?: string | null
          route_id?: string | null
          status?: string | null
          total_price?: number | null
          tracking_updates?: Json | null
          truck_type_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          base_price?: number | null
          booking_number?: string
          created_at?: string | null
          destination?: string
          destination_lat?: number | null
          destination_lng?: number | null
          distance_km?: number | null
          estimated_hours?: number | null
          id?: string
          origin?: string
          origin_lat?: number | null
          origin_lng?: number | null
          package_description?: string | null
          package_height?: number | null
          package_length?: number | null
          package_weight?: number | null
          package_width?: number | null
          pickup_date?: string
          provider_id?: string | null
          route_id?: string | null
          status?: string | null
          total_price?: number | null
          tracking_updates?: Json | null
          truck_type_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_truck_type_id_fkey"
            columns: ["truck_type_id"]
            isOneToOne: false
            referencedRelation: "truck_types"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      routes: {
        Row: {
          created_at: string | null
          destination: string
          destination_lat: number | null
          destination_lng: number | null
          distance_km: number | null
          estimated_hours: number | null
          id: string
          is_active: boolean | null
          origin: string
          origin_lat: number | null
          origin_lng: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination: string
          destination_lat?: number | null
          destination_lng?: number | null
          distance_km?: number | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          origin: string
          origin_lat?: number | null
          origin_lng?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination?: string
          destination_lat?: number | null
          destination_lng?: number | null
          distance_km?: number | null
          estimated_hours?: number | null
          id?: string
          is_active?: boolean | null
          origin?: string
          origin_lat?: number | null
          origin_lng?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      truck_types: {
        Row: {
          capacity_kg: number
          code: string
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          price_per_km: number
        }
        Insert: {
          capacity_kg: number
          code: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_per_km: number
        }
        Update: {
          capacity_kg?: number
          code?: string
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_per_km?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "support" | "affiliate" | "customer" | "provider"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "support", "affiliate", "customer", "provider"],
    },
  },
} as const
