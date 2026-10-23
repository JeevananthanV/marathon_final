import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ShieldCheck, Scale, RefreshCcw, Truck } from "lucide-react";
import { Logo } from "./Navbar";
import { EVENT } from "@/data/marathon";

export default function Footer() {
  return (
    <footer className="gradient-footer text-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
        
        {/* Column 1: Brand & Social */}
        <div className="space-y-4">
          <div className="[&_span]:!text-white"><Logo inFooter /></div>
          <p className="text-sm text-white/60 max-w-xs leading-relaxed">
            A premier marathon uniting runners across Chennai, Bengaluru, and Salem to celebrate fitness, endurance, and human potential.
          </p>
          <div className="flex gap-2.5 pt-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Ico, i) => (
              <a
                key={i}
                href="#"
                aria-label="social"
                className="grid place-items-center h-9 w-9 rounded-full bg-white/10 hover:bg-orange hover:scale-110 transition-all duration-300"
              >
                <Ico className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Razorpay Verified Merchant
            </span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-orange transition-colors duration-200">Home</Link></li>
            <li><Link to="/event" className="hover:text-orange transition-colors duration-200">Event Details & Trail Maps</Link></li>
            <li><Link to="/register" className="hover:text-orange transition-colors duration-200">Register Online</Link></li>
            <li><Link to="/about" className="hover:text-orange transition-colors duration-200">About the Marathon</Link></li>
            <li><Link to="/gallery" className="hover:text-orange transition-colors duration-200">Photo Gallery</Link></li>
            <li><Link to="/certificates" className="hover:text-orange transition-colors duration-200">Download Certificates</Link></li>
          </ul>
        </div>

        {/* Column 3: Mandatory Legal Compliance Policies (Razorpay Audited) */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Scale className="h-3.5 w-3.5 text-orange" /> Legal & Policies
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/terms-and-conditions" className="hover:text-orange transition-colors duration-200 flex items-center gap-1.5">
                <span>Terms & Conditions</span>
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-orange transition-colors duration-200 flex items-center gap-1.5">
                <span>Privacy Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-orange transition-colors duration-200 flex items-center gap-1.5">
                <span>Cancellation & Refund</span>
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-orange transition-colors duration-200 flex items-center gap-1.5">
                <span>Shipping & Delivery Policy</span>
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-orange transition-colors duration-200 flex items-center gap-1.5">
                <span>Contact & Grievance Desk</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 4: Contact & Entity Details */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">Corporate Office</h4>
          <div className="space-y-3.5 text-sm text-white/70">
            <p className="font-semibold text-white text-xs">InfinityMiles Sports & Events Foundation</p>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-orange shrink-0 mt-0.5" />
              <span className="text-xs leading-relaxed">
                124 Marina Coast Highway, Santhome, Chennai, Tamil Nadu 600004
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-orange shrink-0" />
              <a href={`mailto:${EVENT.email}`} className="text-xs hover:text-orange transition-colors">{EVENT.email}</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-orange shrink-0" />
              <a href={`tel:${EVENT.phone}`} className="text-xs hover:text-orange transition-colors">{EVENT.phone}</a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Sub-Footer: Razorpay Mandated Compliance Bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>&copy; 2026 InfinityMiles Sports & Events Foundation. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-white/70">
            <Link to="/terms-and-conditions" className="hover:text-orange transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link to="/privacy-policy" className="hover:text-orange transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-orange transition-colors">Cancellation & Refund</Link>
            <span>•</span>
            <Link to="/shipping-policy" className="hover:text-orange transition-colors">Shipping & Delivery</Link>
            <span>•</span>
            <Link to="/contact-us" className="hover:text-orange transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
