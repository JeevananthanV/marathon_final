import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Flag, Droplet, Heart, Navigation, Calendar } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { CITIES } from "@/data/marathon";

export default function EventMap() {
  const [activeCityId, setActiveCityId] = useState("vadodara");
  const selectedCity = CITIES.find((c) => c.id === activeCityId) || CITIES[0];

  const distanceCategories = [
    { category: "10K Challenge", distance: "10 KM", color: "bg-rose-500", fee: `₹${selectedCity.fees["10k"]}` },
    { category: "5K Fitness Run", distance: "5 KM", color: "bg-amber-500", fee: `₹${selectedCity.fees["5k"]}` },
    { category: "3K Fun Run", distance: "3 KM", color: "bg-emerald-500", fee: `₹${selectedCity.fees["3k"]}` },
  ];

  const stats = [
    { label: "Water Stations", value: "8+ Stations", icon: Droplet },
    { label: "Medical Aid", value: "4 Mobile Tents", icon: Heart },
    { label: "Cheer Zones", value: "6 Energetic Zones", icon: Navigation },
    { label: "Elevation", value: selectedCity.elevation || "Flat", icon: Flag },
  ];

  return (
    <section className="py-12 md:py-28 bg-slate-50 dark:bg-navy/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[50%] h-[50%] rounded-full bg-rose-500/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] rounded-full bg-navy/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="RACE PATHS & VENUES"
          heading={
            <span>
              Explore the <span className="text-orange-gradient">12 City Routes</span>
            </span>
          }
          subheading="Click any of the 12 host cities below to view race dates, flag-off times, venue details, and city-wise fees."
        />

        {/* 12-City Selector Tabs */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex flex-wrap justify-center gap-1.5 p-1.5 rounded-3xl bg-white dark:bg-royal/50 shadow-card ring-1 ring-slate-200/80 dark:ring-white/10 max-w-4xl">
            {CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setActiveCityId(city.id)}
                className={`relative px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  activeCityId === city.id
                    ? "text-white"
                    : "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {activeCityId === city.id && (
                  <motion.span
                    layoutId="activeMapCityTab"
                    className="absolute inset-0 rounded-full gradient-orange shadow-elevated"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{city.order}. {city.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map and Route Details Panel */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Map View */}
          <div className="lg:col-span-7 h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-elevated ring-1 ring-slate-200 dark:ring-white/15 bg-slate-100 relative">
            <iframe
              title={`${selectedCity.name} Route Map`}
              src={selectedCity.embedUrl}
              className="w-full h-full border-0 grayscale dark:invert-[0.9] dark:hue-rotate-180"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {/* Live Indicator overlay */}
            <div className="absolute top-4 left-4 bg-white/95 dark:bg-navy/95 backdrop-blur px-4 py-2 rounded-full shadow-card flex items-center gap-2 ring-1 ring-slate-200 dark:ring-white/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1">
                <MapPin className="h-3 w-3 text-rose-500" /> {selectedCity.name} Route
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCityId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-royal/30 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-card dark:shadow-glow ring-1 ring-slate-200/80 dark:ring-white/10 flex flex-col h-full justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-orange/10 text-orange">
                      Stop {selectedCity.order} of 12
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Expo: {selectedCity.expoDates}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-extrabold text-navy dark:text-white tracking-tight flex items-center gap-2 mt-2">
                    <MapPin className="h-6 w-6 text-rose-500 shrink-0" />
                    {selectedCity.name}
                  </h3>
                  <p className="text-slate-500 dark:text-white/60 text-sm md:text-base mt-1">
                    {selectedCity.tagline}
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Race Date */}
                    <div className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-orange/10 text-orange shrink-0 mt-0.5">
                        <Calendar className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
                          Official Race Date
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-white">
                          {selectedCity.date}
                        </span>
                      </div>
                    </div>

                    {/* Start Line */}
                    <div className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 shrink-0 mt-0.5">
                        <Flag className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
                          Venue &amp; Starting Point
                        </span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">
                          {selectedCity.venue}
                        </span>
                      </div>
                    </div>

                    {/* Start Times */}
                    <div className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 shrink-0 mt-0.5">
                        <Clock className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
                          Flag-off Times
                        </span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">
                          {selectedCity.startTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route Categories Badges & City Fees */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-3">
                      {selectedCity.name} Race Categories &amp; Fees
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {distanceCategories.map((dist, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 ring-1 ring-slate-200/60 dark:ring-white/10"
                        >
                          <span className={`h-2 w-2 rounded-full ${dist.color}`} />
                          <span className="text-xs font-bold text-slate-700 dark:text-white/90">
                            {dist.category}: <span className="text-orange">{dist.fee}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Landmarks */}
                  <div className="mt-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-2.5">
                      Key Course Landmarks
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedCity.landmarks.map((landmark, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-white/80 px-2.5 py-1 rounded-md"
                        >
                          {landmark}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stations stats grid */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2.5">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/80">
                          <StatIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-white/40 block leading-tight">
                            {stat.label}
                          </span>
                          <span className="text-xs font-extrabold text-slate-800 dark:text-white">
                            {stat.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
