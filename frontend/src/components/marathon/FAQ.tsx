import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FAQS } from "@/data/marathon";
import SectionHeader from "./SectionHeader";

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-28 bg-[#F8FAFC] border-b border-border">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="FAQ"
          heading="Frequently Asked Questions"
        />
        <div className="space-y-4">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`rounded-2xl border transition-all duration-300 ${
                  isOpen
                    ? "bg-white border-royal/30 shadow-card-hover scale-[1.01]"
                    : "bg-white border-slate-100 shadow-card hover:border-slate-200/80 hover:shadow-card-hover"
                }`}
              >
                <button
                  className="w-full text-left flex items-center justify-between gap-4 p-6 md:p-7 cursor-pointer"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-sm md:text-base leading-snug transition-colors duration-200 ${isOpen ? "text-navy" : "text-slate-800"}`}>{f.q}</span>
                  <span
                    className={`shrink-0 grid place-items-center h-10 w-10 rounded-full transition-all duration-300 ${
                      isOpen ? "gradient-orange text-white rotate-180 shadow-glow" : "bg-navy/5 text-navy hover:bg-navy/10"
                    }`}
                  >
                    {isOpen ? <Minus className="h-4 w-4" strokeWidth={3} /> : <Plus className="h-4 w-4" strokeWidth={3} />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 md:px-7 pb-6 md:pb-7 text-xs md:text-sm text-slate-500 leading-relaxed">
                        <p className="border-t border-slate-100 pt-4">{f.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
