import { Stethoscope, Dumbbell, Users, Newspaper, HeartPulse, Trophy, Timer, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const partners = [
  { icon: Stethoscope, name: "Healthcare Partner", color: "text-rose-500 bg-rose-50", border: "hover:border-rose-200" },
  { icon: Dumbbell, name: "Fitness Partner", color: "text-violet-500 bg-violet-50", border: "hover:border-violet-200" },
  { icon: Users, name: "Community Partner", color: "text-sky-500 bg-sky-50", border: "hover:border-sky-200" },
  { icon: Newspaper, name: "Media Partner", color: "text-amber-500 bg-amber-50", border: "hover:border-amber-200" },
  { icon: HeartPulse, name: "Wellness Partner", color: "text-pink-500 bg-pink-50", border: "hover:border-pink-200" },
  { icon: Trophy, name: "Title Sponsor", color: "text-orange-500 bg-orange-50", border: "hover:border-orange-200" },
  { icon: Timer, name: "Timing Partner", color: "text-emerald-500 bg-emerald-50", border: "hover:border-emerald-200" },
  { icon: MapPin, name: "Route Partner", color: "text-indigo-500 bg-indigo-50", border: "hover:border-indigo-200" },
];

// Duplicate for seamless loop
const track = [...partners, ...partners];

export default function Sponsors() {
  return (
    <section className="py-16 md:py-24 bg-white border-y border-border overflow-hidden">
      <SectionHeader
        eyebrow="Event Powered By"
        heading="Our Partners & Sponsors"
      />

      {/* Infinite marquee track */}
      <div className="relative">
        {/* Left / Right fade masks */}
        <div className="pointer-events-none absolute left-0 top-0 h-full w-28 md:w-48 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 h-full w-28 md:w-48 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex animate-marquee gap-6 w-max hover:[animation-play-state:paused]">
          {track.map(({ icon: Icon, name, color, border }, i) => (
            <div
              key={i}
              className={`flex items-center gap-4 rounded-2xl border border-slate-100 ${border} bg-white px-7 py-5 shadow-card hover:shadow-card-hover hover:scale-[1.04] transition-all duration-300 group cursor-pointer min-w-max`}
            >
              <div className={`p-3.5 rounded-xl ${color}`}>
                <Icon className="h-7 w-7" strokeWidth={1.5} />
              </div>
              <span className="font-bold text-slate-700 group-hover:text-charcoal transition-colors duration-300 text-base whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
