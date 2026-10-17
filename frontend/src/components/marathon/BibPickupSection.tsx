import { MapPin, Calendar, Clock, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT } from "@/data/marathon";
import SectionHeader from "./SectionHeader";

const cards = [
  {
    title: "Bib Collection",
    location: "Run Beyond Limits Expo",
    date: "September 26, 2026",
    time: "10:00 AM - 7:00 PM",
    address: "At your registered city venue"
  },
  {
    title: "Race Day Helpdesk",
    location: "Event Venue",
    date: "September 27, 2026",
    time: "4:30 AM onwards",
  },
];

export default function BibPickupSection() {
  return (
    <section className="py-10 md:py-16 bg-[#F8FAFC] border-b border-border relative overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Pick-up & Helpdesk"
          heading="Bib Pickup & Helpdesk"
          subheading="Collect your bib, timing chip, T-shirt and goodie bag ahead of race day."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl bg-white border border-slate-200/80 p-5 md:p-6 shadow-sm hover:shadow-md transition duration-300"
            >
              <h3 className="font-display text-lg md:text-xl font-bold text-orange">{c.title}</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2.5"><MapPin className="h-4.5 w-4.5 mt-0.5 text-orange shrink-0" /> {c.location}</li>
                <li className="flex items-start gap-2.5"><Calendar className="h-4.5 w-4.5 mt-0.5 text-orange shrink-0" /> {c.date}</li>
                <li className="flex items-start gap-2.5"><Clock className="h-4.5 w-4.5 mt-0.5 text-orange shrink-0" /> {c.time}</li>
              </ul>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-5 rounded-2xl bg-white border border-slate-200/80 p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm"
        >
          <div>
            <p className="text-orange font-semibold text-xs uppercase tracking-widest">Need Help?</p>
            <p className="mt-0.5 font-display text-lg md:text-xl font-bold text-charcoal">We're here for you.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a href={`tel:${EVENT.phone}`} className="inline-flex items-center gap-2 rounded-full bg-orange text-white px-4.5 py-2 text-sm font-semibold hover:scale-105 transition shadow-sm">
              <Phone className="h-4 w-4" /> {EVENT.phone}
            </a>
            <a href={`mailto:${EVENT.email}`} className="inline-flex items-center gap-2 rounded-full border border-slate-300 text-slate-600 px-4.5 py-2 text-sm font-semibold hover:bg-slate-50 transition">
              <Mail className="h-4 w-4" /> {EVENT.email}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
