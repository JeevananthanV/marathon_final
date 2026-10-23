import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCcw, AlertOctagon, CloudRain, Clock, HelpCircle, ShieldCheck } from "lucide-react";
import { EVENT } from "@/data/marathon";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy · Run Beyond Limits 2026" },
      { name: "description", content: "Official Cancellation and Refund policy, Force Majeure clauses, and Razorpay dispute protocols for Run Beyond Limits 2026." },
    ],
  }),
  component: RefundPolicyPage,
});

function RefundPolicyPage() {
  return (
    <div className="gradient-page min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
            <RefreshCcw className="h-3.5 w-3.5" /> Financial Terms & Cancellation Framework
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-black text-charcoal">
            Cancellation & Refund Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 15, 2026 · Compliant with Razorpay Merchant Standards
          </p>
        </div>

        {/* Highlight Card: No-Refund Rule */}
        <div className="mb-8 rounded-2xl border-l-4 border-l-amber-500 border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <AlertOctagon className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
              <strong className="text-charcoal font-semibold block mb-0.5">Registration Policy Summary</strong>
              Once an entry registration is submitted and payment is completed, <strong>race fees are strictly non-refundable and non-transferable</strong>. Event logistics, custom runner t-shirts, medals, and civic road closure permits are committed immediately upon slot reservation.
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-6 text-slate-700 text-sm md:text-base leading-relaxed bg-white rounded-3xl p-6 md:p-10 shadow-elevated border border-slate-100">
          
          {/* Section 1 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">1</span>
              General Registration Policy
            </h2>
            <p className="mt-3">
              All registrations for <strong>{EVENT.name}</strong> (covering the 21.1 KM Half Marathon, 10 KM Run, and 5 KM Fun Run) are deemed final. We do not entertain personal withdrawal requests, race category downgrades, or refund claims resulting from personal schedule conflicts, travel issues, work commitments, or minor athletic injuries occurring before the event date.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">2</span>
              Event Cancellation by Organizer
            </h2>
            <p className="mt-3">
              In the unlikely event that <strong>InfinityMiles Sports & Events Foundation</strong> cancels the marathon entirely and does not provide an alternative rescheduled race date:
            </p>
            <ul className="mt-3 space-y-2 text-sm md:text-base">
              <li className="flex items-start gap-2.5">
                <ShieldCheck className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>Full Fee Reimbursement:</strong> A 100% refund of the net registration fee will be initiated automatically to the original payment source (credit card, debit card, net banking, or UPI account).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-navy shrink-0 mt-1" />
                <span><strong>Processing Timeline:</strong> Refunds will be processed through our gateway partner (Razorpay) within <strong>5 to 7 working days</strong> from the official cancellation announcement. Credit reflecting on your bank statement may take an additional 2–3 business days depending on your issuing bank.</span>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">3</span>
              Act of God & Force Majeure Clause
            </h2>
            <p className="mt-3">
              Neither the Organizer nor any sponsoring entity shall be held liable for failure to stage or complete the race due to circumstances beyond reasonable control ("Force Majeure Events").
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs md:text-sm text-slate-700 flex items-start gap-3">
              <CloudRain className="h-5 w-5 text-navy shrink-0 mt-0.5" />
              <div>
                Force Majeure includes, without limitation: severe floods, cyclones, earthquakes, extreme heat warnings, pandemic or epidemic restrictions, government lock-downs, civic curfews, police orders, or sudden loss of venue/road permits for national security reasons.
              </div>
            </div>
            <p className="mt-3">
              If a Force Majeure event occurs:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-xs md:text-sm pl-1">
              <li>The Organizer reserves the right to postpone or reschedule the event to a viable future date.</li>
              <li>Confirmed registrations will be automatically rolled over to the revised event date without extra charges.</li>
              <li>Under Force Majeure conditions, cash refunds will not be disbursed as advance municipal, traffic, and vendor commitments will have already been incurred.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">4</span>
              Technical Glitches & Duplicate Payment Claims
            </h2>
            <p className="mt-3">
              If an applicant experiences a browser drop, network glitch, or accidental multiple debit for a single registration:
            </p>
            <ol className="mt-3 space-y-2 list-decimal list-inside pl-1 text-sm md:text-base">
              <li>Please write immediately to <a href={`mailto:${EVENT.email}`} className="text-navy font-semibold hover:underline">{EVENT.email}</a> or <a href="mailto:support@infinitymiles.com" className="text-navy font-semibold hover:underline">support@infinitymiles.com</a> with your transaction reference ID and bank debit screenshot.</li>
              <li>Our finance team will cross-reference the payment logs with Razorpay.</li>
              <li>Upon verifying the duplicate debit, the surplus amount will be refunded directly to your original payment method within <strong>5 to 7 working days</strong>.</li>
            </ol>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">5</span>
              Helpdesk & Refund Inquiries
            </h2>
            <p className="mt-3">
              For any payment clarification or transaction status inquiry, please connect with our accounts team:
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs md:text-sm space-y-1">
              <p><strong>Accounts & Settlement Desk</strong></p>
              <p>InfinityMiles Sports & Events Foundation</p>
              <p>Email: <a href={`mailto:${EVENT.email}`} className="text-navy font-semibold hover:underline">{EVENT.email}</a></p>
              <p>Phone / WhatsApp: {EVENT.phone}</p>
              <p>Operating Hours: Monday – Saturday, 9:30 AM to 6:30 PM IST</p>
            </div>
          </section>

        </div>

        {/* Quick Navigation Footer Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <Link to="/terms-and-conditions" className="hover:text-navy font-semibold underline">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="hover:text-navy font-semibold underline">Privacy Policy</Link>
          <Link to="/shipping-policy" className="hover:text-navy font-semibold underline">Shipping & Delivery Policy</Link>
          <Link to="/contact-us" className="hover:text-navy font-semibold underline">Contact Us</Link>
        </div>

      </div>
    </div>
  );
}
