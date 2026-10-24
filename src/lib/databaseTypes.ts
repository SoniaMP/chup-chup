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
    PostgrestVersion: "14.18"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_usage: {
        Row: {
          day: string
          owner_id: string
          used: number
        }
        Insert: {
          day?: string
          owner_id: string
          used?: number
        }
        Update: {
          day?: string
          owner_id?: string
          used?: number
        }
        Relationships: []
      }
      collections: {
        Row: {
          id: string
          owner_id: string
          position: string
          title: string
        }
        Insert: {
          id?: string
          owner_id?: string
          position: string
          title: string
        }
        Update: {
          id?: string
          owner_id?: string
          position?: string
          title?: string
        }
        Relationships: []
      }
      cookbook_recipes: {
        Row: {
          cookbook_id: string
          position: string
          recipe_id: string
        }
        Insert: {
          cookbook_id: string
          position: string
          recipe_id: string
        }
        Update: {
          cookbook_id?: string
          position?: string
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cookbook_recipes_cookbook_id_fkey"
            columns: ["cookbook_id"]
            isOneToOne: false
            referencedRelation: "cookbooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cookbook_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      cookbooks: {
        Row: {
          collection_id: string | null
          id: string
          is_system: boolean
          library_image: string | null
          owner_id: string
          position: string
          title: string
        }
        Insert: {
          collection_id?: string | null
          id?: string
          is_system?: boolean
          library_image?: string | null
          owner_id?: string
          position: string
          title: string
        }
        Update: {
          collection_id?: string | null
          id?: string
          is_system?: boolean
          library_image?: string | null
          owner_id?: string
          position?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cookbooks_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          cook_min: number | null
          created_at: string
          id: string
          ingredients: Json
          locale: string
          owner_id: string
          photo_active: string
          photo_enhanced: string | null
          photo_original: string | null
          prep_min: number | null
          raw_input: string
          servings: number | null
          steps: Json
          title: string
          updated_at: string
        }
        Insert: {
          cook_min?: number | null
          created_at?: string
          id?: string
          ingredients: Json
          locale: string
          owner_id?: string
          photo_active?: string
          photo_enhanced?: string | null
          photo_original?: string | null
          prep_min?: number | null
          raw_input: string
          servings?: number | null
          steps: Json
          title: string
          updated_at?: string
        }
        Update: {
          cook_min?: number | null
          created_at?: string
          id?: string
          ingredients?: Json
          locale?: string
          owner_id?: string
          photo_active?: string
          photo_enhanced?: string | null
          photo_original?: string | null
          prep_min?: number | null
          raw_input?: string
          servings?: number | null
          steps?: Json
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          is_favorite: boolean
          library_image: string | null
          notes: string | null
          owner_id: string
          recipe_id: string
          saved_at: string
        }
        Insert: {
          is_favorite?: boolean
          library_image?: string | null
          notes?: string | null
          owner_id?: string
          recipe_id: string
          saved_at?: string
        }
        Update: {
          is_favorite?: boolean
          library_image?: string | null
          notes?: string | null
          owner_id?: string
          recipe_id?: string
          saved_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_recipes_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_ai_use: {
        Args: { p_limit: number; p_owner: string }
        Returns: boolean
      }
      release_ai_use: { Args: { p_owner: string }; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
