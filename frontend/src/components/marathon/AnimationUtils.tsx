import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

/* ─────────────────────────────────────────────
   useCountUp — animates a number from 0 to end
   ───────────────────────────────────────────── */
export function useCountUp(end: number, duration = 1800, trigger = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, trigger]);
  return value;
}

/* ─────────────────────────────────────────────
   WordReveal — splits text and reveals word-by-word
   ───────────────────────────────────────────── */
interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function WordReveal({ text, className = "", delay = 0, stagger = 0.1 }: WordRevealProps) {
  const words = text.split(" ");
  return (
    <span className={`inline-flex flex-wrap gap-x-[0.25em] ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", skewY: 10, opacity: 0 }}
            whileInView={{ y: 0, skewY: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{
              duration: 0.6,
              delay: delay + i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Tilt3D — wraps children with mouse-track 3D tilt
   ───────────────────────────────────────────── */
interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function Tilt3D({ children, className = "", intensity = 12 }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.03,1.03,1.03)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.25s ease", transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   CountUpStat — viewport-triggered number counter
   ───────────────────────────────────────────── */
interface CountUpStatProps {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
  className?: string;
}

export function CountUpStat({ value, suffix = "", prefix = "", label, duration = 1600, className = "" }: CountUpStatProps) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const count = useCountUp(value, duration, triggered);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setTriggered(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center ${className}`}
    >
      <span className="font-display text-4xl md:text-5xl font-black tabular-nums">
        {prefix}{count}{suffix}
      </span>
      <span className="mt-1 text-xs font-semibold uppercase tracking-widest opacity-60">{label}</span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   CharReveal — per-character spring-drop animation
   Each letter falls in from above with a bounce
   ───────────────────────────────────────────── */
interface CharRevealProps {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

export function CharReveal({ text, className = "", delay = 0, stagger = 0.035, once = true }: CharRevealProps) {
  const chars = text.split("");
  return (
    <span className={`inline-flex flex-wrap ${className}`} aria-label={text}>
      {chars.map((char, i) => (
        <span key={i} className="overflow-hidden inline-block" style={{ lineHeight: "inherit" }}>
          <motion.span
            className="inline-block"
            aria-hidden="true"
            initial={{ y: "105%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once, margin: "-20px" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: delay + i * stagger,
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
