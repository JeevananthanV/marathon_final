import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Event Info", to: "/event-info" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
  { label: "Admin", to: "/admin" },
];

import logo from "@/assets/img.png";

export function Logo({ compact = false, inFooter = false }: { compact?: boolean; inFooter?: boolean }) {
  return (
    <Link
      to="/"
      onClick={(e) => {
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={`flex items-center group ${inFooter ? "bg-white rounded-2xl px-4 py-2 w-fit" : ""}`}
    >
      <img
        src={logo}
        alt="Run Beyond Limits"
        width={280}
        height={80}
        className={`w-auto object-contain transition-transform duration-300 group-hover:scale-105 ${inFooter ? "h-10 max-w-[140px]" : compact ? "h-7" : "h-9 md:h-10"}`}
      />
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const isHome = typeof window !== "undefined" && (window.location.pathname === "/" || window.location.pathname.includes("theme-preview"));

  return (
    <header
      className={
        isHome
          ? "absolute top-0 left-0 right-0 z-50 w-full bg-transparent border-b border-transparent"
          : "relative z-50 w-full bg-white border-b border-slate-200"
      }
    >
      <nav aria-label="Main navigation" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-[68px] flex items-center justify-between">
        <Logo />
        <ul className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <li key={n.to}>
              <Link
                to={n.to}
                onClick={(e) => {
                  if (n.to === "/" && window.location.pathname === "/") {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={`relative px-4 py-2 text-base font-semibold tracking-wide rounded-full transition-all duration-200 after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-royal after:rounded-full after:transition-all after:duration-300 hover:after:w-6 ${
                  isHome
                    ? "text-white/80 hover:text-orange hover:bg-white/10"
                    : "text-slate-600 hover:text-royal hover:bg-slate-100"
                }`}
                activeProps={{
                  className: isHome
                    ? "!text-white !font-bold !bg-white/15 after:!w-6"
                    : "!text-royal !font-bold !bg-royal/5 after:!w-6",
                }}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <Link
            to="/register" target="_blank" rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center rounded-full gradient-cta text-white px-6 py-2.5 text-sm font-semibold tracking-wide shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-300"
          >
            Register Now
          </Link>
          <button
            aria-label="Toggle menu"
            className={`lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-full transition-all duration-200 ${
              open
                ? "bg-royal/10 text-royal"
                : isHome
                  ? "hover:bg-white/10 text-white/80"
                  : "hover:bg-slate-100 text-slate-500"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 transition-all duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setOpen(false)} />
        <div
          className={`relative bg-white/95 backdrop-blur-lg border-b border-slate-100 shadow-elevated transition-all duration-300 ${
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <ul className="px-4 py-4 space-y-1">
            {NAV.map((n, i) => (
              <li
                key={n.to}
                className={`transition-all duration-300 ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${i * 50}ms` : "0ms" }}
              >
                <Link
                  to={n.to}
                  onClick={(e) => {
                    setOpen(false);
                    if (n.to === "/" && window.location.pathname === "/") {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="block px-4 py-3 text-base font-medium text-slate-500 hover:text-royal hover:bg-royal/5 rounded-xl transition-all duration-150"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li
              className={`pt-2 transition-all duration-300 ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${NAV.length * 50}ms` : "0ms" }}
            >
              <Link
                to="/register" target="_blank" rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block text-center rounded-full gradient-cta text-white py-3 text-base font-semibold shadow-soft"
              >
                Register Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

