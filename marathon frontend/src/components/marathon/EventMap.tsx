import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Flag, Droplet, Heart, ShieldAlert, Navigation } from "lucide-react";
import SectionHeader from "./SectionHeader";

interface CityRouteData {
  id: string;
  name: string;
  locationName: string;
  tagline: string;
  embedUrl: string;
  startPoint: string;
  startTime: string;
  distanceCategories: { category: string; distance: string; color: string }[];
  stats: { label: string; value: string; icon: any }[];
  landmarks: string[];
}

const routesData: CityRouteData[] = [
  {
    id: "chennai",
    name: "Chennai",
    locationName: "Marina Beach Coastal Route",
    tagline: "Run alongside the world's second-longest natural urban beach.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.8529227572797!2d80.27798367586548!3d13.044941913264478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526860d5bfa5df%3A0xe543e33f3801cf90!2sMarina%20Beach!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    startPoint: "Marina Beach Lighthouse, Kamarajar Salai",
    startTime: "05:00 AM (Half Marathon) | 06:00 AM (10K) | 06:45 AM (5K)",
    distanceCategories: [
      { category: "Half Marathon", distance: "21.1 KM", color: "bg-rose-500" },
      { category: "Challenge Run", distance: "10 KM", color: "bg-amber-500" },
      { category: "Fun Run", distance: "5 KM", color: "bg-emerald-500" }
    ],
    stats: [
      { label: "Water Stations", value: "8 Stations", icon: Droplet },
      { label: "Medical Aid", value: "4 Tents", icon: Heart },
      { label: "Cheer Zones", value: "6 Zones", icon: Navigation },
      { label: "Elevation", value: "Flat (Sea Level)", icon: Flag }
    ],
    landmarks: ["Lighthouse", "Gandhi Statue", "Napier Bridge", "Madras War Cemetery Memorial"]
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    locationName: "Vidhana Soudha Heritage Route",
    tagline: "Feel the morning mist under the green canopies of the Garden City.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.973950290159!2d77.58968417586438!3d12.979927614833215!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1672f7ed9269%3A0xed49df2499d3d3a!2sVidhana%20Soudha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    startPoint: "Main Gate, Vidhana Soudha, Sampangi Rama Nagar",
    startTime: "05:15 AM (Half Marathon) | 06:15 AM (10K) | 07:00 AM (5K)",
    distanceCategories: [
      { category: "Half Marathon", distance: "21.1 KM", color: "bg-rose-500" },
      { category: "Challenge Run", distance: "10 KM", color: "bg-amber-500" },
      { category: "Fun Run", distance: "5 KM", color: "bg-emerald-500" }
    ],
    stats: [
      { label: "Water Stations", value: "9 Stations", icon: Droplet },
      { label: "Medical Aid", value: "5 Tents", icon: Heart },
      { label: "Cheer Zones", value: "8 Zones", icon: Navigation },
      { label: "Elevation", value: "+45m Elevation", icon: Flag }
    ],
    landmarks: ["Vidhana Soudha", "Cubbon Park", "Kanthirava Stadium", "MG Road Boulevard"]
  },
  {
    id: "salem",
    name: "Salem",
    locationName: "Yercaud Foothills Scenic Route",
    tagline: "Experience the ultimate challenge with a scenic uphill and hairpin layout.",
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15629.742055613398!2d78.20464875000001!3d11.78201205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf192b1580227%3A0x9b33e25eb3930e14!2sYercaud%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    startPoint: "Yercaud Foothills Gate, Salem",
    startTime: "05:30 AM (Half Marathon) | 06:30 AM (10K) | 07:15 AM (5K)",
    distanceCategories: [
      { category: "Half Marathon", distance: "21.1 KM", color: "bg-rose-500" },
      { category: "Challenge Run", distance: "10 KM", color: "bg-amber-500" },
      { category: "Fun Run", distance: "5 KM", color: "bg-emerald-500" }
    ],
    stats: [
      { label: "Water Stations", value: "7 Stations", icon: Droplet },
      { label: "Medical Aid", value: "4 Tents", icon: Heart },
      { label: "Cheer Zones", value: "4 Zones", icon: Navigation },
      { label: "Elevation", value: "+180m Hill Climb", icon: Flag }
    ],
    landmarks: ["Foothills Arch", "Kurumpapatti Zoo Road", "Hairpin Bend 1 & 2", "Valley View Point"]
  }
];

export default function EventMap() {
  const [activeCity, setActiveCity] = useState("chennai");
  const selectedRoute = routesData.find((route) => route.id === activeCity) || routesData[0];

  return (
    <section className="py-12 md:py-28 bg-slate-50 dark:bg-navy/40 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-1/4 -right-1/4 w-[50%] h-[50%] rounded-full bg-rose-500/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] rounded-full bg-navy/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="RACE PATHS"
          heading={
            <span>
              Explore the <span className="text-orange-gradient">Event Routes</span>
            </span>
          }
          subheading="Pick a city below to view the official race route maps, start times, and location highlights for each race category."
        />

        {/* City Selector Tabs */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="inline-flex p-1.5 rounded-full bg-white dark:bg-royal/50 shadow-card dark:shadow-glow ring-1 ring-slate-200/80 dark:ring-white/10">
            {routesData.map((city) => (
              <button
                key={city.id}
                onClick={() => setActiveCity(city.id)}
                className={`relative px-6 py-2.5 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${
                  activeCity === city.id
                    ? "text-white"
                    : "text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {activeCity === city.id && (
                  <motion.span
                    layoutId="activeMapCityTab"
                    className="absolute inset-0 rounded-full gradient-orange shadow-elevated"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{city.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map and Route Details Panel */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Map View */}
          <div className="lg:col-span-7 h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-elevated dark:shadow-glow ring-1 ring-slate-200 dark:ring-white/15 bg-slate-100 relative">
            <iframe
              title={`${selectedRoute.name} Route Map`}
              src={selectedRoute.embedUrl}
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
                <MapPin className="h-3 w-3 text-rose-500" /> Official Route Map
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCity}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-royal/30 backdrop-blur-md rounded-3xl p-6 md:p-8 shadow-card dark:shadow-glow ring-1 ring-slate-200/80 dark:ring-white/10 flex flex-col h-full justify-between"
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-navy dark:text-white tracking-tight flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-rose-500 shrink-0" />
                    {selectedRoute.locationName}
                  </h3>
                  <p className="text-slate-500 dark:text-white/60 text-sm md:text-base mt-2">
                    {selectedRoute.tagline}
                  </p>

                  <div className="mt-6 space-y-4">
                    {/* Start Line */}
                    <div className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-500 shrink-0 mt-0.5">
                        <Flag className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
                          Start & Finish Line
                        </span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">
                          {selectedRoute.startPoint}
                        </span>
                      </div>
                    </div>

                    {/* Start Times */}
                    <div className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-orange/10 text-orange shrink-0 mt-0.5">
                        <Clock className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block">
                          Flag-off Times
                        </span>
                        <span className="text-sm font-semibold text-slate-800 dark:text-white">
                          {selectedRoute.startTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Route Categories Badges */}
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/10">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-white/40 block mb-3">
                      Available Distance Classes
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedRoute.distanceCategories.map((dist, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-white/5 ring-1 ring-slate-200/60 dark:ring-white/10"
                        >
                          <span className={`h-2 w-2 rounded-full ${dist.color}`} />
                          <span className="text-xs font-bold text-slate-700 dark:text-white/90">
                            {dist.category} ({dist.distance})
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
                      {selectedRoute.landmarks.map((landmark, idx) => (
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
                  {selectedRoute.stats.map((stat, idx) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={idx} className="text-center p-2 rounded-2xl bg-slate-50 dark:bg-white/5 ring-1 ring-slate-100 dark:ring-white/5">
                        <StatIcon className="h-5 w-5 mx-auto text-rose-500/80 dark:text-rose-400 mb-1" />
                        <span className="text-xs font-bold text-slate-800 dark:text-white block">
                          {stat.value}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-white/40 uppercase tracking-wider">
                          {stat.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Route Warning Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 p-5 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex gap-4 items-center max-w-4xl mx-auto shadow-sm"
        >
          <div className="p-3 bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">Important Runner Note</h4>
            <p className="text-xs text-amber-700/90 dark:text-amber-300/80 mt-1 leading-relaxed">
              Medical assistance stations, hydration points, and volunteer crews are positioned every 2.5 KM along all city routes. Timing mats will be active at the start line, key splits, and the finish line. Always wear your BIB with the timing chip facing forward.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
