import { Heart, Droplet, Activity, Wind, ArrowRight } from "lucide-react";

const tips = [
  { icon: Heart, title: "Know Your Baseline", desc: "Get a fitness assessment before starting any training program." },
  { icon: Droplet, title: "Hydration Matters", desc: "Drink water regularly, especially the day before your race." },
  { icon: Activity, title: "Warm-up Well", desc: "Dynamic warm-ups reduce injury and prepare your heart." },
  { icon: Wind, title: "Recover Fully", desc: "Cool down, stretch and rest to help your body rebuild." },
];

export default function HeartHealthSection() {
  return (
    <section className="py-24 md:py-28 bg-[#F8FAFC] relative overflow-hidden dots-pattern">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-royal/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-orange/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-navy font-semibold text-sm tracking-widest uppercase">Heart Health</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-charcoal leading-tight">
            Run for Your <span className="text-orange">Limits</span>
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed text-lg">
            Run Beyond Limits is more than a race — it's a movement for pushing personal boundaries.
            Every stride is a reminder that regular activity, mindful nutrition and small daily habits
            add up to a lifetime of incredible endurance and strength.
          </p>
            <a
              href="#faq"
              className="mt-6 inline-flex items-center gap-2 rounded-full gradient-orange text-white px-8 py-4 font-semibold shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              Learn More About Endurance <ArrowRight className="h-4 w-4" />
            </a>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tips.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-[1.5rem] bg-white p-6 shadow-card border border-slate-100 hover:border-navy/20 hover:shadow-card-hover hover-lift transition-all duration-300 group">
              <div className="grid place-items-center h-14 w-14 rounded-2xl bg-navy/5 text-navy group-hover:bg-gradient-to-br group-hover:from-navy group-hover:to-charcoal group-hover:text-white transition-all duration-300 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-extrabold text-charcoal text-base md:text-lg">{title}</h3>
              <p className="mt-2 text-xs md:text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
