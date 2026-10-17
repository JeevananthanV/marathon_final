import { Calendar, Clock, ArrowRight } from "lucide-react";
import g3 from "@/assets/g3.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import g4 from "@/assets/g4.jpg";

const stories = [
  { img: g5, title: "Thousands Run for a Healthier Heart", tag: "Community", date: "Sep 2025", readTime: "3 min" },
  { img: g6, title: "A Celebration of Community", tag: "Culture", date: "Sep 2025", readTime: "4 min" },
  { img: g4, title: "Every Step Creates an Impact", tag: "Impact", date: "Sep 2025", readTime: "2 min" },
];

export default function PressHighlights() {
  return (
    <section className="py-24 md:py-28 bg-[#F8FAFC] dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-navy font-semibold text-sm tracking-widest uppercase">Highlights</p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl font-extrabold text-charcoal">Run Beyond Limits Highlights</h2>
          <div className="mt-4 h-1.5 w-20 mx-auto rounded-full bg-navy" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-[2rem] shadow-elevated group cursor-pointer">
            <img src={g3} alt="Aerial heart formation" width={800} height={600} loading="lazy" className="w-full h-full object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
            <div className="absolute top-6 left-6 flex items-center gap-3">
              <span className="inline-block rounded-full gradient-orange text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5">Featured</span>
              <span className="inline-block rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 ring-1 ring-white/20">Inspiration</span>
            </div>
            <div className="absolute bottom-0 p-8 text-white">
              <div className="flex items-center gap-4 text-xs text-white/60 mb-3">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Sep 2025</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> 5 min read</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold">Karnataka's Largest Heart Formation</h3>
              <p className="mt-2 text-sm text-white/80 max-w-md leading-relaxed">
                Over 5,000 runners came together to form a giant human heart — a symbol of unity and cardiovascular awareness.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-orange group-hover:gap-3 transition-all duration-200">
                Read Story <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            {stories.map((s) => (
              <article key={s.title} className="group grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-4 rounded-[1.5rem] overflow-hidden bg-white border border-border shadow-card hover:shadow-card-hover hover-lift transition-all duration-300 cursor-pointer">
                <img src={s.img} alt={s.title} width={360} height={240} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold text-orange uppercase tracking-widest">{s.tag}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">{s.readTime}</span>
                  </div>
                  <h3 className="font-bold text-charcoal text-lg leading-snug group-hover:text-navy transition-colors duration-200">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                    Read how runners of all ages made this event unforgettable through resilience and heart.
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {s.date}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
