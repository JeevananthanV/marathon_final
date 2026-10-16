import { ShieldCheck, Route, Timer as Watch, Sparkles, HeartHandshake } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "Professionally Organized", desc: "A team of race experts delivering a world-class event." },
  { icon: Route, title: "Safe & Supportive Route", desc: "Hydration, medical and support stations every kilometre." },
  { icon: Watch, title: "Certified Timing", desc: "Accurate results powered by professional chip timing." },
  { icon: Sparkles, title: "Exclusive Finisher Experience", desc: "A celebration that honours every runner who crosses the line." },
  { icon: HeartHandshake, title: "Heart-Focused Mission", desc: "Every registration supports heart health awareness in India." },
];

export default function MarathonDifference() {
  return (
    <section className="py-24 md:py-32 gradient-hero text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1.2px, transparent 1.2px)", backgroundSize: "20px 20px" }} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-orange/10 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-white/70 font-semibold text-sm tracking-widest uppercase">The Difference</p>
          <h2 className="mt-3 font-display text-3xl md:text-5xl lg:text-6xl font-extrabold">What Makes Run Beyond Limits Different?</h2>
          <div className="mt-4 h-1.5 w-20 mx-auto rounded-full bg-white/40" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-3xl bg-white/15 backdrop-blur-xl border border-white/20 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover-premium group transition-all duration-300">
              <div className="grid place-items-center h-14 w-14 rounded-2xl bg-white/20 text-white">
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-bold text-lg">{title}</h3>
              <p className="mt-2.5 text-sm text-white/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
