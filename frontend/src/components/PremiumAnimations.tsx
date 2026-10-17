import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface FloatingOrb {
  id: number;
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
  blur: number;
}

const ORBS: FloatingOrb[] = [
  { id: 1, size: 320, x: "10%",  y: "20%", color: "rgba(233,56,124,0.18)", duration: 14, delay: 0,   blur: 80 },
  { id: 2, size: 260, x: "75%",  y: "10%", color: "rgba(79,70,229,0.15)",  duration: 18, delay: 2,   blur: 70 },
  { id: 3, size: 200, x: "55%",  y: "60%", color: "rgba(249,115,22,0.14)", duration: 12, delay: 4,   blur: 60 },
  { id: 4, size: 150, x: "85%",  y: "70%", color: "rgba(124,58,237,0.16)", duration: 16, delay: 1,   blur: 55 },
  { id: 5, size: 120, x: "30%",  y: "80%", color: "rgba(245,158,11,0.13)", duration: 20, delay: 3,   blur: 50 },
  { id: 6, size: 90,  x: "5%",   y: "55%", color: "rgba(233,56,124,0.12)", duration: 11, delay: 5,   blur: 40 },
];

/**
 * HeroParticles
 * Six ambient floating orbs that drift with sinusoidal paths.
 * Rendered as an absolutely-positioned overlay inside the hero section.
 */
export function HeroParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          style={{
            position: "absolute",
            left: orb.x,
            top: orb.y,
            width: orb.size,
            height: orb.size,
            borderRadius: "50%",
            background: orb.color,
            filter: `blur(${orb.blur}px)`,
          }}
          animate={{
            x: [0, 40, -30, 25, 0],
            y: [0, -35, 20, -15, 0],
            scale: [1, 1.15, 0.9, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Fine dot grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
    </div>
  );
}

/**
 * SectionReveal
 * Wraps a section with a clip-path curtain wipe reveal —
 * far more dramatic than a simple translate-Y.
 */
interface SectionRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right";
  delay?: number;
}

export function SectionReveal({ children, className = "", direction = "up", delay = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const variants = {
    hidden: {
      opacity: 0,
      clipPath: direction === "up"
        ? "inset(30% 0% 0% 0%)"
        : direction === "left"
        ? "inset(0% 100% 0% 0%)"
        : "inset(0% 0% 0% 100%)",
      y: direction === "up" ? 30 : 0,
    },
    visible: {
      opacity: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      y: 0,
      transition: {
        duration: 0.75,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/**
 * GlowText
 * Renders a heading with a continuously animated gradient sweep.
 * The gradient position shifts creating a shimmer/aurora effect.
 */
interface GlowTextProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowText({ children, className = "" }: GlowTextProps) {
  return (
    <span
      className={`inline-block ${className}`}
      style={{
        background: "linear-gradient(90deg, #e9387c, #f97316, #f59e0b, #4f46e5, #e9387c)",
        backgroundSize: "300% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "gradient-shift 4s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

/**
 * PageTransition
 * Wraps page content in a smooth fade+slide transition.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
