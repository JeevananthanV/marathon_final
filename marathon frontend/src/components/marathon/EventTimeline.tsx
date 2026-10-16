import { Flag, Rocket, Timer, Coffee, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const steps = [
  { time: "05:00 AM", title: "Reporting & Warm-up", icon: Timer, desc: "Arrive, stretch and prepare with our fitness team." },
  { time: "05:30 AM", title: "Flag-off", icon: Flag, desc: "Ceremonial flag-off with dignitaries and community leaders." },
  { time: "06:00 AM", title: "Race Begins", icon: Rocket, desc: "All race categories start based on staggered waves." },
  { time: "07:30 AM", title: "Breakfast & Recovery", icon: Coffee, desc: "Healthy breakfast and recovery zone for all finishers." },
  { time: "08:30 AM", title: "Awards & Celebration", icon: Trophy, desc: "Winners ceremony, music and community celebration." },
];

export default function EventTimeline() {
  return (
    <section className="py-8 md:py-28 bg-white dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Race Day Schedule"
          heading="The Event Day Experience"
        />
        <div className="relative">
          <div className="hidden lg:block absolute left-4 right-4 top-14 h-1.5 bg-gradient-to-r from-royal/20 via-orange/40 to-royal/20 rounded-full -z-10" />
          <div className="grid gap-6 md:gap-8 lg:grid-cols-5 relative z-10">
            {steps.map(({ time, title, icon: Icon, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40, scale: 0.93 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex lg:flex-col items-start lg:items-center gap-3 lg:text-center bg-white rounded-2xl p-3 md:p-6 ring-1 ring-slate-100 shadow-card hover:shadow-card-hover hover:ring-royal/20 transition-all duration-300 group hover-lift h-full"
              >
                <div className="relative shrink-0 lg:mb-4">
                  <div className="grid place-items-center h-10 w-10 md:h-14 md:w-14 rounded-full bg-orange/10 text-orange shadow-soft ring-2 ring-white group-hover:bg-orange group-hover:text-white transition-all duration-300">
                    <Icon className="h-4 w-4 md:h-6 md:w-6" />
                  </div>
                  <span className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 rounded-full gradient-orange text-white text-[9px] font-black grid place-items-center shadow-sm">
                    {i + 1}
                  </span>
                </div>
                <div>
                  <p className="font-display font-extrabold text-sm md:text-base text-navy">{time}</p>
                  <p className="font-extrabold text-charcoal mt-0.5 text-xs md:text-base leading-snug">{title}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xs hidden md:block">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
