import { createFileRoute, Link } from "@tanstack/react-router";
import Gallery from "@/components/marathon/Gallery";
import PressHighlights from "@/components/marathon/PressHighlights";
import bgImg from "@/assets/background.png";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery · Run Beyond Limits 2026" },
      { name: "description", content: "Moments from previous Run Beyond Limits events." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <div className="min-h-screen">
      <section className="relative py-6 md:py-10 bg-[#F8FAFC] border-b border-slate-200">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs md:text-sm text-slate-500 mb-2 md:mb-4">
            <Link to="/" className="hover:text-slate-800 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-medium">Gallery</span>
          </nav>
          <h1 className="font-display text-xl md:text-3xl font-extrabold leading-tight text-charcoal">
            Moments That <span className="text-orange">Made Us</span>
          </h1>
          <p className="mt-1 text-xs md:text-sm text-slate-500 max-w-xl leading-relaxed hidden md:block">
            Relive the energy, emotion and spirit of Run Beyond Limits through our collection of unforgettable moments.
          </p>
        </div>
      </section>
      <Gallery />
      <PressHighlights />
    </div>
  );
}
