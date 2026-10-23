import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Calendar, MapPin, Clock, Trophy, Flame, ShieldCheck, HeartPulse, 
  ArrowRight, Users, Navigation, Compass, ChevronRight, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";
import { EVENT, CITIES, RACES } from "@/data/marathon";
import RaceCategories from "@/components/marathon/RaceCategories";
import EventTimeline from "@/components/marathon/EventTimeline";
import BibPickupSection from "@/components/marathon/BibPickupSection";

export const Route = createFileRoute("/event")({
  head: () => ({
    meta: [
      { title: "Event Details & Trail Maps · Run Beyond Limits 2026" },
      { name: "description", content: "Explore the official race course maps, elevation profiles, category slots, and event schedule for Run Beyond Limits 2026." },
    ],
  }),
  component: EventPage,
});

type CategorySlot = {
  id: string;
  name: string;
  type: string;
  fee: number;
  total_slots: number;
  slots_claimed: number;
  slots_remaining: number;
};

function EventPage() {
  const [selectedCity, setSelectedCity] = useState("chennai");
  const [categories, setCategories] = useState<CategorySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    fetch("/api/v1/marathon/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((err) => console.error("Error fetching slots:", err))
      .finally(() => setLoadingSlots(false));
  }, []);

  const activeCity = CITIES.find((c) => c.id === selectedCity) || CITIES[0];

  return (
    <div className="gradient-page min-h-screen text-charcoal">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-navy text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider uppercase text-pink-300 backdrop-blur-md mb-4">
            <Flame className="h-4 w-4 text-orange" /> Official Event Hub 2026
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto">
            Run Beyond Limits <span className="text-[#e9387c]">2026</span>
          </h1>
          <p className="mt-4 text-base md:text-xl text-slate-300 max-w-2xl mx-auto">
            Experience the flagship marathon uniting runners across South India. Certified routes, precision timing chips, and an electric atmosphere.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm font-medium text-slate-200">
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Calendar className="h-4 w-4 text-[#e9387c]" /> {EVENT.date}
            </span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <Clock className="h-4 w-4 text-[#e9387c]" /> Flag-off 5:30 AM
            </span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <MapPin className="h-4 w-4 text-[#e9387c]" /> 3 Cities: Chennai · Bengaluru · Salem
            </span>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              to="/register"
              className="rounded-full bg-[#e9387c] hover:bg-[#d82a6e] text-white px-8 py-3.5 text-sm font-bold shadow-soft transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              Register Now <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#trail-maps"
              className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3.5 text-sm font-semibold transition-all inline-flex items-center gap-2"
            >
              View Trail Maps
            </a>
          </div>
        </div>
      </section>

      {/* Live Ticket Availability Counters */}
      <section className="py-12 bg-white border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#e9387c]">Live Availability</p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-charcoal">Race Category Capacity</h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Slots fill quickly. Live inventory is updated in real time upon payment confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(categories.length > 0 ? categories : [
              { id: "21k", name: "21.1 KM Half Marathon", type: "Timed Run", fee: 999, total_slots: 1000, slots_claimed: 154, slots_remaining: 846 },
              { id: "10k", name: "10 KM Challenge", type: "Timed Run", fee: 799, total_slots: 1500, slots_claimed: 340, slots_remaining: 1160 },
              { id: "5k", name: "5 KM Fun Run", type: "Non Timed Run", fee: 499, total_slots: 2000, slots_claimed: 410, slots_remaining: 1590 },
            ]).map((cat) => {
              const pct = Math.min(100, Math.round((cat.slots_claimed / cat.total_slots) * 100));
              return (
                <div key={cat.id} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase">{cat.type}</span>
                      <h3 className="text-xl font-black text-charcoal">{cat.name}</h3>
                    </div>
                    <span className="font-display text-2xl font-black text-[#e9387c]">₹{cat.fee}</span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                      <span>Claimed: {cat.slots_claimed} / {cat.total_slots}</span>
                      <span className="text-[#e9387c]">{cat.slots_remaining} slots left</span>
                    </div>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-[#e9387c] rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(8, pct)}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    to="/register"
                    className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-charcoal hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-all"
                  >
                    Select Category <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trail Maps & Elevation Profiles */}
      <section id="trail-maps" className="py-16 md:py-24 bg-slate-50 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e9387c]">Certified Courses</span>
            <h2 className="mt-2 text-3xl md:text-5xl font-black text-charcoal">Trail Maps & Elevation</h2>
            <p className="mt-3 text-slate-600">
              Explore the carefully engineered race routes featuring strategic aid stations, gentle gradients, and energetic spectator zones.
            </p>

            {/* City Selector */}
            <div className="mt-6 inline-flex p-1.5 rounded-full bg-white border border-slate-200 shadow-sm gap-1">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCity(c.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedCity === c.id
                      ? "bg-[#e9387c] text-white shadow-soft"
                      : "text-slate-600 hover:text-charcoal"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Active City Venue Details */}
          <div className="mb-10 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-pink-50 text-[#e9387c] flex items-center justify-center shrink-0">
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-charcoal text-lg">{activeCity.name} Venue</h4>
                <p className="text-sm text-slate-500">{activeCity.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-slate-400 block text-xs">Flag Off</span>
                <span className="font-bold text-charcoal">{activeCity.flagOff}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Climate Avg</span>
                <span className="font-bold text-charcoal">24°C / 75°F</span>
              </div>
              <div>
                <span className="text-slate-400 block text-xs">Route Surface</span>
                <span className="font-bold text-charcoal">100% Paved Tarmac</span>
              </div>
            </div>
          </div>

          {/* 3 Interactive Trail Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 21.1K Half Marathon Map */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-slate-900 via-slate-800 to-pink-950 p-6 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10 font-black text-9xl text-white">21</div>
                <div>
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Championship Course
                  </span>
                  <h3 className="mt-2 text-2xl font-black">21.1 KM Half Marathon</h3>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-300">Cut-off: 3 Hours 30 Mins</span>
                  <span className="text-xs font-bold text-pink-300">Elevation: +45m</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Navigation className="h-4 w-4 text-[#e9387c]" /> Aid Stations</span>
                    <span className="font-bold text-charcoal">6 Points (Every 2.5 KM)</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#e9387c]" /> Timing Checkpoints</span>
                    <span className="font-bold text-charcoal">5K, 10K, 15K, Finish</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-[#e9387c]" /> Medical Support</span>
                    <span className="font-bold text-charcoal">4 Mobile Ambulances</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-[#e9387c]" /> Finisher Medal</span>
                    <span className="font-bold text-charcoal">Die-cast Medal + Tee</span>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#e9387c] hover:bg-[#d82a6e] text-white py-3 text-xs font-bold transition-all shadow-soft"
                >
                  Register for 21.1K <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 10K Challenge Map */}
            <div className="rounded-3xl bg-white border-2 border-[#e9387c]/30 overflow-hidden shadow-soft hover:shadow-lg transition-all relative">
              <div className="absolute top-3 right-3 z-10 rounded-full bg-[#e9387c] text-white text-[9px] font-black uppercase px-2.5 py-0.5 tracking-wider">
                Most Popular
              </div>
              <div className="h-48 bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 p-6 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10 font-black text-9xl text-white">10</div>
                <div>
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Timed Challenge
                  </span>
                  <h3 className="mt-2 text-2xl font-black">10 KM Challenge</h3>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-300">Cut-off: 1 Hour 45 Mins</span>
                  <span className="text-xs font-bold text-pink-300">Elevation: +18m</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Navigation className="h-4 w-4 text-[#e9387c]" /> Aid Stations</span>
                    <span className="font-bold text-charcoal">3 Points (2.5K, 5K, 7.5K)</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#e9387c]" /> Timing Checkpoints</span>
                    <span className="font-bold text-charcoal">Start, 5K Split, Finish</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-[#e9387c]" /> Medical Support</span>
                    <span className="font-bold text-charcoal">2 First-Aid Stations</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-[#e9387c]" /> Finisher Medal</span>
                    <span className="font-bold text-charcoal">Finisher Medal + Tee</span>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#e9387c] hover:bg-[#d82a6e] text-white py-3 text-xs font-bold transition-all shadow-soft"
                >
                  Register for 10K <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* 5K Fun Run Map */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all">
              <div className="h-48 bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 p-6 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 opacity-10 font-black text-9xl text-white">05</div>
                <div>
                  <span className="rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Community Run
                  </span>
                  <h3 className="mt-2 text-2xl font-black">5 KM Fun Run</h3>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs text-slate-300">Cut-off: 1 Hour 15 Mins</span>
                  <span className="text-xs font-bold text-sky-300">Elevation: Flat (Coastal)</span>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Navigation className="h-4 w-4 text-[#e9387c]" /> Aid Stations</span>
                    <span className="font-bold text-charcoal">2 Points (At 2.5K & Finish)</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#e9387c]" /> Timing Checkpoints</span>
                    <span className="font-bold text-charcoal">Non-timed (Celebratory)</span>
                  </div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="flex items-center gap-2"><HeartPulse className="h-4 w-4 text-[#e9387c]" /> Medical Support</span>
                    <span className="font-bold text-charcoal">1 Main Aid Base</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Trophy className="h-4 w-4 text-[#e9387c]" /> Finisher Medal</span>
                    <span className="font-bold text-charcoal">Finisher Medal + Tee</span>
                  </div>
                </div>
                <Link
                  to="/register"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-charcoal hover:bg-slate-800 text-white py-3 text-xs font-bold transition-all"
                >
                  Register for 5K <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Schedule Components */}
      <RaceCategories />
      <EventTimeline />
      <BibPickupSection />
    </div>
  );
}
