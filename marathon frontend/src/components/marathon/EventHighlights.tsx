import { Timer, Award, Coffee, Shirt, ShoppingBag, Medal } from "lucide-react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const items = [
  { icon: Timer, title: "Timing Chip", desc: "Certified electronic timing", num: "01" },
  { icon: Award, title: "E-Certificate", desc: "Digital finisher certificate", num: "02" },
  { icon: Coffee, title: "Breakfast", desc: "Post-race healthy meal", num: "03" },
  { icon: Shirt, title: "Event T-Shirt", desc: "Premium technical fabric", num: "04" },
  { icon: ShoppingBag, title: "Goodie Bag", desc: "Sponsor gifts & samples", num: "05" },
  { icon: Medal, title: "Finisher Medal", desc: "Keepsake to remember", num: "06" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.94 },
  visible: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function EventHighlights() {
  return (
    <section className="py-8 md:py-28 bg-background dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Every Participant Gets"
          heading="Included In Every Bib"
        />
        <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-6">
          {items.map(({ icon: Icon, title, desc, num }, i) => (
            <motion.div
              key={title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="group bg-gradient-to-b from-white to-slate-50/80 rounded-2xl p-3 md:p-6 text-center border border-slate-200/60 shadow-card hover:border-navy/20 hover:shadow-card-hover hover-lift relative overflow-hidden transition-all duration-300"
            >
              <span className="absolute top-2 right-2 text-[9px] font-bold text-navy/20">{num}</span>
              <div className="mx-auto grid place-items-center h-10 w-10 md:h-14 md:w-14 rounded-xl bg-orange/10 text-orange group-hover:bg-orange group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-glow">
                <Icon className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-2 md:mt-4 font-bold text-charcoal text-xs md:text-base tracking-tight transition-colors duration-300 group-hover:text-navy">{title}</h3>
              <p className="mt-1 text-[10px] md:text-xs text-slate-500 leading-relaxed hidden md:block">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
