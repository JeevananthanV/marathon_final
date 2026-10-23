import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Eye, Database, Camera, Mail, CheckCircle2 } from "lucide-react";
import { EVENT } from "@/data/marathon";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy · Run Beyond Limits 2026" },
      { name: "description", content: "Privacy policy, data collection disclosures, Razorpay payment security protocols, and media consent clauses for Run Beyond Limits 2026." },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <div className="gradient-page min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
            <Shield className="h-3.5 w-3.5" /> Data Protection & Privacy Framework
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-black text-charcoal">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective Date: January 15, 2026 · Compliant with the Information Technology Act, 2000 (India)
          </p>
        </div>

        {/* Highlight Card: Security & Encryption */}
        <div className="mb-8 rounded-2xl border-l-4 border-l-emerald border border-slate-200 bg-white p-5 shadow-soft">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
            <div className="text-xs md:text-sm text-slate-700 leading-relaxed">
              <strong className="text-charcoal font-semibold block mb-0.5">Zero-Card-Storage Guarantee</strong>
              Run Beyond Limits does <strong>never store or capture</strong> credit/debit card numbers, CVVs, or UPI PINs on its application servers. All monetary transactions are processed through end-to-end tokenized, PCI-DSS Level 1 certified gateways by <strong>Razorpay Software Private Limited</strong>.
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-6 text-slate-700 text-sm md:text-base leading-relaxed bg-white rounded-3xl p-6 md:p-10 shadow-elevated border border-slate-100">
          
          {/* Section 1 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">1</span>
              Scope & Overview
            </h2>
            <p className="mt-3">
              This Privacy Policy explains how <strong>InfinityMiles Sports & Events Foundation</strong> ("We", "Our", or "Us") collects, processes, stores, and protects personal information gathered through the <strong>Run Beyond Limits 2026</strong> marathon registration portal ({EVENT.name}). We are committed to maintaining the highest privacy standards in compliance with the Indian Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.
            </p>
          </section>

          {/* Section 2 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">2</span>
              Data Collection Disclosures
            </h2>
            <p className="mt-3">
              During participant registration, ticket acquisition, or venue check-in, we collect the following specific data points:
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="font-bold text-charcoal text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-navy" /> Identity & Profile
                </p>
                <ul className="mt-2 space-y-1 text-xs md:text-sm text-slate-600">
                  <li>• Full legal name</li>
                  <li>• Date of Birth (for category age limits)</li>
                  <li>• Gender & T-shirt size preference</li>
                  <li>• Government ID details (at bib collection)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="font-bold text-charcoal text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-navy" /> Contact & Communication
                </p>
                <ul className="mt-2 space-y-1 text-xs md:text-sm text-slate-600">
                  <li>• Active mobile telephone number</li>
                  <li>• Email address (for electronic tickets/invoices)</li>
                  <li>• Residential postal address & pincode</li>
                  <li>• WhatsApp number (for instant race alerts)</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="font-bold text-charcoal text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-rose-600" /> Medical & Emergency
                </p>
                <ul className="mt-2 space-y-1 text-xs md:text-sm text-slate-600">
                  <li>• Blood group profile</li>
                  <li>• Emergency contact person's name & relationship</li>
                  <li>• Emergency contact phone number</li>
                  <li>• Known medical allergies or cardiac declarations</li>
                </ul>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="font-bold text-charcoal text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-orange" /> Timing & Race Performance
                </p>
                <ul className="mt-2 space-y-1 text-xs md:text-sm text-slate-600">
                  <li>• Allocated Bib Number & RFID tag ID</li>
                  <li>• Split split timing marks & finish gun times</li>
                  <li>• Official ranking and finisher certificates</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">3</span>
              Payment Processing Protocols via Razorpay
            </h2>
            <p className="mt-3">
              All transactions executed on this website are facilitated through <strong>Razorpay Software Private Limited</strong>.
            </p>
            <ul className="mt-3 space-y-2 text-sm md:text-base">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>No Sensitive Card Storage:</strong> Your payment credentials (card numbers, expiry dates, CVVs, netbanking passwords, or UPI MPINs) are entered strictly within Razorpay’s encrypted iframe modal. We never view, capture, or store these tokens on our servers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald shrink-0 mt-1" />
                <span><strong>Cryptographic Server Handshake:</strong> Our server only receives an opaque transaction token (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono">razorpay_payment_id</code>) and verifies authentic transactions via HMAC-SHA256 hash algorithms.</span>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">4</span>
              Media Consent & Photography Clause
            </h2>
            <p className="mt-3">
              By registering and appearing in public areas along the marathon route, runner holding zones, or award podiums, you grant <strong>InfinityMiles Sports & Events Foundation</strong> and its authorized media partners an irrevocable, worldwide, royalty-free license to capture photographs, motion pictures, drone footage, and audio recordings of your participation.
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-4 text-xs md:text-sm text-slate-700 flex items-start gap-3">
              <Camera className="h-5 w-5 text-navy shrink-0 mt-0.5" />
              <div>
                These media assets may be utilized across official race websites, social media channels, print publications, news broadcasts, sponsor reports, and promotional materials for future editions of the marathon without additional compensation or notice.
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="border-b border-slate-100 pb-6">
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">5</span>
              Data Retention & Sharing
            </h2>
            <p className="mt-3">
              We do not sell, rent, or lease runner contact lists to third-party commercial marketing brokers. Information is shared strictly with:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-xs md:text-sm pl-1">
              <li>On-course hospital & medical emergency teams (solely in case of injury or acute distress).</li>
              <li>Official timing partners (for issuing certified chip times & e-certificates).</li>
              <li>Law enforcement, civic traffic authorities, and venue management as mandated by public safety statutes.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="font-display text-xl md:text-2xl font-bold text-charcoal flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-navy/10 text-navy text-sm font-black">6</span>
              Grievance Officer & Data Inquiries
            </h2>
            <p className="mt-3">
              In accordance with the Information Technology Act 2000 and rules made thereunder, the designated Grievance Officer for data protection concerns is:
            </p>
            <div className="mt-3 rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs md:text-sm space-y-1">
              <p><strong>Grievance & Privacy Officer:</strong> Compliance Desk</p>
              <p><strong>Entity:</strong> InfinityMiles Sports & Events Foundation</p>
              <p><strong>Address:</strong> 124 Marina Coast Highway, Santhome, Chennai, Tamil Nadu 600004, India</p>
              <p><strong>Email:</strong> <a href="mailto:privacy@infinitymiles.com" className="text-navy font-semibold hover:underline">privacy@infinitymiles.com</a> / <a href={`mailto:${EVENT.email}`} className="text-navy font-semibold hover:underline">{EVENT.email}</a></p>
              <p><strong>Turnaround Time:</strong> Grievances will be addressed within 48 business hours.</p>
            </div>
          </section>

        </div>

        {/* Quick Navigation Footer Links */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <Link to="/terms-and-conditions" className="hover:text-navy font-semibold underline">Terms & Conditions</Link>
          <Link to="/refund-policy" className="hover:text-navy font-semibold underline">Cancellation & Refund Policy</Link>
          <Link to="/shipping-policy" className="hover:text-navy font-semibold underline">Shipping & Delivery Policy</Link>
          <Link to="/contact-us" className="hover:text-navy font-semibold underline">Contact Us</Link>
        </div>

      </div>
    </div>
  );
}
