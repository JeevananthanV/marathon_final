import { createFileRoute, Link } from "@tanstack/react-router";
import { Truck, Mail, Package, MapPin, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { EVENT, CITIES } from "@/data/marathon";

export const Route = createFileRoute("/shipping-policy")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery Policy · Run Beyond Limits 2026" },
      { name: "description", content: "Shipping and physical kit collection guidelines, electronic ticket delivery schedules, and Pre-Event Expo details for Run Beyond Limits 2026." },
    ],
  }),
  component: ShippingPolicyPage,
});

function ShippingPolicyPage() {
  return (
    <div className="gradient-page min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
            <Truck className="h-3.5 w-3.5" /> Order Fulfillment & Race Kit Fulfillment
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-black text-charcoal">
            Shipping & Delivery Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 15, 2026 · Fulfillment Model: Digital Confirmation + In-Person Expo Collection
          </p>
        </div>

        {/* Highlight Card: Expo Pickup Rule */}
        <div className="mb-8 rounded-2xl border-l-4 border-l-navy border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <Package className="h-5 w-5 text-navy shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
              <strong className="text-charcoal font-semibold block mb-0.5">Important Delivery Notice</strong>
              Physical race merchandise (Official Technical Running T-shirt, Allocated Bib with RFID timing chip, Goodie Bag) <strong>is NOT dispatched via courier to residential postal addresses</strong>. All physical items must be collected in person at the <strong>Pre-Event Bib Expo</strong> on September 25–26, 2026.
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-6 text-slate-700 text-sm md:text-base leading-relaxed bg-white rounded-3xl p-6 md:p-10 shadow-elevated border border-slate-100">
          
          {/* Section 1 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">1</span>
              Digital Delivery Schedule (Immediate &lt; 24 Hours)
            </h2>
            <p className="mt-3">
              Upon successful payment authorization via our Razorpay payment portal:
            </p>
            <ul className="mt-3 space-y-2 text-sm md:text-base">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>Instant Digital Confirmation Receipt:</strong> Dispatched immediately to your registered email address within <strong>15 minutes to 24 hours</strong> of settlement.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>Official Registration Pass & QR Code:</strong> Your official confirmation email contains your unique registration reference number, allocated Bib allocation details, and QR verification token for smooth check-in.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>WhatsApp Notification:</strong> If a valid WhatsApp mobile number was supplied, an automated transaction receipt and PDF ticket link will be delivered directly to your messaging application.</span>
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">2</span>
              Physical Race Kit Collection at Pre-Event Expo
            </h2>
            <p className="mt-3">
              To verify participant identity and guarantee accurate timing chip calibration, all runner kits must be collected during the designated 2-day Expo:
            </p>
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs md:text-sm space-y-2">
              <p className="flex items-center gap-2 font-bold text-charcoal">
                <Calendar className="h-4 w-4 text-orange" /> Expo Schedule: Friday, September 25 & Saturday, September 26, 2026
              </p>
              <p className="text-slate-600">
                Operating Timings: <strong>10:00 AM to 7:00 PM IST</strong> (Counters strictly close at 7:00 PM on Sept 26).
              </p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {CITIES.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-soft">
                  <span className="font-bold text-navy block text-sm">{c.name} Expo Center</span>
                  <p className="mt-1 text-xs text-slate-600 flex items-start gap-1">
                    <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-orange" />
                    {c.venue}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">3</span>
              Mandatory Documents for Bib Pickup
            </h2>
            <p className="mt-3">
              Please present the following credentials at your assigned collection counter:
            </p>
            <ol className="mt-3 space-y-2 list-decimal list-inside pl-1 text-sm md:text-base">
              <li>Digital or printed copy of your official <strong>Registration Confirmation Email / WhatsApp Pass with QR Code</strong>.</li>
              <li>A valid <strong>Government-issued Photo ID card</strong> (Aadhaar, Driving License, Passport, or Voter ID).</li>
              <li><strong>Authorizing a Representative:</strong> If you are unable to visit the Expo personally, your representative must present an authorization letter signed by you, a copy of your photo ID, and their own original photo ID.</li>
            </ol>
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <span><strong>Strict No Race Day Pickup:</strong> For safety and crowd management protocols, no Bib distribution or T-shirt distribution will occur on race morning (Sunday, September 27, 2026). Kits not collected by 7:00 PM on September 26 will be forfeited.</span>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">4</span>
              Delivery Inquiries & Support Desk
            </h2>
            <p className="mt-3">
              If you have not received your digital confirmation voucher within 24 hours of completing payment:
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs md:text-sm space-y-1">
              <p><strong>Fulfillment Support Team:</strong> InfinityMiles Sports & Events Foundation</p>
              <p>Email: <a href={`mailto:${EVENT.email}`} className="text-navy font-semibold hover:underline">{EVENT.email}</a></p>
              <p>Helpline: {EVENT.phone}</p>
            </div>
          </section>

        </div>

        {/* Quick Navigation Footer Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <Link to="/terms-and-conditions" className="hover:text-navy font-semibold underline">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="hover:text-navy font-semibold underline">Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-navy font-semibold underline">Cancellation & Refund Policy</Link>
          <Link to="/contact-us" className="hover:text-navy font-semibold underline">Contact Us</Link>
        </div>

      </div>
    </div>
  );
}
