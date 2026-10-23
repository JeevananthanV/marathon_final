import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, ShieldAlert, Award, Scale, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { EVENT, RACES } from "@/data/marathon";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions · Run Beyond Limits 2026" },
      { name: "description", content: "Official Terms and Conditions, race eligibility criteria, bib transfer disclaimers, and medical liability waivers for Run Beyond Limits 2026." },
    ],
  }),
  component: TermsAndConditionsPage,
});

function TermsAndConditionsPage() {
  return (
    <div className="gradient-page min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
            <Scale className="h-3.5 w-3.5" /> Legal Framework & Participant Agreement
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-black text-charcoal">
            Terms & Conditions
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Last Updated: January 15, 2026 · Governed under the Laws of Tamil Nadu, India
          </p>
        </div>

        {/* Highlight Card: Compliance Notice */}
        <div className="mb-8 rounded-2xl border-l-4 border-l-[#e9387c] border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-5 w-5 text-[#e9387c] shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
              <strong className="text-charcoal font-semibold block mb-0.5">Mandatory Participant Agreement</strong>
              By registering, paying the entry fee, or stepping onto the race track for {EVENT.name}, you explicitly agree to enter into a legally binding contract with <strong>InfinityMiles Sports & Events Foundation</strong>. Please read these terms carefully.
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-6 text-slate-700 text-sm md:text-base leading-relaxed bg-white rounded-3xl p-6 md:p-10 shadow-elevated border border-slate-100">
          
          {/* Section 1 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">1</span>
              Organizer & Legal Entity
            </h2>
            <p className="mt-3">
              The marathon event titled <strong>"{EVENT.name}"</strong> is organized, promoted, and administered by <strong>InfinityMiles Sports & Events Foundation</strong> ("Organizer", "We", "Us", or "Our"), a registered sports entity incorporated under the Companies Act, having its operational headquarters in Chennai, Tamil Nadu, India.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">2</span>
              Event Eligibility & Age Restrictions
            </h2>
            <p className="mt-3">
              To participate in any race category of {EVENT.name}, runners must strictly meet the minimum age criteria calculated as of race day (September 27, 2026):
            </p>
            <ul className="mt-3 space-y-2.5">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>21.1 KM Half Marathon:</strong> Participants must be at least <strong>18 years old</strong> on or before September 27, 2026.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>10 KM Challenge Run:</strong> Participants must be at least <strong>16 years old</strong> on or before September 27, 2026.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>5 KM Fun Run:</strong> Participants must be at least <strong>12 years old</strong> on or before September 27, 2026. Participants below 18 years must submit written parental or legal guardian consent.</span>
              </li>
            </ul>
            <p className="mt-3 text-xs md:text-sm text-slate-500 italic">
              Verification with valid Government-issued photo identification (Aadhaar Card, Passport, Voter ID, or Driver's License) is required at the Bib Distribution Expo.
            </p>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">3</span>
              Strict Bib Transfer & Resale Prohibition
            </h2>
            <p className="mt-3">
              Allocated Race Bib numbers and embedded RFID timing chips are strictly <strong>non-transferable</strong> and <strong>non-saleable</strong>.
            </p>
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs md:text-sm text-amber-900 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Safety & Medical Liability Warning:</strong> Running under another person's allocated bib falsifies emergency contact profiles, blood group records, and medical rescue dispatch. Any runner caught wearing another individual’s bib will be immediately disqualified, removed from the course, stripped of finish times, and permanently blacklisted from future editions.
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">4</span>
              Medical Liability Waiver & Participant Undertaking
            </h2>
            <p className="mt-3">
              Distance running involves inherent physical exertion and cardiovascular stress. By registering, the participant affirms and agrees:
            </p>
            <ol className="mt-3 space-y-2 list-decimal list-inside pl-1 text-sm md:text-base">
              <li>You are medically fit, adequately trained, and have obtained physician clearance where appropriate to complete your chosen distance.</li>
              <li>You freely assume all risks associated with participation, including but not limited to dehydration, cardiac events, falls, contact with other runners, vehicular traffic, and adverse weather conditions.</li>
              <li>You release and hold harmless <strong>InfinityMiles Sports & Events Foundation</strong>, venue authorities, sponsors, volunteers, emergency personnel, and local police from any liability, injury, illness, disability, loss of property, or death arising during or in connection with the event.</li>
              <li>You authorize certified on-course medical personnel to administer emergency first aid, CPR, or transport you to the nearest hospital facility if deemed necessary.</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">5</span>
              Payment, Registration & Pricing
            </h2>
            <p className="mt-3">
              All registration prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes. Payments are securely processed via Razorpay Software Private Limited. Entries are confirmed only upon receipt of official payment authorization and generation of an official registration record.
            </p>
          </section>

          {/* Section 6 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">6</span>
              Governing Law & Legal Jurisdiction
            </h2>
            <p className="mt-3">
              These Terms & Conditions shall be governed, interpreted, and construed exclusively in accordance with the laws of the Republic of India and the State of Tamil Nadu. Any dispute, claim, or legal proceeding arising out of or related to this event shall be subject to the exclusive jurisdiction of the competent courts in <strong>Chennai, Tamil Nadu, India</strong>.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">7</span>
              Contact for Legal Notices
            </h2>
            <p className="mt-3">
              For any formal legal notices or queries regarding these terms, please contact:
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs md:text-sm space-y-1">
              <p><strong>Legal & Compliance Department</strong></p>
              <p>InfinityMiles Sports & Events Foundation</p>
              <p>Email: <a href="mailto:legal@infinitymiles.com" className="text-navy font-semibold hover:underline">legal@infinitymiles.com</a> / <a href={`mailto:${EVENT.email}`} className="text-navy font-semibold hover:underline">{EVENT.email}</a></p>
              <p>Phone: {EVENT.phone}</p>
            </div>
          </section>

        </div>

        {/* Quick Navigation Footer Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <Link to="/privacy-policy" className="hover:text-navy font-semibold underline">View Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-navy font-semibold underline">View Cancellation & Refund Policy</Link>
          <Link to="/shipping-policy" className="hover:text-navy font-semibold underline">View Shipping & Delivery Policy</Link>
          <Link to="/contact-us" className="hover:text-navy font-semibold underline">Contact Us</Link>
        </div>

      </div>
    </div>
  );
}
