import { createFileRoute } from "@tanstack/react-router";
import AboutEvent from "@/components/marathon/AboutEvent";
import WhyParticipate from "@/components/marathon/WhyParticipate";
import RegistrationCTA from "@/components/marathon/RegistrationCTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About · Run Beyond Limits 2026" },
      { name: "description", content: "Learn about the mission behind Run Beyond Limits — pushing your endurance and celebrating community." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="gradient-page min-h-screen">
      <section className="page-header-banner text-white py-10 md:py-14">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70 font-semibold text-sm tracking-widest uppercase">About</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Our Story, Our Mission</h1>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-2xl mx-auto">
            Run Beyond Limits is a community-first running movement dedicated to endurance, resilience, and personal records.
          </p>
        </div>
      </section>
      <AboutEvent />
      <WhyParticipate />
      <RegistrationCTA />
    </div>
  );
}
