export interface Participant {
  // PostgreSQL SERIAL returns an integer; useAdmin normalises this to a string
  // after fetch so it can be used as a React key and for avatar colour hashing.
  _id: string;
  fullName: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  emergencyContact: string;
  emergencyContactName?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  size: string;
  cityId: string;
  raceId: string;
  paymentStatus: "Pending" | "Paid";
  paymentTxnId?: string;
  bibNumber?: string;
  registrationDate: string;
  finishTime?: string;
  raceStatus?: "Pending" | "Finished" | "DNF" | "DNS";
  kitCollected?: "No" | "Yes" | string;
  kitCollectedAt?: string;
  attendeeCheckedIn?: "No" | "Yes" | string;
  checkedInAt?: string;
  verifyCode?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface TShirtRow {
  size: string;
  total: number;
  races: { "3k": number; "5k": number; "10k": number };
}

export interface ReportRow {
  race: string;
  registered: number;
  paid: number;
  pending: number;
  revenue: number;
}

export type AdminTab = "dashboard" | "players" | "tshirt" | "reports" | "contacts" | "results" | "whatsapp" | "crm";

// Standard base prices (dynamic city-wise calculation supported in useAdmin)
export const RACE_PRICES: Record<string, number> = { "3k": 399, "5k": 599, "10k": 799, "21k": 899 };

export const CHART_COLORS = [
  "#1E3A8A", "#F97316", "#059669", "#E11D48", "#8B5CF6", "#06B6D4",
  "#F59E0B", "#10B981", "#6366F1", "#EC4899", "#14B8A6", "#84CC16"
];

const API_ORIGIN = import.meta.env.VITE_API_URL || (typeof window === "undefined" ? "http://localhost:5000" : "");
export const API_BASE = `${API_ORIGIN.replace(/\/$/, "")}/api/admin`;
