import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ChevronRight, CircleCheck, MapPin } from "lucide-react";
import { RACES, EVENT, CITIES } from "@/data/marathon";
import { z } from "zod";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register · Run Beyond Limits 2026" },
      { name: "description", content: "Complete your registration for Run Beyond Limits 2026 in a few simple steps." },
    ],
  }),
  component: RegisterPage,
});

const STEPS = ["City", "Race", "Details", "Address", "T-Shirt", "Review"] as const;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;

const detailsSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(100),
  dob: z.string().min(1, "Select your date of birth"),
  gender: z.enum(["Male", "Female", "Other"], { message: "Select gender" }),
  phone: z.string().trim().min(7, "Enter a valid phone").max(20),
  email: z.string().trim().email("Invalid email").max(255),
  emergencyContact: z.string().trim().min(7, "Enter emergency contact").max(20),
});
const addressSchema = z.object({
  address: z.string().trim().min(5, "Address is too short").max(200),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{5,6}$/, "Enter a valid pincode"),
});

function RegisterPage() {
  const [step, setStep] = useState(0);
  const [cityId, setCityId] = useState<string>("chennai");
  const [raceId, setRaceId] = useState<string>("10k");
  const [details, setDetails] = useState({ fullName: "", dob: "", gender: "", phone: "", email: "", emergencyContact: "" });
  const [address, setAddress] = useState({ address: "", city: "", state: "", pincode: "" });
  const [size, setSize] = useState<string>("M");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const race = useMemo(() => RACES.find((r) => r.id === raceId)!, [raceId]);

  function next() {
    if (step === 2) {
      const p = detailsSchema.safeParse(details);
      if (!p.success) {
        const e: Record<string, string> = {};
        p.error.issues.forEach((i) => (e[String(i.path[0])] = i.message));
        setErrors(e);
        return;
      }
    }
    if (step === 3) {
      const p = addressSchema.safeParse(address);
      if (!p.success) {
        const e: Record<string, string> = {};
        p.error.issues.forEach((i) => (e[String(i.path[0])] = i.message));
        setErrors(e);
        return;
      }
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }
  function back() {
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
  }
  async function confirm() {
    setSubmitting(true);
    try {
      const payload = {
        ...details,
        ...address,
        cityId,
        raceId,
        size,
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://marathon-website-2.onrender.com" : "http://localhost:5000")}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Registration failed. Please try again.");
      }
      setDone(true);
      toast.success("Registration confirmed! Check your email for details.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="min-h-[70vh] grid place-items-center gradient-page px-4 py-16">
        <div className="max-w-lg text-center bg-white rounded-3xl p-10 shadow-elevated">
          <CircleCheck className="mx-auto h-16 w-16 text-emerald" />
          <h1 className="mt-4 font-display text-3xl font-extrabold text-charcoal">You're In!</h1>
          <p className="mt-2 text-muted-foreground">
            Your spot for the <span className="font-semibold text-charcoal">{race.distance} KM {race.type}</span> is
            reserved. A confirmation with payment link has been sent to your email.
          </p>
          <Link to="/" className="mt-6 inline-flex rounded-full gradient-orange text-white px-6 py-3 font-semibold">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="gradient-page min-h-screen">
      <section className="page-header-banner text-white py-10 md:py-14">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70 font-semibold text-sm tracking-widest uppercase">Registration</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Join Run Beyond Limits 2026</h1>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Complete your registration in a few simple steps and secure your spot.
          </p>
        </div>
      </section>
    <section className="bg-[#F8FAFC] py-14 md:py-20 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

        {/* Stepper */}
        <div className="mb-8 grid grid-cols-3 md:grid-cols-6 gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="text-center">
              <div className={`mx-auto h-9 w-9 rounded-full grid place-items-center text-xs font-bold ${
                i < step ? "bg-navy text-white" : i === step ? "gradient-orange text-white shadow-glow" : "bg-white text-muted-foreground border border-border"
              }`}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <p className={`mt-2 text-[10px] md:text-xs font-semibold uppercase tracking-widest ${i === step ? "text-navy" : "text-muted-foreground"}`}>{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-white p-6 md:p-10 shadow-soft">
          {step === 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Select Your City</h2>
              <p className="mt-1 text-sm text-muted-foreground">Choose where you want to run.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {CITIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setCityId(c.id)}
                    className={`text-left rounded-2xl p-5 border-2 transition ${
                      cityId === c.id ? "border-navy bg-navy/5 shadow-soft" : "border-border hover:border-navy/30"
                    }`}
                  >
                    <div className="font-display text-2xl font-black text-charcoal">{c.name}</div>
                    <p className="mt-1 text-sm flex items-center gap-1"><MapPin className="h-3 w-3"/> {c.venue}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Select Your Race</h2>
              <p className="mt-1 text-sm text-muted-foreground">Choose the distance that inspires you.</p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {RACES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setRaceId(r.id)}
                    className={`text-left rounded-2xl p-5 border-2 transition ${
                      raceId === r.id ? "border-navy bg-navy/5 shadow-soft" : "border-border hover:border-navy/30"
                    }`}
                  >
                    <div className="font-display text-4xl font-black text-charcoal">{r.distance}<span className="text-lg"> KM</span></div>
                    <p className="mt-1 font-semibold">{r.type}</p>
                    <p className="text-xs text-muted-foreground">{r.subtype} · Min age {r.minAge}</p>
                    <p className="mt-3 text-orange font-bold">₹{r.fee}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Participant Details</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Input label="Full Name" value={details.fullName} error={errors.fullName} onChange={(v) => setDetails({ ...details, fullName: v })} />
                <Input label="Date of Birth" type="date" value={details.dob} error={errors.dob} onChange={(v) => setDetails({ ...details, dob: v })} />
                <Select label="Gender" value={details.gender} error={errors.gender} onChange={(v) => setDetails({ ...details, gender: v })} options={["Male", "Female", "Other"]} />
                <Input label="Phone" type="tel" value={details.phone} error={errors.phone} onChange={(v) => setDetails({ ...details, phone: v })} />
                <Input label="Email" type="email" value={details.email} error={errors.email} onChange={(v) => setDetails({ ...details, email: v })} />
                <Input label="Emergency Contact" type="tel" value={details.emergencyContact} error={errors.emergencyContact} onChange={(v) => setDetails({ ...details, emergencyContact: v })} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Address</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Input label="Address" value={address.address} error={errors.address} onChange={(v) => setAddress({ ...address, address: v })} />
                </div>
                <Input label="City" value={address.city} error={errors.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Input label="State" value={address.state} error={errors.state} onChange={(v) => setAddress({ ...address, state: v })} />
                <Input label="Pincode" value={address.pincode} error={errors.pincode} onChange={(v) => setAddress({ ...address, pincode: v })} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">T-Shirt Size</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick the size that fits you best.</p>
              <div className="mt-6 grid grid-cols-3 md:grid-cols-6 gap-3">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-14 rounded-xl font-bold text-lg border-2 transition ${
                      size === s ? "border-navy bg-navy text-white" : "border-border hover:border-navy/30"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-charcoal">Review & Confirm</h2>
              <div className="mt-6 space-y-4">
                <Row label="City" value={CITIES.find(c => c.id === cityId)?.name || ""} />
                <Row label="Race" value={`${race.distance} KM ${race.type}`} />
                <Row label="Participant" value={details.fullName} />
                <Row label="Email · Phone" value={`${details.email} · ${details.phone}`} />
                <Row label="Address" value={`${address.address}, ${address.city}, ${address.state} - ${address.pincode}`} />
                <Row label="T-Shirt Size" value={size} />
                <div className="rounded-2xl gradient-orange text-white p-5 flex items-center justify-between mt-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/80">Total</p>
                    <p className="font-display text-3xl font-black">₹{race.fee}</p>
                  </div>
                  <p className="text-xs text-white/80 max-w-[150px] text-right">{EVENT.date}<br/>{CITIES.find(c => c.id === cityId)?.name}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-charcoal hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="inline-flex items-center gap-2 rounded-full gradient-orange text-white px-6 py-3 font-semibold shadow-soft hover:scale-105 transition">
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={confirm}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-orange hover:bg-[#EA580C] text-white px-6 py-3 font-semibold shadow-soft hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                {submitting ? "Submitting..." : "Proceed to Payment"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", error }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; error?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-charcoal">{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy ${error ? "border-destructive" : "border-border"}`}
      />
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Select({ label, value, onChange, options, error }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; error?: string;
}) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-charcoal">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-navy ${error ? "border-destructive" : "border-border"}`}
      >
        <option value="">Select...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <span className="font-semibold text-charcoal text-right">{value}</span>
    </div>
  );
}
