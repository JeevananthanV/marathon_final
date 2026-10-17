import { createFileRoute } from "@tanstack/react-router";
import ContactSection from "@/components/marathon/ContactSection";
import BibPickupSection from "@/components/marathon/BibPickupSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · Run Beyond Limits 2026" },
      { name: "description", content: "Get in touch with the Run Beyond Limits team for registration, partnerships and support." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="gradient-page min-h-screen">
      <section className="page-header-banner text-white py-12 md:py-16 shadow-sm">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70 font-semibold text-sm tracking-widest uppercase">Contact</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Say Hello</h1>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Have a question about registration, race day or partnerships? Our team is here to help.
          </p>
        </div>
      </section>
      <ContactSection />
      <BibPickupSection />
    </div>
  );
}
