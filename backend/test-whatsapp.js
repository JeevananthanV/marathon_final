/**
 * Test the WhatsApp automation without sending real messages.
 * Run: node test-whatsapp.js
 *
 * Set WHATSAPP_PROVIDER=mock (default when unconfigured) so this only
 * prints the messages that WOULD be sent.
 */
import {
  normalizePhone,
  isWhatsAppConfigured,
  activeProvider,
  buildRegistrationMessage,
  buildPaymentMessage,
} from "./whatsapp.js";

console.log("=== Provider ===");
console.log("configured:", isWhatsAppConfigured());
console.log("active    :", activeProvider());

console.log("\n=== Phone normalization (E.164) ===");
const samples = ["9876543210", "09876543210", "+91 98765 43210", "919876543210", "123", "", null];
for (const s of samples) {
  console.log(`  ${JSON.stringify(s).padEnd(20)} -> ${normalizePhone(s)}`);
}

const sampleParticipant = {
  _id: 42,
  fullName: "Arun Kumar",
  phone: "9876543210",
  cityId: "chennai",
  raceId: "10k",
  size: "L",
  paymentStatus: "Paid",
  bibNumber: "CHE-10K-0042",
};

console.log("\n=== Registration message ===");
console.log(buildRegistrationMessage(sampleParticipant));

console.log("\n=== Payment message ===");
console.log(buildPaymentMessage(sampleParticipant, "http://localhost:5000"));