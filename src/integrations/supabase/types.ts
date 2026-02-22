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
      evidence: {
        Row: {
          id: string
          payload_json: Json | null
          snippets_json: Json | null
          source: string
          trend_id: string
        }
        Insert: {
          id?: string
          payload_json?: Json | null
          snippets_json?: Json | null
          source: string
          trend_id: string
        }
        Update: {
          id?: string
          payload_json?: Json | null
          snippets_json?: Json | null
          source?: string
          trend_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_trend_id_fkey"
            columns: ["trend_id"]
            isOneToOne: false
            referencedRelation: "trends"
            referencedColumns: ["id"]
          },
        ]
      }
      radar_runs: {
        Row: {
          category: string
          created_at: string
          id: string
          status: string
          time_window: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          status?: string
          time_window?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          status?: string
          time_window?: number
        }
        Relationships: []
      }
      trends: {
        Row: {
          cac_band: string | null
          coherence: number
          competition: number
          dominance_prob: number
          entry_window: string
          fad_risk: number
          feasibility: number
          format_recommendation: string | null
          founder_brief: string | null
          google_trends_data: Json | null
          id: string
          margin_band: string | null
          payback_estimate: string | null
          price_ladder: string | null
          reddit_mentions: Json | null
          regulatory_risk: string | null
          run_id: string
          structural_shift: number
          tam_band: string | null
          trend_name: string
          trend_score: number
          velocity: number
        }
        Insert: {
          cac_band?: string | null
          coherence?: number
          competition?: number
          dominance_prob?: number
          entry_window?: string
          fad_risk?: number
          feasibility?: number
          format_recommendation?: string | null
          founder_brief?: string | null
          google_trends_data?: Json | null
          id?: string
          margin_band?: string | null
          payback_estimate?: string | null
          price_ladder?: string | null
          reddit_mentions?: Json | null
          regulatory_risk?: string | null
          run_id: string
          structural_shift?: number
          tam_band?: string | null
          trend_name: string
          trend_score?: number
          velocity?: number
        }
        Update: {
          cac_band?: string | null
          coherence?: number
          competition?: number
          dominance_prob?: number
          entry_window?: string
          fad_risk?: number
          feasibility?: number
          format_recommendation?: string | null
          founder_brief?: string | null
          google_trends_data?: Json | null
          id?: string
          margin_band?: string | null
          payback_estimate?: string | null
          price_ladder?: string | null
          reddit_mentions?: Json | null
          regulatory_risk?: string | null
          run_id?: string
          structural_shift?: number
          tam_band?: string | null
          trend_name?: string
          trend_score?: number
          velocity?: number
        }
        Relationships: [
          {
            foreignKeyName: "trends_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "radar_runs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
