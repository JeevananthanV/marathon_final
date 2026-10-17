import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Heart } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Event Info", to: "/event-info" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span className="grid place-items-center h-10 w-10 rounded-xl gradient-cta text-white shadow-soft group-hover:scale-105 transition">
        <Heart className="h-5 w-5" fill="currentColor" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display font-extrabold text-lg tracking-tight text-charcoal">
          Run<span className="text-magenta">Rise</span>
        </span>
        {!compact && (
          <span className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
            Marathon · 2026
          </span>
        )}
      </span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "bg-white/90 backdrop-blur-md shadow-soft" : "bg-white/70 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-18 flex items-center justify-between gap-4">
        <Logo />
        <ul className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                className="px-3 py-2 rounded-md text-sm font-medium text-charcoal/80 hover:text-magenta hover:bg-magenta/5 transition"
                activeProps={{ className: "text-magenta bg-magenta/5" }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link
            to="/register" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-full gradient-cta text-white px-5 py-2.5 text-sm font-semibold shadow-soft hover:shadow-glow hover:scale-105 transition"
          >
            Register Now
          </Link>
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-md hover:bg-muted"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden border-t bg-white animate-fade-up">
          <ul className="px-4 py-3 space-y-1">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2.5 rounded-md text-base font-medium text-charcoal hover:bg-magenta/5 hover:text-magenta"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/register" target="_blank" rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-center rounded-full gradient-cta text-white px-5 py-3 text-sm font-semibold mt-2"
              >
                Register Now
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

