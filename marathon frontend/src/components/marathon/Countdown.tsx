import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT } from "@/data/marathon";

function diff(target: number) {
  const now = Date.now();
  const d = Math.max(0, target - now);
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    minutes: Math.floor((d / 60000) % 60),
    seconds: Math.floor((d / 1000) % 60),
  };
}

/* Flip digit — animates between values with a vertical flip */
function FlipDigit({ value }: { value: string }) {
  const prevRef = useRef(value);
  const changed = prevRef.current !== value;
  useEffect(() => { prevRef.current = value; });

  return (
    <div className="relative h-[3.6rem] md:h-[5rem] w-[2.4rem] md:w-[3.4rem] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center font-display text-4xl md:text-6xl font-black tabular-nums text-white"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

function FlipCell({ label, val }: { label: string; val: number | null }) {
  const formatted = val === null ? "--" : String(val).padStart(2, "0");
  const [d1, d2] = formatted.split("");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1 rounded-2xl bg-white/10 backdrop-blur-xl ring-1 ring-white/20 px-3 py-2 md:px-4 md:py-3 shadow-elevated">
        <FlipDigit value={d1} />
        <FlipDigit value={d2} />
      </div>
      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">{label}</span>
    </div>
  );
}

export default function Countdown() {
  const target = new Date(EVENT.dateISO).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);
  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cells: [string, number | null][] = [
    ["Days", t?.days ?? null],
    ["Hours", t?.hours ?? null],
    ["Minutes", t?.minutes ?? null],
    ["Seconds", t?.seconds ?? null],
  ];

  return (
    <section className="relative py-10 md:py-12 gradient-hero text-white overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* Animated glow orbs */}
      <div className="absolute -top-10 left-1/4 h-40 w-40 rounded-full bg-orange/20 blur-3xl animate-float" />
      <div className="absolute -bottom-10 right-1/4 h-40 w-40 rounded-full bg-royal/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center md:text-left"
          >
            <p className="text-white/60 font-semibold text-xs tracking-widest uppercase">Race Day Countdown</p>
            <p className="mt-1 font-display text-xl md:text-2xl font-extrabold text-white">{EVENT.date}</p>
            <p className="text-white/60 text-sm mt-0.5">{EVENT.location}</p>
          </motion.div>

          {/* Flip-digit timer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex items-end gap-3 md:gap-5"
          >
            {cells.map(([label, val], i) => (
              <div key={label} className="flex items-end gap-3 md:gap-5">
                <FlipCell label={label} val={val} />
                {i < cells.length - 1 && (
                  <span className="mb-3 text-white/50 text-2xl md:text-4xl font-black leading-none select-none">:</span>
                )}
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <Link
              to="/register" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full gradient-orange text-white px-7 py-3 font-bold shadow-glow hover:scale-105 transition-all duration-300 text-sm whitespace-nowrap"
            >
              Secure Your Spot
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
