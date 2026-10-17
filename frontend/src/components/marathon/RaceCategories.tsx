import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Tilt3D, WordReveal } from "./AnimationUtils";
import { RACES } from "@/data/marathon";

const styles = {
  magenta: {
    ring: "ring-slate-200/80 hover:ring-[#0F172A]/30",
    accent: "text-[#0F172A]",
    bg: "from-[#0F172A]/5 via-white to-white",
    btn: "bg-[#0F172A] hover:bg-[#1E293B] text-white hover:scale-105 transition-all duration-300",
    badge: "bg-[#0F172A]",
  },
  gold: {
    ring: "ring-[#e9387c]/20 hover:ring-[#e9387c]/60 shadow-soft",
    accent: "text-[#e9387c]",
    bg: "from-[#e9387c]/5 via-white to-white",
    btn: "bg-[#e9387c] hover:bg-[#d82a6e] text-white hover:scale-105 transition-all duration-300",
    badge: "bg-[#e9387c]",
  },
  cream: {
    ring: "ring-[#0EA5E9]/20 hover:ring-[#0EA5E9]/60",
    accent: "text-[#0EA5E9]",
    bg: "from-[#0EA5E9]/5 via-white to-white",
    btn: "bg-[#0EA5E9] hover:bg-[#0284C7] text-white hover:scale-105 transition-all duration-300",
    badge: "bg-[#0EA5E9]",
  },
} as const;

export default function RaceCategories() {
  return (
    <section id="races" className="py-10 md:py-24 bg-[#F8FAFC] border-b border-border dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-8 md:mb-16"
        >
          <p className="text-navy font-semibold text-xs tracking-widest uppercase">Race Categories</p>
          <h2 className="mt-2 text-2xl md:text-6xl font-extrabold text-charcoal tracking-tight overflow-hidden">
            <WordReveal text="Choose Your Challenge" delay={0.1} stagger={0.12} />
          </h2>
          <div className="mt-3 h-1 w-16 mx-auto rounded-full bg-navy" />
          <p className="mt-3 text-slate-500 text-sm md:text-lg leading-relaxed hidden md:block">
            Every step counts. Pick the distance that inspires you to go further.
          </p>
        </motion.div>

        {/* Mobile: compact horizontal cards */}
        <div className="flex flex-col gap-3 md:hidden">
          {RACES.map((r) => {
            const s = styles[r.accent];
            return (
              <div
                key={r.id}
                className={`relative rounded-2xl bg-gradient-to-r ${s.bg} px-4 py-4 ring-1 ${s.ring} shadow-sm flex items-center gap-4`}
              >
                {r.popular && (
                  <span className={`absolute -top-2.5 left-4 rounded-full text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-glow ${s.badge}`}>
                    Popular
                  </span>
                )}
                <div className={`shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-xl bg-white ring-1 ${s.ring}`}>
                  <span className={`font-display text-2xl font-black ${s.accent} leading-none`}>{r.distance}</span>
                  <span className={`text-[9px] font-bold ${s.accent}`}>KM</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-extrabold text-charcoal text-sm leading-tight">{r.type}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold">{r.subtype}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-base font-black text-charcoal">₹{r.fee}</span>
                  <Link
                    to="/register" target="_blank" rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10px] font-bold shadow-soft transition-all ${s.btn}`}
                  >
                    Register <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: 3D tilt cards with staggered reveal */}
        <div className="hidden md:grid gap-8 md:grid-cols-3 items-center">
          {RACES.map((r, index) => {
            const s = styles[r.accent];
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <Tilt3D intensity={10} className="h-full">
                  <div className={`relative rounded-[2rem] bg-gradient-to-b ${s.bg} p-8 md:p-10 ring-1 ${s.ring} shadow-card hover:shadow-card-hover transition-all duration-300 h-full`}>
                    {r.popular && (
                      <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full text-white text-[10px] font-black uppercase tracking-widest px-5 py-1.5 shadow-glow animate-pulse-glow ${s.badge}`}>
                        Popular
                      </span>
                    )}
                    <div className="flex items-baseline gap-1">
                      <span className={`font-display text-6xl md:text-7xl font-black ${s.accent} leading-none`}>
                        {r.distance}
                      </span>
                      <span className={`text-xl font-bold ${s.accent}`}>KM</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-extrabold text-charcoal">{r.type}</h3>
                    <p className="text-sm font-semibold text-slate-400 mt-0.5">{r.subtype}</p>

                    <ul className="mt-8 space-y-3.5 text-sm text-slate-600 border-t border-slate-100 pt-6">
                      <li className="flex items-center gap-3"><Check className="h-4 w-4 text-emerald shrink-0" strokeWidth={3} /> Age {r.minAge}+</li>
                      <li className="flex items-center gap-3"><Check className="h-4 w-4 text-emerald shrink-0" strokeWidth={3} /> Chip timing</li>
                      <li className="flex items-center gap-3"><Check className="h-4 w-4 text-emerald shrink-0" strokeWidth={3} /> Medal + T-shirt</li>
                    </ul>

                    <div className="mt-10 flex items-center justify-between gap-4 border-t border-slate-100/60 pt-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registration</p>
                        <p className="font-display text-3xl font-extrabold text-charcoal">₹{r.fee}</p>
                      </div>
                      <Link
                        to="/register" target="_blank" rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold shadow-soft transition-all ${s.btn}`}
                      >
                        Register <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </Tilt3D>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
