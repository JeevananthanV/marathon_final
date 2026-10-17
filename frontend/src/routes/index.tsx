import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/marathon/HeroSection";
import AboutEvent from "@/components/marathon/AboutEvent";
import RaceCategories from "@/components/marathon/RaceCategories";
import Sponsors from "@/components/marathon/Sponsors";
import FAQ from "@/components/marathon/FAQ";
import EventMap from "@/components/marathon/EventMap";
import { PageTransition } from "@/components/PremiumAnimations";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <PageTransition>
      <div className="gradient-page min-h-screen">
        <HeroSection />
        <div className="section-divider" />
        <Sponsors />
        <div className="section-divider" />
        <RaceCategories />
        <div className="section-divider" />
        <AboutEvent />
        <div className="section-divider" />
        <EventMap />
        <div className="section-divider" />
        <FAQ />
      </div>
    </PageTransition>
  );
}

