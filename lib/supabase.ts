import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser usage
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Admin client for server-side operations
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Helper functions for common operations
export const supabaseHelpers = {
  // User operations
  async createUser(userData: {
    userId: string;
    walletAddress?: string;
    statePreference?: string;
  }) {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          user_id: userData.userId,
          wallet_address: userData.walletAddress,
          state_preference: userData.statePreference,
          paid_state_guides: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserById(userId: string) {
    const { data, error } = await supabase
      .from("users")
      .select(
        `
        *,
        trusted_contacts (*)
      `,
      )
      .eq("user_id", userId)
      .single();

    if (error) throw error;
    return data;
  },

  // State guide operations
  async getStateGuides(language: "en" | "es" = "en") {
    const { data, error } = await supabase
      .from("state_guides")
      .select("*")
      .eq("language", language)
      .order("state_name");

    if (error) throw error;
    return data;
  },

  async getStateGuideById(guideId: string) {
    const { data, error } = await supabase
      .from("state_guides")
      .select("*")
      .eq("guide_id", guideId)
      .single();

    if (error) throw error;
    return data;
  },

  // Incident operations
  async createIncident(incidentData: {
    userId: string;
    location: { latitude: number; longitude: number; address?: string };
    recordingUrl?: string;
    alertSent: boolean;
    duration?: number;
    notes?: string;
  }) {
    const { data, error } = await supabase
      .from("recorded_incidents")
      .insert([
        {
          incident_id: crypto.randomUUID(),
          user_id: incidentData.userId,
          timestamp: new Date().toISOString(),
          location: incidentData.location,
          recording_url: incidentData.recordingUrl,
          alert_sent: incidentData.alertSent,
          duration: incidentData.duration,
          notes: incidentData.notes,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserIncidents(userId: string) {
    const { data, error } = await supabase
      .from("recorded_incidents")
      .select("*")
      .eq("user_id", userId)
      .order("timestamp", { ascending: false });

    if (error) throw error;
    return data;
  },

  // Trusted contacts operations
  async createTrustedContact(contactData: {
    userId: string;
    name: string;
    phoneNumber: string;
    farcasterId?: string;
    relationship: string;
  }) {
    const { data, error } = await supabase
      .from("trusted_contacts")
      .insert([
        {
          contact_id: crypto.randomUUID(),
          user_id: contactData.userId,
          name: contactData.name,
          phone_number: contactData.phoneNumber,
          farcaster_id: contactData.farcasterId,
          relationship: contactData.relationship,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrustedContact(
    contactId: string,
    updates: Partial<{
      name: string;
      phoneNumber: string;
      farcasterId: string;
      relationship: string;
    }>,
  ) {
    const { data, error } = await supabase
      .from("trusted_contacts")
      .update({
        name: updates.name,
        phone_number: updates.phoneNumber,
        farcaster_id: updates.farcasterId,
        relationship: updates.relationship,
        updated_at: new Date().toISOString(),
      })
      .eq("contact_id", contactId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTrustedContact(contactId: string) {
    const { error } = await supabase
      .from("trusted_contacts")
      .delete()
      .eq("contact_id", contactId);

    if (error) throw error;
  },

  // Emergency alerts operations
  async createEmergencyAlert(alertData: {
    incidentId: string;
    contactId: string;
  }) {
    const { data, error } = await supabase
      .from("emergency_alerts")
      .insert([
        {
          alert_id: crypto.randomUUID(),
          incident_id: alertData.incidentId,
          contact_id: alertData.contactId,
          sent_at: new Date().toISOString(),
          status: "sent",
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateAlertStatus(
    alertId: string,
    status: "sent" | "delivered" | "failed",
  ) {
    const { data, error } = await supabase
      .from("emergency_alerts")
      .update({ status })
      .eq("alert_id", alertId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
