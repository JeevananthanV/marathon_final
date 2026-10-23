import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, Download, Calendar, MapPin, Trophy, ShieldCheck, 
  ArrowRight, Share2, Award, Clock, User, Phone, Mail, Sparkles,
  QrCode, Printer, Package, Shirt, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { EVENT, CITIES, RACES } from "@/data/marathon";
import { toast } from "sonner";

export const Route = createFileRoute("/status/success")({
  head: () => ({
    meta: [
      { title: "Registration Confirmed! · Run Beyond Limits 2026" },
      { name: "description", content: "Your marathon registration, allocated Bib number, and official scannable entry ticket have been confirmed." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || "",
  }),
  component: PaymentSuccessPage,
});

type ParticipantData = {
  participantId?: number;
  fullName: string;
  email: string;
  phone: string;
  raceId: string;
  cityId: string;
  size: string;
  paymentStatus: string;
  paymentTxnId: string;
  bibNumber: string;
  orderId: string;
  registrationDate?: string;
  verifyCode?: string;
  kitCollected?: string;
  kitCollectedAt?: string;
  qrCodeDataUrl?: string;
  ticketPdfUrl?: string;
};

function generateIcsCalendar(runnerName: string, raceTitle: string, venue: string, dateIso: string) {
  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Run Beyond Limits//Marathon Event//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `SUMMARY:Run Beyond Limits 2026 - ${raceTitle}`,
    `DESCRIPTION:Official Race Day for ${runnerName}. Assemble at 5:00 AM. Flag-off at 5:30 AM. Wear your official bib number and technical t-shirt.`,
    `LOCATION:${venue}`,
    "DTSTART:20260927T000000Z",
    "DTEND:20260927T060000Z",
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT24H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Run Beyond Limits 2026 tomorrow at 5:00 AM!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Run_Beyond_Limits_2026_${raceTitle.replace(/\s+/g, "_")}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  toast.success("Calendar invite downloaded! Tap to add to Google/Apple Calendar.");
}

function PaymentSuccessPage() {
  const search = useSearch({ from: "/status/success" });
  const orderOrParticipantId = search.id;

  const [data, setData] = useState<ParticipantData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderOrParticipantId) {
      setLoading(false);
      return;
    }

    fetch(`/api/v1/marathon/order-status/${encodeURIComponent(orderOrParticipantId)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch((err) => console.error("Error fetching status:", err))
      .finally(() => setLoading(false));
  }, [orderOrParticipantId]);

  const race = RACES.find((r) => r.id === (data?.raceId || "10k")) || RACES[1];
  const city = CITIES.find((c) => c.id === (data?.cityId || "chennai")) || CITIES[0];

  const runnerName = data?.fullName || "Runner";
  const bib = data?.bibNumber || "CHE-10K-0001";
  const paymentId = data?.paymentTxnId || "pay_razorpay_verified";
  const orderId = data?.orderId || orderOrParticipantId || "order_confirmed";
  const ticketPdfUrl = data?.ticketPdfUrl || `/api/v1/marathon/ticket-pdf/${data?.participantId || orderOrParticipantId}`;

  return (
    <div className="gradient-page min-h-screen py-10 md:py-16 text-charcoal print:p-0 print:bg-white">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Victory Header */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white border border-slate-200 p-6 md:p-10 shadow-elevated text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-pink-500 via-[#e9387c] to-purple-600" />

          {/* Animated Success Badge */}
          <div className="mx-auto h-16 w-16 md:h-20 md:w-20 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-soft mb-5">
            <CheckCircle2 className="h-9 w-9 md:h-10 md:w-10" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3.5 py-1 text-xs font-bold text-[#e9387c] mb-3">
            <Sparkles className="h-3.5 w-3.5" /> Official Registration Confirmed
          </div>

          <h1 className="font-display text-2xl md:text-5xl font-black text-charcoal">
            Welcome to the Race, {runnerName}!
          </h1>
          <p className="mt-2 text-xs md:text-sm text-slate-500 max-w-lg mx-auto">
            Your spot has been locked, entry fee confirmed via Razorpay, and your official gate entry pass with scannable QR is issued below.
          </p>

          {/* ========================================================================= */}
          {/* OFFICIAL ENTRY TICKET & KIT PASS (SCAN READY)                             */}
          {/* ========================================================================= */}
          <div className="mt-8 rounded-3xl border-2 border-slate-900 bg-white shadow-2xl overflow-hidden text-left relative">
            
            {/* Ticket Header Banner */}
            <div className="bg-slate-950 text-white p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b-4 border-b-[#e9387c]">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#e9387c] block">
                  OFFICIAL RUNNER PASS &amp; KIT VOUCHER
                </span>
                <span className="font-display text-2xl md:text-3xl font-black tracking-tight text-white">
                  RUN BEYOND LIMITS 2026
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sunday, September 27, 2026 · Flag-off: 5:30 AM · Assembly: 5:00 AM
                </p>
              </div>

              {/* Top BIB badge */}
              <div className="bg-gradient-to-r from-pink-600 to-[#e9387c] px-4 py-2 rounded-xl text-center self-start md:self-auto shrink-0 shadow-soft">
                <span className="text-[9px] font-black uppercase tracking-widest text-white/90 block">ALLOCATED BIB</span>
                <span className="font-display text-2xl md:text-3xl font-black text-white">{bib}</span>
              </div>
            </div>

            {/* Ticket Content Body */}
            <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6 items-center">
              
              {/* Left & Middle: Runner & Race Specifications (2 Cols) */}
              <div className="md:col-span-2 space-y-4">
                
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Runner Name</span>
                    <span className="font-bold text-base md:text-lg text-charcoal">{runnerName}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Race Category</span>
                    <span className="font-bold text-base md:text-lg text-[#e9387c]">{race.distance} KM {race.type}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">City &amp; Venue</span>
                    <span className="font-semibold text-sm text-charcoal">{city.name}</span>
                    <span className="text-xs text-slate-500 block">{city.venue}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Reporting Time</span>
                    <span className="font-semibold text-sm text-charcoal">5:00 AM IST</span>
                    <span className="text-xs text-emerald-600 font-semibold block">Flag-off: 5:30 AM</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">T-Shirt Size</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs mt-1 bg-pink-50 text-[#e9387c] border border-pink-200 px-2.5 py-1 rounded-lg">
                      <Shirt className="h-3.5 w-3.5" /> Size {data?.size || "M"} (Dry-Fit)
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Kit Distribution</span>
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs mt-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg">
                      <Package className="h-3.5 w-3.5" /> Expo Desk (Sept 25-26)
                    </span>
                  </div>
                </div>

              </div>

              {/* Right: Live Scannable QR Code Card (1 Col) */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-center flex flex-col items-center justify-center">
                {data?.qrCodeDataUrl ? (
                  <img 
                    src={data.qrCodeDataUrl} 
                    alt="Runner Entry QR" 
                    className="w-36 h-36 rounded-xl border border-slate-300 p-1 bg-white shadow-soft"
                  />
                ) : (
                  <div className="w-36 h-36 rounded-xl border border-dashed border-slate-300 grid place-items-center bg-white">
                    <QrCode className="h-16 w-16 text-slate-300" />
                  </div>
                )}
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 mt-2 block">
                  ENTRY &amp; KIT QR PASS
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight mt-0.5">
                  Scan at Bib Expo for Kit pickup &amp; race morning gate entry
                </span>
              </div>

            </div>

            {/* Ticket Sub-Footer: Instructions */}
            <div className="bg-slate-100/80 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2">
              <span>Order: <code className="font-mono font-bold text-charcoal">{orderId}</code></span>
              <span>Txn: <code className="font-mono text-charcoal">{paymentId}</code></span>
              <span className="font-semibold text-emerald-700">✓ Verified via Razorpay Standard Checkout</span>
            </div>

          </div>

          {/* Kit Collection Notice */}
          <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-left flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong>Bib &amp; T-Shirt Expo Collection:</strong> Your running T-shirt (Size: {data?.size || "M"}), RFID timing bib ({bib}), and goodie kit must be collected at the Pre-Event Expo on <strong>September 25–26, 2026 (10:00 AM – 7:00 PM)</strong>. Please carry this pass and a valid Government Photo ID. No kit distribution on race morning!
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PRIMARY ACTION BUTTONS: DOWNLOAD PDF TICKET, CALENDAR, PRINT             */}
          {/* ========================================================================= */}
          <div className="mt-8 flex flex-wrap gap-3.5 justify-center print:hidden">
            
            {/* Download Ticket PDF */}
            <a
              href={ticketPdfUrl}
              download
              className="rounded-full gradient-orange text-white px-6 py-3.5 text-xs font-bold shadow-soft hover:scale-105 transition-all inline-flex items-center justify-center gap-2"
            >
              <Download className="h-4 w-4" /> Download Official Ticket (PDF)
            </a>

            {/* Print Pass */}
            <button
              onClick={() => window.print()}
              className="rounded-full bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 text-xs font-bold shadow-soft transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Print Entry Pass
            </button>

            {/* Add to Calendar */}
            <button
              onClick={() => generateIcsCalendar(runnerName, `${race.distance} KM ${race.type}`, city.venue, EVENT.dateISO)}
              className="rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3.5 text-xs font-bold transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-[#e9387c]" /> Add to Calendar (.ICS)
            </button>

            {/* Certificate Portal Link */}
            <Link
              to="/certificates"
              className="rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-3.5 text-xs font-bold transition-all inline-flex items-center justify-center gap-2"
            >
              <Award className="h-4 w-4 text-orange" /> Certificates Portal
            </Link>

          </div>

          <p className="mt-6 text-xs text-slate-400 print:hidden">
            An official registration pass and WhatsApp message have also been sent to your registered mobile number.
          </p>

        </motion.div>
      </div>
    </div>
  );
}
