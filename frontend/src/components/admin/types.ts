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
  races: { "5k": number; "10k": number; "21k": number };
}

export interface ReportRow {
  race: string;
  registered: number;
  paid: number;
  pending: number;
  revenue: number;
}

export type AdminTab = "dashboard" | "players" | "tshirt" | "reports" | "contacts" | "results" | "whatsapp";

export const RACE_PRICES: Record<string, number> = { "5k": 499, "10k": 799, "21k": 999 };

export const CHART_COLORS = ["#1E3A8A", "#F97316", "#059669", "#E11D48", "#8B5CF6", "#06B6D4"];

export const API_BASE = `${(import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://marathon-website-2.onrender.com" : "http://localhost:5000")).replace(/\/$/, "")}/api/admin`;
