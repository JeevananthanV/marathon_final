import { HeartPulse, Users, Trophy, Footprints } from "lucide-react";

const items = [
  { icon: HeartPulse, title: "Run for Your Health", desc: "Improve cardiovascular health while training for a purposeful cause.", num: "01" },
  { icon: Users, title: "Build a Stronger Community", desc: "Connect with thousands of runners who share your passion.", num: "02" },
  { icon: Trophy, title: "Celebrate Your Achievement", desc: "Earn your finisher medal and a moment you'll remember for life.", num: "03" },
  { icon: Footprints, title: "Make Every Step Count", desc: "Support heart health awareness with each stride you take.", num: "04" },
];

export default function WhyParticipate() {
  return (
    <section className="py-8 md:py-28 bg-[#F8FAFC] dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-16">
          <p className="text-navy font-semibold text-xs tracking-widest uppercase">Why Participate</p>
          <h2 className="mt-2 text-xl md:text-5xl font-extrabold text-charcoal tracking-tight">Reasons to Run With Us</h2>
          <div className="mt-3 h-1 w-16 mx-auto rounded-full bg-navy" />
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc, num }) => (
            <div key={title} className="group bg-card border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium relative overflow-hidden">
              <span className="absolute top-3 right-3 text-3xl md:text-5xl font-black text-navy/5 transition duration-300">{num}</span>
              <div className="grid place-items-center h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary text-white">
                <Icon className="h-5 w-5 md:h-7 md:w-7" />
              </div>
              <h3 className="mt-3 md:mt-6 font-extrabold text-sm md:text-lg text-slate-800 dark:text-white tracking-tight">{title}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed hidden md:block">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
