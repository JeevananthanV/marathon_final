import { Link } from "@tanstack/react-router";
import { ArrowRight, Heart } from "lucide-react";

export default function RegistrationCTA() {
  return (
    <section className="py-10 md:py-16 relative overflow-hidden bg-white border-y border-border">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-orange font-semibold text-xs tracking-widest uppercase">Join The Movement</p>
        <h2 className="mt-2 font-display text-xl md:text-3xl font-extrabold leading-tight text-charcoal">
          Ready to Protect Your Heart?
        </h2>
        <p className="mt-2.5 text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Join thousands of runners and take your first step toward a healthier, stronger future.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/register" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-orange text-white px-6 py-3 font-bold shadow-sm hover:scale-105 transition-all duration-300 text-sm md:text-base"
          >
            Register Now <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 text-slate-600 px-6 py-3 font-semibold hover:bg-slate-50 transition-all duration-300 text-sm md:text-base"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}

