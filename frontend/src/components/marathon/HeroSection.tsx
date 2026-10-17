import { Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { HeroParticles } from "@/components/PremiumAnimations";
import bgImg from "@/assets/hero-bg.jpg";
import logo from "@/assets/img.png";
import { EVENT } from "@/data/marathon";
import chennaiImg from "@/New assests/chennai.webp";
import bengaluruImg from "@/New assests/bengaluru.webp";
import salemImg from "@/New assests/salem.webp";

const cities = [
  { name: "CHENNAI", state: "Tamil Nadu", color: "group-hover:text-rose-500", img: chennaiImg },
  { name: "BENGALURU", state: "Karnataka", color: "group-hover:text-amber-500", img: bengaluruImg },
  { name: "SALEM", state: "Tamil Nadu", color: "group-hover:text-emerald-500", img: salemImg },
];

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden border-b border-border">
      {/* Parallax background */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: bgY }}>
        <img
          src={bgImg}
          alt="Runners during the Run Beyond Limits marathon"
          width={1920}
          height={1080}
          className="h-full w-full object-cover object-center"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/30 via-transparent to-navy/10" />

      {/* Physics-based floating orbs */}
      <HeroParticles />

      {/* Decorative line elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 h-px w-48 bg-gradient-to-r from-transparent to-orange/40 animate-float" />
        <div className="absolute top-1/2 left-10 h-px w-32 bg-gradient-to-r from-transparent to-royal/40" style={{ animationDelay: "0.4s" }} />
        <div className="absolute bottom-1/3 right-0 h-px w-64 bg-gradient-to-l from-transparent to-orange/30 animate-float" style={{ animationDelay: "0.8s" }} />
        <div className="absolute top-20 right-1/4 h-2 w-2 rounded-full bg-orange/40 animate-pulse-glow" />
        <div className="absolute bottom-40 left-1/3 h-1.5 w-1.5 rounded-full bg-royal/40 animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-24 text-white w-full">
        <div className="grid md:grid-cols-[1fr_auto] gap-10 md:gap-16 items-center">
          {/* Left side — slides in from the left */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <img
              src={logo}
              alt="Run Beyond Limits"
              width={400}
              height={160}
              className="h-20 md:h-28 w-auto object-contain drop-shadow-lg"
            />
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full gradient-orange text-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest animate-pulse-glow">
                <span className="h-2 w-2 rounded-full bg-white" /> Registration Open
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/20 text-white px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
                <Calendar className="h-3 w-3" /> {EVENT.date}
              </span>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="font-display text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-md"
            >
              Run Beyond <br />
              <span className="text-gradient">Limits 2026</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="text-xl md:text-2xl font-semibold text-white/95"
            >
              Push Your Endurance
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed"
            >
              Join thousands of runners across three cities for an unforgettable celebration of health, fitness, resilience and community.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <Link
                to="/register" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full gradient-orange text-white px-8 py-4 font-bold shadow-elevated hover:shadow-glow hover:scale-105 transition-all duration-300 text-base"
              >
                Register Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/event-info"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/30 hover:ring-white/50 text-white px-8 py-4 font-semibold hover:bg-white/25 transition-all duration-300 text-base"
              >
                Explore Event
              </Link>
            </motion.div>
          </motion.div>

          {/* Right side — City cards cascade in from the right */}
          <div className="hidden md:flex flex-col gap-5 items-end">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "easeOut" }}
                className="flex items-center justify-between gap-6 rounded-2xl bg-navy/40 backdrop-blur-md ring-1 ring-white/15 px-7 py-4.5 min-w-[310px] hover:translate-x-[-12px] hover:bg-navy/60 hover:ring-white/30 transition-all duration-300 group cursor-pointer shadow-soft hover:shadow-glow relative overflow-hidden"
              >
                <img
                  src={city.img}
                  alt={city.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                />
                <div className="flex items-baseline gap-3 relative z-10">
                  <span className={`font-city text-4xl md:text-5xl text-white tracking-wide transition-colors duration-300 ${city.color}`}>{city.name}</span>
                  <span className="text-xs text-white/50 uppercase tracking-widest">{city.state}</span>
                </div>
                <div className="h-2 w-2 rounded-full bg-white/30 group-hover:bg-orange group-hover:scale-125 transition-all duration-300 relative z-10" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-scroll-bounce"
        >
          <span className="text-xs text-white/50 uppercase tracking-widest">Scroll</span>
          <ChevronDown className="h-4 w-4 text-white/50" />
        </motion.div>
      </div>
    </section>
  );
}
