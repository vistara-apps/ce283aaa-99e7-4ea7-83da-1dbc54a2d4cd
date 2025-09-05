export interface User {
  userId: string;
  walletAddress?: string;
  statePreference?: string;
  paidStateGuides: string[];
  trustedContacts: TrustedContact[];
}

export interface StateGuide {
  guideId: string;
  stateName: string;
  contentUrl: string;
  language: "en" | "es";
  price: number;
  content: {
    whatToSay: string[];
    whatNotToSay: string[];
    yourRights: string[];
    emergencyContacts: string[];
  };
}

export interface RecordedIncident {
  incidentId: string;
  userId: string;
  timestamp: Date;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  recordingUrl?: string;
  alertSent: boolean;
  duration?: number;
  notes?: string;
}

export interface TrustedContact {
  contactId: string;
  userId: string;
  name: string;
  phoneNumber: string;
  farcasterId?: string;
  relationship: string;
}

export interface EmergencyAlert {
  alertId: string;
  incidentId: string;
  contactId: string;
  sentAt: Date;
  status: "sent" | "delivered" | "failed";
}

export interface PaymentIntent {
  intentId: string;
  userId: string;
  amount: number;
  currency: "USD" | "USDC";
  status: "pending" | "completed" | "failed";
  guideId?: string;
}
