import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, Building2, ShieldCheck, Send } from "lucide-react";
import { useState } from "react";
import { EVENT } from "@/data/marathon";
import { toast } from "sonner";

export const Route = createFileRoute("/contact-us")({
  head: () => ({
    meta: [
      { title: "Contact Us · Legal & Support Information · Run Beyond Limits 2026" },
      { name: "description", content: "Official corporate contact details, physical registered office address, helpline numbers, and grievance desk for Run Beyond Limits 2026." },
    ],
  }),
  component: ContactUsPage,
});

function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "Registration", message: "" });
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", subject: "Registration", message: "" });
      toast.success("Thank you for reaching out! Our support team will get back to you within 24 hours.");
    }, 600);
  }

  return (
    <div className="gradient-page min-h-screen py-10 md:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-8 text-center md:text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-navy/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-navy">
            <Building2 className="h-3.5 w-3.5" /> Corporate Entity & Support Information
          </div>
          <h1 className="mt-3 font-display text-3xl md:text-5xl font-black text-charcoal">
            Contact Us
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Official Registered Entity & Participant Helpline for {EVENT.name}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          
          {/* Left Column: Official Legal & Corporate Details (3 cols) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Entity Card */}
            <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-elevated space-y-6">
              
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-navy">Operating Legal Entity</p>
                <h2 className="mt-1 font-display text-2xl font-black text-charcoal">
                  InfinityMiles Sports & Events Foundation
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Registered Non-Profit Sports Organization · CIN / Reg: U92410TN2024NPL142981
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
                
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-navy shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-charcoal font-semibold">Registered Headquarters & Office</strong>
                    <p className="mt-0.5 text-slate-600 leading-relaxed">
                      124 Marina Coast Highway, Santhome,<br />
                      Chennai, Tamil Nadu – 600004, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-navy shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-charcoal font-semibold">Direct Communication Lines</strong>
                    <p className="mt-0.5 text-slate-600">
                      General: <a href={`mailto:${EVENT.email}`} className="text-navy font-semibold hover:underline">{EVENT.email}</a><br />
                      Participant Support: <a href="mailto:support@infinitymiles.com" className="text-navy font-semibold hover:underline">support@infinitymiles.com</a><br />
                      Legal & Grievances: <a href="mailto:legal@infinitymiles.com" className="text-navy font-semibold hover:underline">legal@infinitymiles.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-navy shrink-0">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-charcoal font-semibold">Telephone & WhatsApp Helpline</strong>
                    <p className="mt-0.5 text-slate-600">
                      Helpline: <a href={`tel:${EVENT.phone}`} className="text-navy font-semibold hover:underline">{EVENT.phone}</a><br />
                      WhatsApp Support: <a href="https://wa.me/911234567890" target="_blank" rel="noopener noreferrer" className="text-emerald font-semibold hover:underline">+91 12345 67890</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-navy/10 text-navy shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <strong className="block text-charcoal font-semibold">Operational Support Hours</strong>
                    <p className="mt-0.5 text-slate-600">
                      Monday to Saturday: 9:30 AM – 6:30 PM IST<br />
                      Sunday & Public Holidays: Emergency Race Operations Desk only
                    </p>
                  </div>
                </div>

              </div>

              {/* Razorpay Merchant Compliance Badge */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald shrink-0 mt-0.5" />
                <div>
                  <strong>Merchant Verification Standard:</strong> Payments for race entries are securely processed via Razorpay Software Private Limited. For payment disputes, chargeback clarifications, or transaction receipts, you may quote your <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">order_id</code> directly to our support desk.
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Send Message Form (2 cols) */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-elevated">
              <h3 className="font-display text-xl font-bold text-charcoal">
                Send Us a Message
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                We typically respond within 2 to 4 business hours.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Runner name"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="runner@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Inquiry Subject</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy"
                  >
                    <option value="Registration">Registration & Ticket Confirmation</option>
                    <option value="Payment">Payment Gateway or Duplicate Debit</option>
                    <option value="Bib">Bib Expo & T-Shirt Pickup</option>
                    <option value="Corporate">Corporate / Group Bulk Entry</option>
                    <option value="General">General Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">Your Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Please include your Order ID or Bib number if applicable..."
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-navy focus:ring-1 focus:ring-navy resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl gradient-orange py-3 text-sm font-bold text-white shadow-soft hover:scale-[1.02] transition disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  {sending ? "Sending message..." : "Submit Message"}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Quick Navigation Footer Links */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 text-xs md:text-sm text-slate-500">
          <Link to="/terms-and-conditions" className="hover:text-navy font-semibold underline">Terms & Conditions</Link>
          <Link to="/privacy-policy" className="hover:text-navy font-semibold underline">Privacy Policy</Link>
          <Link to="/refund-policy" className="hover:text-navy font-semibold underline">Cancellation & Refund Policy</Link>
          <Link to="/shipping-policy" className="hover:text-navy font-semibold underline">Shipping & Delivery Policy</Link>
        </div>

      </div>
    </div>
  );
}
