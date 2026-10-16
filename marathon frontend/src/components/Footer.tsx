import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./Navbar";
import { EVENT } from "@/data/marathon";

export default function Footer() {
  return (
    <footer className="gradient-footer text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-14 grid grid-cols-2 gap-6 md:gap-10 md:grid-cols-4">
        <div className="md:col-span-1 space-y-4">
          <div className="[&_span]:!text-white"><Logo inFooter /></div>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            A community marathon uniting runners across India to celebrate health, endurance and pushing past limits.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Twitter, Youtube].map((Ico, i) => (
              <a key={i} href="#" aria-label="social" className="grid place-items-center h-10 w-10 rounded-full bg-white/10 hover:bg-orange hover:scale-110 transition-all duration-300">
                <Ico className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/" className="hover:text-orange transition-colors duration-200">Home</Link></li>
            <li><Link to="/event-info" className="hover:text-orange transition-colors duration-200">Event Info</Link></li>
            <li><Link to="/about" className="hover:text-orange transition-colors duration-200">About</Link></li>
            <li><Link to="/gallery" className="hover:text-orange transition-colors duration-200">Gallery</Link></li>
            <li><Link to="/register" target="_blank" rel="noopener noreferrer" className="hover:text-orange transition-colors duration-200">Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Support</h4>
          <ul className="space-y-3 text-sm">
            <li><Link to="/contact" className="hover:text-orange transition-colors duration-200">Contact</Link></li>
            <li><a href="#faq" className="hover:text-orange transition-colors duration-200">FAQ</a></li>
            <li><a href="#" className="hover:text-orange transition-colors duration-200">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-orange transition-colors duration-200">Terms & Conditions</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Get In Touch</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/10 text-orange shrink-0"><MapPin className="h-4 w-4" /></span>
              <span className="mt-1">{EVENT.location}</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/10 text-orange shrink-0"><Mail className="h-4 w-4" /></span>
              <a href={`mailto:${EVENT.email}`} className="mt-1 hover:text-orange transition-colors">{EVENT.email}</a>
            </li>
            <li className="flex items-start gap-3">
              <span className="grid place-items-center h-8 w-8 rounded-lg bg-white/10 text-orange shrink-0"><Phone className="h-4 w-4" /></span>
              <a href={`tel:${EVENT.phone}`} className="mt-1 hover:text-orange transition-colors">{EVENT.phone}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>&copy; 2026 Run Beyond Limits. All rights reserved.</p>
          <p className="font-semibold text-white/70">Run Beyond Limits</p>
        </div>
      </div>
    </footer>
  );
}

