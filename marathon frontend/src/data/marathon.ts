export const EVENT = {
  name: "Run Beyond Limits 2026",
  tagline: "Run Beyond Limits",
  subtag: "Push Your Endurance",
  date: "Sunday, September 27, 2026",
  dateISO: "2026-09-27T05:30:00+05:30",
  location: "Chennai · Bengaluru · Salem",
  email: "info@infinitymiles.com",
  phone: "+91 12345 67890",
  supportEmail: "support@infinitymiles.com",
};

export const CITIES = [
  {
    id: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    venue: "Marina Beach Road, Chennai",
    date: "Sunday, September 27, 2026",
    flagOff: "5:30 AM",
    color: "from-rose-500 to-pink-600",
    accent: "magenta" as const,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    venue: "Cubbon Park, Bengaluru",
    date: "Sunday, September 27, 2026",
    flagOff: "5:30 AM",
    color: "from-violet-500 to-purple-600",
    accent: "gold" as const,
  },
  {
    id: "salem",
    name: "Salem",
    state: "Tamil Nadu",
    venue: "Yercaud Road, Salem",
    date: "Sunday, September 27, 2026",
    flagOff: "5:30 AM",
    color: "from-amber-500 to-orange-500",
    accent: "cream" as const,
  },
];

export type Race = {
  id: string;
  distance: string;
  type: string;
  subtype: string;
  minAge: string;
  fee: string;
  popular?: boolean;
  accent: "magenta" | "gold" | "cream";
};

export const RACES: Race[] = [
  { id: "21k", distance: "21.1", type: "Half Marathon", subtype: "Timed Run", minAge: "18 Years", fee: "999", accent: "magenta" },
  { id: "10k", distance: "10", type: "10 KM Run", subtype: "Timed Run", minAge: "16 Years", fee: "799", popular: true, accent: "gold" },
  { id: "5k", distance: "5", type: "Fun Run", subtype: "Non Timed Run", minAge: "12 Years", fee: "499", accent: "cream" },
];

export const FAQS = [
  { q: "Who can participate in the Run Beyond Limits marathon?", a: "Anyone who meets the minimum age requirement for their chosen race category can participate. Runners of all fitness levels are welcome — from first-timers to seasoned athletes." },
  { q: "Which cities is Run Beyond Limits happening in?", a: "The Run Beyond Limits 2026 is happening simultaneously across three cities — Chennai, Bengaluru, and Salem on September 27, 2026." },
  { q: "Is there a virtual run option?", a: "Currently, we only offer physical participation to ensure the best race day experience and safety protocols." },
  { q: "What is included in the registration fee?", a: "Your registration includes a premium race t-shirt, an RFID timing chip bib, a finisher's medal, e-certificate, on-course hydration, and a post-race breakfast." },
  { q: "Where and when can I collect my bib?", a: "Bibs can be collected at the Run Beyond Limits Expo in your registered city on September 25–26, 2026, from 10:00 AM to 7:00 PM." },
  { q: "Is the race timed?", a: "The 21.1 KM and 10 KM races are professionally timed with certified timing chips. The 5 KM is a Fun Run and non-timed." },
  { q: "How do I register?", a: "Click any Register Now button to complete the online registration form and select your preferred city. Registration closes on September 18, 2026." },
  { q: "Is there an age limit?", a: "Yes. Minimum ages are 18 (21.1 KM), 16 (10 KM) and 12 (5 KM). Participants under 18 must have parental consent." },
  { q: "Can I transfer my registration?", a: "Registrations are non-transferable. Please write to support@infinitymiles.com for any changes." },
  { q: "What happens at the event?", a: "The morning begins with warm-up at 5:00 AM, flag-off at 5:30 AM, followed by the race, breakfast, recovery zone and an awards celebration." },
];
