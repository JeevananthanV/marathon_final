import { createFileRoute } from "@tanstack/react-router";
import RaceCategories from "@/components/marathon/RaceCategories";
import EventHighlights from "@/components/marathon/EventHighlights";
import EventTimeline from "@/components/marathon/EventTimeline";
import BibPickupSection from "@/components/marathon/BibPickupSection";
import { EVENT } from "@/data/marathon";

export const Route = createFileRoute("/event-info")({
  head: () => ({
    meta: [
      { title: "Event Info · Run Beyond Limits 2026" },
      { name: "description", content: "Race categories, schedule, bib pickup and everything you need to know about Run Beyond Limits 2026." },
    ],
  }),
  component: EventInfo,
});

function EventInfo() {
  return (
    <div className="gradient-page min-h-screen">
      <section className="page-header-banner text-white py-10 md:py-14">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70 font-semibold text-sm tracking-widest uppercase">Event Info</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Everything You Need to Know</h1>
          <p className="mt-3 text-base md:text-lg text-white/80">{EVENT.date} · {EVENT.location}</p>
        </div>
      </section>
      <RaceCategories />
      <EventHighlights />
      <EventTimeline />
      <BibPickupSection />
    </div>
  );
}
