export const EVENT = {
  name: "Infinity Marathon 2027",
  upperName: "INFINITY MARATHON 2027",
  tagline: "Run Beyond Limits",
  subtag: "Infinity Marathon 2027 – Run Beyond Limits!",
  date: "May 1 – 30, 2027",
  dateISO: "2027-05-01T05:30:00+05:30",
  location: "12 Cities Across India",
  email: "info@infinitymiles.com",
  phone: "+91 12345 67890",
  supportEmail: "support@infinitymiles.com",
};

export type RaceId = "3k" | "5k" | "10k";

export type City = {
  id: string;
  order: number;
  name: string;
  state: string;
  venue: string;
  date: string;
  shortDate: string;
  expoDates: string;
  dateISO: string;
  flagOff: string;
  bibPrefix: string;
  color: string;
  accent: "magenta" | "gold" | "cream";
  fees: Record<RaceId, number>;
  locationName: string;
  tagline: string;
  startPoint: string;
  startTime: string;
  elevation: string;
  landmarks: string[];
  embedUrl: string;
};

export const CITIES: City[] = [
  {
    id: "vadodara",
    order: 1,
    name: "Vadodara",
    state: "Gujarat",
    venue: "Akota Stadium & Sayaji Baug Corridor, Vadodara",
    date: "Saturday, 1 May 2027 (May Day)",
    shortDate: "1 May (Sat · May Day)",
    expoDates: "April 29–30, 2027",
    dateISO: "2027-05-01T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "VAD",
    color: "from-rose-500 to-pink-600",
    accent: "magenta",
    fees: { "3k": 399, "5k": 599, "10k": 799 },
    locationName: "Sayaji Baug Cultural Loop",
    tagline: "Kick off May Day across Vadodara's heritage gardens and broad boulevards.",
    startPoint: "Akota Stadium Main Gate, Vadodara",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (+12m)",
    landmarks: ["Akota Stadium", "Sayaji Baug", "Kala Ghoda Circle", "Fatehgunj Avenue"],
    embedUrl: "https://maps.google.com/maps?q=Sayaji+Baug+Vadodara&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "chennai",
    order: 2,
    name: "Chennai",
    state: "Tamil Nadu",
    venue: "Marina Beach Outer Promenade, Chennai",
    date: "Saturday, 1 May 2027 (May Day)",
    shortDate: "1 May (Sat · May Day)",
    expoDates: "April 29–30, 2027",
    dateISO: "2027-05-01T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "CHE",
    color: "from-orange-500 to-rose-600",
    accent: "gold",
    fees: { "3k": 449, "5k": 649, "10k": 849 },
    locationName: "Marina Beach Coastal Route",
    tagline: "Run alongside the world's second-longest natural urban beach at sunrise.",
    startPoint: "Marina Beach Lighthouse, Kamarajar Salai",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (Sea Level)",
    landmarks: ["Lighthouse", "Gandhi Statue", "Napier Bridge", "Kamarajar Salai"],
    embedUrl: "https://maps.google.com/maps?q=Marina+Beach+Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "mumbai",
    order: 3,
    name: "Mumbai",
    state: "Maharashtra",
    venue: "Marine Drive Promenade, Nariman Point, Mumbai",
    date: "Sunday, 2 May 2027",
    shortDate: "2 May (Sun)",
    expoDates: "April 30 – May 1, 2027",
    dateISO: "2027-05-02T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "MUM",
    color: "from-indigo-500 to-purple-600",
    accent: "magenta",
    fees: { "3k": 499, "5k": 699, "10k": 899 },
    locationName: "Marine Drive Queen's Necklace",
    tagline: "Stride along Mumbai's iconic sea-facing curve with Arabian Sea breeze.",
    startPoint: "NCPA Grounds, Nariman Point, Mumbai",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (Coastal)",
    landmarks: ["Nariman Point", "Marine Drive", "Girgaon Chowpatty", "Air India Building"],
    embedUrl: "https://maps.google.com/maps?q=Marine+Drive+Mumbai&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "kolkata",
    order: 4,
    name: "Kolkata",
    state: "West Bengal",
    venue: "Red Road & Maidan Grounds, Kolkata",
    date: "Sunday, 2 May 2027",
    shortDate: "2 May (Sun)",
    expoDates: "April 30 – May 1, 2027",
    dateISO: "2027-05-02T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "KOL",
    color: "from-emerald-500 to-teal-600",
    accent: "cream",
    fees: { "3k": 399, "5k": 599, "10k": 799 },
    locationName: "Red Road Heritage Circuit",
    tagline: "Glide past Victoria Memorial and the historic greens of the Maidan.",
    startPoint: "Red Road Start Arch, Maidan, Kolkata",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (+9m)",
    landmarks: ["Red Road", "Victoria Memorial", "Eden Gardens", "Fort William"],
    embedUrl: "https://maps.google.com/maps?q=Red+Road+Maidan+Kolkata&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "surat",
    order: 5,
    name: "Surat",
    state: "Gujarat",
    venue: "Dumas Road & Tapi Riverfront, Surat",
    date: "Sunday, 9 May 2027",
    shortDate: "9 May (Sun)",
    expoDates: "May 7–8, 2027",
    dateISO: "2027-05-09T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "SUR",
    color: "from-amber-500 to-orange-600",
    accent: "gold",
    fees: { "3k": 399, "5k": 599, "10k": 799 },
    locationName: "Dumas & Tapi Riverfront Stretch",
    tagline: "Fast, wide roads through Surat's Diamond City corridor.",
    startPoint: "VR Mall Plaza, Dumas Road, Surat",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (+14m)",
    landmarks: ["Dumas Road", "Tapi Riverfront", "SVNIT Circle", "Piplod Promenade"],
    embedUrl: "https://maps.google.com/maps?q=Dumas+Road+Surat&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "delhi",
    order: 6,
    name: "Delhi",
    state: "Delhi NCR",
    venue: "Jawaharlal Nehru Stadium & Kartavya Path, Delhi",
    date: "Sunday, 9 May 2027",
    shortDate: "9 May (Sun)",
    expoDates: "May 7–8, 2027",
    dateISO: "2027-05-09T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "DEL",
    color: "from-blue-600 to-indigo-700",
    accent: "magenta",
    fees: { "3k": 499, "5k": 699, "10k": 899 },
    locationName: "JLN Stadium & Lutyens' Avenue",
    tagline: "Run through the heart of the national capital past grand monuments.",
    startPoint: "Gate 1, Jawaharlal Nehru Stadium, New Delhi",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Gentle (+18m)",
    landmarks: ["JLN Stadium", "India Gate", "Lodhi Gardens", "Kartavya Path"],
    embedUrl: "https://maps.google.com/maps?q=Jawaharlal+Nehru+Stadium+Delhi&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "bengaluru",
    order: 7,
    name: "Bengaluru",
    state: "Karnataka",
    venue: "Kanteerava Stadium & Cubbon Park, Bengaluru",
    date: "Sunday, 16 May 2027",
    shortDate: "16 May (Sun)",
    expoDates: "May 14–15, 2027",
    dateISO: "2027-05-16T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "BLR",
    color: "from-violet-500 to-purple-600",
    accent: "gold",
    fees: { "3k": 499, "5k": 699, "10k": 899 },
    locationName: "Vidhana Soudha & Cubbon Park Route",
    tagline: "Feel the crisp morning air under the lush canopies of the Garden City.",
    startPoint: "Sree Kanteerava Stadium, Kasturba Road",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "+45m Rolling",
    landmarks: ["Kanteerava Stadium", "Cubbon Park", "Vidhana Soudha", "MG Road"],
    embedUrl: "https://maps.google.com/maps?q=Cubbon+Park+Bengaluru&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "jaipur",
    order: 8,
    name: "Jaipur",
    state: "Rajasthan",
    venue: "Albert Hall & JLN Marg Corridor, Jaipur",
    date: "Sunday, 16 May 2027",
    shortDate: "16 May (Sun)",
    expoDates: "May 14–15, 2027",
    dateISO: "2027-05-16T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "JAI",
    color: "from-pink-500 to-rose-600",
    accent: "cream",
    fees: { "3k": 399, "5k": 599, "10k": 799 },
    locationName: "Pink City Heritage Loop",
    tagline: "A royal morning run past Albert Hall Museum and Rambagh Circle.",
    startPoint: "Albert Hall Museum Forecourt, Ram Niwas Garden",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (+20m)",
    landmarks: ["Albert Hall Museum", "Rambagh Circle", "JLN Marg", "Central Park"],
    embedUrl: "https://maps.google.com/maps?q=Albert+Hall+Museum+Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "hyderabad",
    order: 9,
    name: "Hyderabad",
    state: "Telangana",
    venue: "Necklace Road & Hussain Sagar Lake, Hyderabad",
    date: "Sunday, 23 May 2027",
    shortDate: "23 May (Sun)",
    expoDates: "May 21–22, 2027",
    dateISO: "2027-05-23T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "HYD",
    color: "from-cyan-500 to-blue-600",
    accent: "magenta",
    fees: { "3k": 449, "5k": 649, "10k": 849 },
    locationName: "Necklace Road Lakeside Loop",
    tagline: "Scenic lakefront running around Hussain Sagar with energetic cheer zones.",
    startPoint: "People's Plaza, Necklace Road, Hyderabad",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "+30m Gentle",
    landmarks: ["People's Plaza", "Necklace Road", "Tank Bund", "Sanjeevaiah Park"],
    embedUrl: "https://maps.google.com/maps?q=Necklace+Road+Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "pune",
    order: 10,
    name: "Pune",
    state: "Maharashtra",
    venue: "Balewadi Stadium & Baner Expressway, Pune",
    date: "Sunday, 23 May 2027",
    shortDate: "23 May (Sun)",
    expoDates: "May 21–22, 2027",
    dateISO: "2027-05-23T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "PUN",
    color: "from-fuchsia-500 to-purple-600",
    accent: "gold",
    fees: { "3k": 449, "5k": 649, "10k": 849 },
    locationName: "Balewadi Sports Complex Route",
    tagline: "Smooth athletic boulevard starting from Pune's premier sports hub.",
    startPoint: "Shree Shiv Chhatrapati Sports Complex, Balewadi",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "+35m Rolling",
    landmarks: ["Balewadi Stadium", "Baner High Street", "Pashan Link", "University Circle"],
    embedUrl: "https://maps.google.com/maps?q=Balewadi+Stadium+Pune&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "goa",
    order: 11,
    name: "Goa",
    state: "Goa",
    venue: "Miramar Beach Promenade, Panaji, Goa",
    date: "Sunday, 30 May 2027",
    shortDate: "30 May (Sun)",
    expoDates: "May 28–29, 2027",
    dateISO: "2027-05-30T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "GOA",
    color: "from-teal-500 to-emerald-600",
    accent: "cream",
    fees: { "3k": 499, "5k": 699, "10k": 899 },
    locationName: "Miramar & Mandovi Coastal Run",
    tagline: "Finish the May 2027 season along Goa's palm-lined oceanfront.",
    startPoint: "Miramar Beach Circle, Panaji, Goa",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (Coastal)",
    landmarks: ["Miramar Beach", "Dona Paula Road", "Campal Promenade", "Mandovi Riverfront"],
    embedUrl: "https://maps.google.com/maps?q=Miramar+Beach+Goa&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
  {
    id: "ahmedabad",
    order: 12,
    name: "Ahmedabad",
    state: "Gujarat",
    venue: "Sabarmati Riverfront Promenade, Ahmedabad",
    date: "Sunday, 30 May 2027",
    shortDate: "30 May (Sun)",
    expoDates: "May 28–29, 2027",
    dateISO: "2027-05-30T05:30:00+05:30",
    flagOff: "5:30 AM",
    bibPrefix: "AMD",
    color: "from-amber-500 to-orange-500",
    accent: "magenta",
    fees: { "3k": 399, "5k": 599, "10k": 799 },
    locationName: "Sabarmati Riverfront Track",
    tagline: "Traffic-free waterfront promenade built for personal-best finishes.",
    startPoint: "Sabarmati Riverfront Event Centre, Paldi",
    startTime: "05:30 AM (10K) | 06:00 AM (5K) | 06:30 AM (3K)",
    elevation: "Flat (+10m)",
    landmarks: ["Riverfront Park", "Atal Pedestrian Bridge", "Ellis Bridge", "Subhash Bridge"],
    embedUrl: "https://maps.google.com/maps?q=Sabarmati+Riverfront+Ahmedabad&t=&z=13&ie=UTF8&iwloc=&output=embed",
  },
];

export type Race = {
  id: RaceId;
  distance: string;
  type: string;
  subtype: string;
  minAge: string;
  minAgeNum: number;
  fee: string;
  popular?: boolean;
  accent: "magenta" | "gold" | "cream";
};

export const RACES: Race[] = [
  { id: "3k", distance: "3", type: "3K Fun Run", subtype: "Non Timed Fun Run", minAge: "10 Years", minAgeNum: 10, fee: "399", accent: "cream" },
  { id: "5k", distance: "5", type: "5K Fitness Run", subtype: "Timed Run", minAge: "12 Years", minAgeNum: 12, fee: "599", popular: true, accent: "gold" },
  { id: "10k", distance: "10", type: "10K Challenge", subtype: "Timed Run", minAge: "16 Years", minAgeNum: 16, fee: "799", accent: "magenta" },
];

export function getCityById(cityId?: string | null): City {
  const key = String(cityId || "").trim().toLowerCase();
  return CITIES.find((c) => c.id === key) || CITIES[0];
}

export function getRaceById(raceId?: string | null): Race {
  const key = String(raceId || "").trim().toLowerCase();
  return RACES.find((r) => r.id === key) || RACES[1];
}

export function getRaceFee(cityId?: string | null, raceId?: string | null): number {
  const city = getCityById(cityId);
  const rKey = String(raceId || "5k").trim().toLowerCase() as RaceId;
  if (city.fees[rKey] !== undefined) {
    return city.fees[rKey];
  }
  return Number(getRaceById(rKey).fee) || 599;
}

export const FAQS = [
  {
    q: "Who can participate in Infinity Marathon 2027?",
    a: "Anyone who meets the minimum age requirement for their chosen race category can participate. Runners of all fitness levels are welcome — from beginners in the 3K Fun Run to endurance athletes in the 10K Challenge.",
  },
  {
    q: "Which cities is Infinity Marathon 2027 happening in?",
    a: "Infinity Marathon 2027 – Run Beyond Limits spans 12 cities across India throughout May 2027: Vadodara & Chennai (1 May), Mumbai & Kolkata (2 May), Surat & Delhi (9 May), Bengaluru & Jaipur (16 May), Hyderabad & Pune (23 May), and Goa & Ahmedabad (30 May).",
  },
  {
    q: "What race categories are available in each city?",
    a: "Every one of the 12 host cities features 3K Fun Run, 5K Fitness Run, and 10K Challenge categories with city-wise registration fees.",
  },
  {
    q: "Why do registration fees vary by city?",
    a: "Registration fees are tailored per host city based on local venue logistics and race operations — starting from ₹399 (3K), ₹599 (5K), and ₹799 (10K).",
  },
  {
    q: "What is included in the registration fee?",
    a: "Your registration includes a premium dry-fit race t-shirt, an official BIB (with RFID timing chip for timed runs), a finisher's medal, e-certificate, on-course hydration, and a post-race breakfast.",
  },
  {
    q: "Where and when can I collect my bib?",
    a: "Bibs and T-shirts are collected at the Infinity Marathon Expo in your registered city 1–2 days prior to your city's race date from 10:00 AM to 7:00 PM.",
  },
  {
    q: "Is there an age limit?",
    a: "Yes. Minimum ages are 16 years (10K Challenge), 12 years (5K Fitness Run), and 10 years (3K Fun Run). Participants under 18 must have parental consent.",
  },
  {
    q: "Can I transfer my registration?",
    a: "Registrations are non-transferable. Please write to support@infinitymiles.com for any assistance.",
  },
  {
    q: "What happens on race day?",
    a: "Assembly & warm-up begin at 5:00 AM followed by flag-off at 5:30 AM, post-race recovery & breakfast, and finisher medal & e-certificate distribution.",
  },
];
