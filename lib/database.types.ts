export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          wallet_address: string | null;
          state_preference: string | null;
          paid_state_guides: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          wallet_address?: string | null;
          state_preference?: string | null;
          paid_state_guides?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          wallet_address?: string | null;
          state_preference?: string | null;
          paid_state_guides?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      state_guides: {
        Row: {
          guide_id: string;
          state_name: string;
          content_url: string;
          language: "en" | "es";
          content: Json;
          price: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          guide_id: string;
          state_name: string;
          content_url: string;
          language: "en" | "es";
          content: Json;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          guide_id?: string;
          state_name?: string;
          content_url?: string;
          language?: "en" | "es";
          content?: Json;
          price?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      recorded_incidents: {
        Row: {
          incident_id: string;
          user_id: string;
          timestamp: string;
          location: Json;
          recording_url: string | null;
          alert_sent: boolean;
          duration: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          incident_id: string;
          user_id: string;
          timestamp: string;
          location: Json;
          recording_url?: string | null;
          alert_sent: boolean;
          duration?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          incident_id?: string;
          user_id?: string;
          timestamp?: string;
          location?: Json;
          recording_url?: string | null;
          alert_sent?: boolean;
          duration?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "recorded_incidents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      trusted_contacts: {
        Row: {
          contact_id: string;
          user_id: string;
          name: string;
          phone_number: string;
          farcaster_id: string | null;
          relationship: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          contact_id: string;
          user_id: string;
          name: string;
          phone_number: string;
          farcaster_id?: string | null;
          relationship: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          contact_id?: string;
          user_id?: string;
          name?: string;
          phone_number?: string;
          farcaster_id?: string | null;
          relationship?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trusted_contacts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
        ];
      };
      emergency_alerts: {
        Row: {
          alert_id: string;
          incident_id: string;
          contact_id: string;
          sent_at: string;
          status: "sent" | "delivered" | "failed";
          created_at: string;
        };
        Insert: {
          alert_id: string;
          incident_id: string;
          contact_id: string;
          sent_at: string;
          status: "sent" | "delivered" | "failed";
          created_at?: string;
        };
        Update: {
          alert_id?: string;
          incident_id?: string;
          contact_id?: string;
          sent_at?: string;
          status?: "sent" | "delivered" | "failed";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_alerts_incident_id_fkey";
            columns: ["incident_id"];
            referencedRelation: "recorded_incidents";
            referencedColumns: ["incident_id"];
          },
          {
            foreignKeyName: "emergency_alerts_contact_id_fkey";
            columns: ["contact_id"];
            referencedRelation: "trusted_contacts";
            referencedColumns: ["contact_id"];
          },
        ];
      };
      payment_intents: {
        Row: {
          intent_id: string;
          user_id: string;
          amount: number;
          currency: "USD" | "USDC";
          status: "pending" | "completed" | "failed";
          guide_id: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          intent_id: string;
          user_id: string;
          amount: number;
          currency: "USD" | "USDC";
          status: "pending" | "completed" | "failed";
          guide_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          intent_id?: string;
          user_id?: string;
          amount?: number;
          currency?: "USD" | "USDC";
          status?: "pending" | "completed" | "failed";
          guide_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "payment_intents_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "payment_intents_guide_id_fkey";
            columns: ["guide_id"];
            referencedRelation: "state_guides";
            referencedColumns: ["guide_id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
