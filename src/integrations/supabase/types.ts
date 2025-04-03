export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accepted_quotes: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          price: string
          professional_id: string
          professional_name: string
          quote_id: string
          request_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          id?: string
          price: string
          professional_id: string
          professional_name: string
          quote_id: string
          request_id: string
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          price?: string
          professional_id?: string
          professional_name?: string
          quote_id?: string
          request_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          id: string
          is_super_admin: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_super_admin?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      articles: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          image: string | null
          published: boolean | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          image?: string | null
          published?: boolean | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_accounts: {
        Row: {
          business_name: string
          business_type: string
          created_at: string
          id: string
          owner_name: string
          phone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_name: string
          business_type: string
          created_at?: string
          id?: string
          owner_name: string
          phone: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_name?: string
          business_type?: string
          created_at?: string
          id?: string
          owner_name?: string
          phone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      professional_ratings: {
        Row: {
          company_name: string | null
          created_at: string
          customer_name: string
          customer_phone: string
          id: string
          professional_name: string
          professional_phone: string
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_recommendation: number
          rating_timing: number
          rating_value: number
          recommendation: string | null
          weighted_average: number
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          customer_name: string
          customer_phone: string
          id?: string
          professional_name: string
          professional_phone: string
          rating_cleanliness: number
          rating_communication: number
          rating_overall: number
          rating_quality: number
          rating_recommendation: number
          rating_timing: number
          rating_value: number
          recommendation?: string | null
          weighted_average: number
        }
        Update: {
          company_name?: string | null
          created_at?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          professional_name?: string
          professional_phone?: string
          rating_cleanliness?: number
          rating_communication?: number
          rating_overall?: number
          rating_quality?: number
          rating_recommendation?: number
          rating_timing?: number
          rating_value?: number
          recommendation?: string | null
          weighted_average?: number
        }
        Relationships: []
      }
      professionals: {
        Row: {
          about: string | null
          created_at: string | null
          id: string
          image: string | null
          location: string
          name: string
          phone_number: string | null
          profession: string
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          location: string
          name: string
          phone_number?: string | null
          profession: string
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string | null
          id?: string
          image?: string | null
          location?: string
          name?: string
          phone_number?: string | null
          profession?: string
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          created_at: string
          description: string
          estimated_time: string | null
          id: string
          price: string
          professional_id: string
          request_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_time?: string | null
          id?: string
          price: string
          professional_id: string
          request_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_time?: string | null
          id?: string
          price?: string
          professional_id?: string
          request_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "quotes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          completed_work: boolean | null
          created_at: string | null
          date: string | null
          id: string
          phone_number: string
          profession: string | null
          professional_id: string | null
          professional_name: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_work?: boolean | null
          created_at?: string | null
          date?: string | null
          id?: string
          phone_number: string
          profession?: string | null
          professional_id?: string | null
          professional_name: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_work?: boolean | null
          created_at?: string | null
          date?: string | null
          id?: string
          phone_number?: string
          profession?: string | null
          professional_id?: string | null
          professional_name?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          created_at: string
          date: string
          description: string
          id: string
          location: string
          status: string
          timing: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          description: string
          id?: string
          location: string
          status?: string
          timing?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          id?: string
          location?: string
          status?: string
          timing?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read: boolean
          recipient_email: string | null
          recipient_id: string | null
          sender_id: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_email?: string | null
          recipient_id?: string | null
          sender_id: string
          subject: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read?: boolean
          recipient_email?: string | null
          recipient_id?: string | null
          sender_id?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          phone: string | null
          profile_image: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          profile_image?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users_signup: {
        Row: {
          city: string
          company_name: string | null
          created_at: string
          email: string
          experience: string
          first_name: string
          id: string
          last_name: string
          other_work_field: string | null
          phone: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          work_fields: string
          work_regions: string
        }
        Insert: {
          city: string
          company_name?: string | null
          created_at?: string
          email: string
          experience: string
          first_name: string
          id?: string
          last_name: string
          other_work_field?: string | null
          phone: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          work_fields: string
          work_regions: string
        }
        Update: {
          city?: string
          company_name?: string | null
          created_at?: string
          email?: string
          experience?: string
          first_name?: string
          id?: string
          last_name?: string
          other_work_field?: string | null
          phone?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          work_fields?: string
          work_regions?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_is_admin_user: {
        Args: {
          user_id_param: string
        }
        Returns: boolean
      }
      check_is_super_admin:
        | {
            Args: Record<PropertyKey, never>
            Returns: boolean
          }
        | {
            Args: {
              user_id_param: string
            }
            Returns: boolean
          }
      check_is_super_admin_user: {
        Args: {
          user_id_param: string
        }
        Returns: boolean
      }
      create_first_super_admin: {
        Args: {
          admin_email: string
        }
        Returns: string
      }
      create_super_admin: {
        Args: {
          admin_email_param: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
