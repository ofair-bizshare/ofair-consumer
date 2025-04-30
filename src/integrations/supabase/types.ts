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
          category: string | null
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
          category?: string | null
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
          category?: string | null
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
      leads: {
        Row: {
          budget: number | null
          client_address: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string
          description: string
          id: string
          image_url: string | null
          location: string
          notes: string | null
          professional_id: string | null
          share_percentage: number
          status: string
          title: string
          work_date: string | null
          work_time: string | null
        }
        Insert: {
          budget?: number | null
          client_address?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
          location: string
          notes?: string | null
          professional_id?: string | null
          share_percentage?: number
          status?: string
          title: string
          work_date?: string | null
          work_time?: string | null
        }
        Update: {
          budget?: number | null
          client_address?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          notes?: string | null
          professional_id?: string | null
          share_percentage?: number
          status?: string
          title?: string
          work_date?: string | null
          work_time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          id: string
          is_read: boolean
          professional_id: string
          related_id: string | null
          related_type: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          is_read?: boolean
          professional_id: string
          related_id?: string | null
          related_type?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          is_read?: boolean
          professional_id?: string
          related_id?: string | null
          related_type?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
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
          areas: string | null
          certifications: string[] | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          experience_years: number | null
          id: string
          image: string | null
          is_verified: boolean | null
          location: string
          name: string
          phone_number: string | null
          profession: string
          rating: number | null
          review_count: number | null
          specialties: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          work_hours: string | null
          working_hours: string | null
        }
        Insert: {
          about?: string | null
          areas?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          image?: string | null
          is_verified?: boolean | null
          location: string
          name: string
          phone_number?: string | null
          profession: string
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          work_hours?: string | null
          working_hours?: string | null
        }
        Update: {
          about?: string | null
          areas?: string | null
          certifications?: string[] | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          experience_years?: number | null
          id?: string
          image?: string | null
          is_verified?: boolean | null
          location?: string
          name?: string
          phone_number?: string | null
          profession?: string
          rating?: number | null
          review_count?: number | null
          specialties?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          work_hours?: string | null
          working_hours?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          client: string
          created_at: string | null
          end_date: string
          id: string
          price: number
          professional_id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client: string
          created_at?: string | null
          end_date: string
          id?: string
          price: number
          professional_id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client?: string
          created_at?: string | null
          end_date?: string
          id?: string
          price?: number
          professional_id?: string
          progress?: number
          start_date?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          created_at: string
          description: string
          estimated_completion: string | null
          id: string
          lead_id: string | null
          lower_price_value: number | null
          lower_price_willing: boolean | null
          price: number
          professional_id: string | null
          sample_image_url: string | null
          status: string
        }
        Insert: {
          created_at?: string
          description: string
          estimated_completion?: string | null
          id?: string
          lead_id?: string | null
          lower_price_value?: number | null
          lower_price_willing?: boolean | null
          price: number
          professional_id?: string | null
          sample_image_url?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          description?: string
          estimated_completion?: string | null
          id?: string
          lead_id?: string | null
          lower_price_value?: number | null
          lower_price_willing?: boolean | null
          price?: number
          professional_id?: string | null
          sample_image_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "proposals_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
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
          sample_image_url: string | null
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
          sample_image_url?: string | null
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
          sample_image_url?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_admin_status: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_is_admin_user: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_is_super_admin: {
        Args: Record<PropertyKey, never> | { user_id_param: string }
        Returns: boolean
      }
      check_is_super_admin_user: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      check_super_admin_status: {
        Args: { user_id_param: string }
        Returns: boolean
      }
      create_first_super_admin: {
        Args: { admin_email: string }
        Returns: string
      }
      create_super_admin: {
        Args: { admin_email_param: string }
        Returns: string
      }
      get_professional_by_identifier: {
        Args: { identifier_param: string; is_email_param: boolean }
        Returns: {
          id: string
          user_id: string
          name: string
          phone_number: string
          email: string
          profession: string
          location: string
          specialties: string[]
          image: string
          about: string
        }[]
      }
      get_projects_for_professional: {
        Args: { professional_id_param: string }
        Returns: {
          client: string
          created_at: string | null
          end_date: string
          id: string
          price: number
          professional_id: string
          progress: number
          start_date: string
          status: string
          title: string
          updated_at: string | null
        }[]
      }
      insert_project: {
        Args: { project_data: Json }
        Returns: string
      }
      is_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin_check: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin_safe: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_project: {
        Args: { project_id_param: string; project_data: Json }
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
