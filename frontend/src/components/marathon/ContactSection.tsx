import { useState } from "react";
import { Mail, Phone, Send, MapPin } from "lucide-react";
import { EVENT } from "@/data/marathon";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  message: z.string().trim().min(5, "Message is too short").max(1000),
});

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", phone: "", message: "" });
      toast.success("Message sent! We'll be in touch soon.");
    }, 700);
  }

  return (
    <section id="contact" className="py-10 md:py-24 bg-white dots-pattern">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <p className="text-navy font-semibold text-xs tracking-widest uppercase">Contact Us</p>
          <h2 className="mt-2 font-display text-2xl md:text-5xl font-extrabold text-charcoal leading-tight">
            We’d love to hear from you
          </h2>
          <p className="mt-3 text-muted-foreground text-sm max-w-lg hidden md:block">
            Have a question about registration, race day or partnerships? Our team is here to help.
          </p>
          <ul className="mt-5 md:mt-8 space-y-3">
            <li className="flex items-start gap-3 rounded-xl bg-white p-3 md:p-5 shadow-soft border border-slate-100/60 transition-shadow duration-200 hover:shadow-elevated">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-navy/10 text-navy shrink-0"><Mail className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Email</p>
                <a href={`mailto:${EVENT.email}`} className="font-semibold text-sm text-charcoal hover:text-navy transition-colors">{EVENT.email}</a>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl bg-white p-3 md:p-5 shadow-soft border border-slate-100/60 transition-shadow duration-200 hover:shadow-elevated">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-navy/10 text-navy shrink-0"><Phone className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Phone</p>
                <a href={`tel:${EVENT.phone}`} className="font-semibold text-sm text-charcoal hover:text-navy transition-colors">{EVENT.phone}</a>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl bg-white p-3 md:p-5 shadow-soft border border-slate-100/60 transition-shadow duration-200 hover:shadow-elevated">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-navy/10 text-navy shrink-0"><Mail className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Registration Support</p>
                <a href={`mailto:${EVENT.supportEmail}`} className="font-semibold text-sm text-charcoal hover:text-navy transition-colors">{EVENT.supportEmail}</a>
              </div>
            </li>
            <li className="flex items-start gap-3 rounded-xl bg-white p-3 md:p-5 shadow-soft border border-slate-100/60 transition-shadow duration-200 hover:shadow-elevated">
              <span className="grid place-items-center h-9 w-9 rounded-lg bg-navy/10 text-navy shrink-0"><MapPin className="h-4 w-4" /></span>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Location</p>
                <p className="font-semibold text-sm text-charcoal">{EVENT.location}</p>
              </div>
            </li>
          </ul>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl bg-white border border-slate-100 p-5 md:p-10 space-y-4 shadow-elevated transition-shadow duration-300 hover:shadow-glow" noValidate>
          <Field label="Full Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
          <Field label="Email" name="email" type="email" value={form.email} onChange={onChange} error={errors.email} />
          <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={onChange} error={errors.phone} />
          <div>
            <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={form.message}
              onChange={onChange}
              className={`mt-2 w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:bg-white focus:border-navy/40 focus:ring-4 focus:ring-navy/10 shadow-sm transition-all duration-200 ${errors.message ? "border-destructive" : "border-slate-200"}`}
            />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full gradient-orange text-white px-8 py-3.5 font-bold shadow-soft hover:shadow-glow hover:scale-105 transition-all duration-300 disabled:opacity-70 cursor-pointer"
          >
            <Send className="h-4 w-4" /> {sending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", value, onChange, error }: {
  label: string; name: string; type?: string;
  value: string; onChange: React.ChangeEventHandler<HTMLInputElement>; error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`mt-2 w-full rounded-xl border bg-[#F8FAFC] px-4 py-3 text-sm outline-none focus:bg-white focus:border-navy/40 focus:ring-4 focus:ring-navy/10 shadow-sm transition-all duration-200 ${error ? "border-destructive" : "border-slate-200"}`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
