import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { 
  ShieldCheck, Lock, CreditCard, ArrowLeft, ArrowRight, Loader2, 
  MapPin, Calendar, Clock, AlertCircle, CheckCircle2, User, Shirt, Phone 
} from "lucide-react";
import { toast } from "sonner";
import { RACES, CITIES, EVENT } from "@/data/marathon";

export const Route = createFileRoute("/checkout-summary")({
  head: () => ({
    meta: [
      { title: "Checkout & Order Summary · Run Beyond Limits 2026" },
      { name: "description", content: "Review your registration details and complete secure checkout via Razorpay Standard Checkout." },
    ],
  }),
  component: CheckoutSummaryPage,
});

function loadRazorpayCheckoutScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    const w = window as unknown as { Razorpay?: unknown };
    if (w.Razorpay) return resolve();

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay checkout script. Please check your internet connection."));
    document.body.appendChild(script);
  });
}

function CheckoutSummaryPage() {
  const navigate = useNavigate();
  const [data, setData] = useState<Record<string, string> | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("marathon_registration_pending");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        // Fallback default sample for direct preview
        setData({
          runnerName: "John Doe",
          runnerEmail: "runner@example.com",
          runnerPhone: "+91 98765 43210",
          dob: "1996-08-15",
          gender: "Male",
          tshirtSize: "L",
          categoryId: "10k",
          cityId: "chennai",
          address: "124 Marina Coast Highway",
          city: "Chennai",
          state: "Tamil Nadu",
          pincode: "600001",
          emergencyContact: "+91 98765 43211",
          emergencyContactName: "Jane Doe (Spouse)",
          medicalDeclaration: "None / Fit to run",
        });
      }
    } catch (_) {}
  }, []);

  const race = useMemo(() => {
    const catId = data?.categoryId || data?.raceId || "10k";
    return RACES.find((r) => r.id === catId) || RACES[1];
  }, [data]);

  const city = useMemo(() => {
    const cId = data?.cityId || "chennai";
    return CITIES.find((c) => c.id === cId) || CITIES[0];
  }, [data]);

  const basePrice = Number(race.fee) || 799;
  const platformFee = 0; // Transparent zero fee
  const totalAmount = basePrice + platformFee;

  // ------------------------------------------------------------------
  // Core JavaScript Orchestration Client
  // ------------------------------------------------------------------
  async function initiateMarathonPayment() {
    if (!data) return;
    setLoadingOrder(true);
    setStatusMessage("Initializing secure order with Razorpay...");

    try {
      // Step A: Send runner profile details to backend server
      const orderResponse = await fetch("/api/v1/marathon/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          categoryId: race.id,
          cityId: city.id,
          amountPaise: totalAmount * 100,
        }),
      });

      const serverOrder = await orderResponse.json();
      if (!orderResponse.ok || !serverOrder.success) {
        throw new Error(serverOrder.error || serverOrder.message || "Order initialization failed.");
      }

      if (serverOrder.alreadyPaid) {
        toast.success("This registration is already paid and confirmed!");
        navigate({ to: "/status/success", search: { id: serverOrder.orderId || serverOrder.bibNumber } as never });
        return;
      }

      // Step B: Dynamically load Razorpay Checkout script
      setStatusMessage("Loading Razorpay checkout overlay...");
      await loadRazorpayCheckoutScript();

      // Step C: Set up Razorpay configuration overlay parameters
      const paymentOptions = {
        key: serverOrder.keyId || "your_razorpay_test_key_id",
        amount: serverOrder.amount, // Subunit calculated denomination (paise)
        currency: serverOrder.currency || "INR",
        name: "Run Beyond Limits 2026",
        description: `Registration fee for ${race.distance} KM ${race.type}`,
        image: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e5ecaf9f-b5d0-45c0-9e3c-1fbdec4ad95c/id-preview-cd4fab79--f4afad68-ee54-4656-81c8-41650b828d4e.lovable.app-1784613300369.png",
        order_id: serverOrder.order_id || serverOrder.id,
        handler: async function (paymentResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          // This block handles interactive user payment approval
          setVerifyingPayment(true);
          setStatusMessage("Cryptographically authenticating payment, please do not close browser...");
          await verifyPaymentOnServer(paymentResponse, serverOrder.participantId);
        },
        prefill: {
          name: data.runnerName || data.fullName,
          email: data.runnerEmail || data.email,
          contact: data.runnerPhone || data.phone,
        },
        theme: {
          color: "#e9387c",
        },
        modal: {
          ondismiss: function () {
            setLoadingOrder(false);
            setVerifyingPayment(false);
            setStatusMessage("");
            toast.info("Checkout dismissed. You can retry payment anytime.");
            navigate({
              to: "/status/failure",
              search: {
                id: serverOrder.order_id || serverOrder.id,
                reason: "User cancelled the payment modal before completion.",
              } as never,
            });
          },
        },
      };

      const w = window as unknown as {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
      };
      const rzpWindowInstance = new w.Razorpay(paymentOptions);
      rzpWindowInstance.open();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment initialization error";
      toast.error(msg);
      navigate({
        to: "/status/failure",
        search: { reason: msg } as never,
      });
    } finally {
      setLoadingOrder(false);
    }
  }

  async function verifyPaymentOnServer(
    paymentResponse: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    },
    participantId?: number
  ) {
    try {
      const checkResponse = await fetch("/api/v1/marathon/verify-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          participantId,
        }),
      });

      const verifyData = await checkResponse.json();
      if (checkResponse.ok && verifyData.success) {
        toast.success("Payment verified! Your registration and bib are confirmed.");
        sessionStorage.removeItem("marathon_registration_pending");
        navigate({
          to: "/status/success",
          search: { id: paymentResponse.razorpay_order_id || String(participantId) } as never,
        });
      } else {
        throw new Error(verifyData.error || "Cryptographic HMAC verification failed.");
      }
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Verification dropped";
      toast.error(msg);
      navigate({
        to: "/status/failure",
        search: {
          id: paymentResponse.razorpay_order_id,
          reason: msg,
        } as never,
      });
    } finally {
      setVerifyingPayment(false);
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#e9387c]" />
      </div>
    );
  }

  return (
    <div className="gradient-page min-h-screen py-10 md:py-16 text-charcoal">
      {/* Fullscreen Loader Overlay */}
      {(loadingOrder || verifyingPayment) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white px-4">
          <div className="rounded-3xl bg-white p-8 max-w-sm w-full text-center text-charcoal shadow-2xl space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-[#e9387c] mx-auto" />
            <h3 className="font-extrabold text-xl">Processing Transaction</h3>
            <p className="text-sm text-slate-500">{statusMessage || "Please do not refresh or close this window..."}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-charcoal transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Registration Form
          </Link>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Lock className="h-3 w-3" /> SSL 256-Bit Encrypted
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e9387c]">Step 2 of 2 · Checkout</span>
          <h1 className="mt-1 font-display text-3xl md:text-4xl font-extrabold text-charcoal">
            Order Review & Payment Gateway
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Review your entry parameters below. Clicking proceed opens the official Razorpay Standard Checkout overlay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Review Card (Blocks form alterations) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Race Ticket Card */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <div className="flex items-start justify-between pb-6 border-b border-slate-100">
                <div>
                  <span className="inline-block rounded-md bg-pink-100 text-[#e9387c] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider mb-1.5">
                    Selected Race
                  </span>
                  <h2 className="text-xl font-black text-charcoal">{race.distance} KM {race.type}</h2>
                  <p className="text-xs text-slate-500 font-semibold">{race.subtype}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-semibold">Entry Ticket</span>
                  <span className="font-display text-2xl font-black text-[#e9387c]">₹{race.fee}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Event Date</span>
                  <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                    <Calendar className="h-3 w-3 text-[#e9387c]" /> {EVENT.date}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">City & Venue</span>
                  <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3 text-[#e9387c]" /> {city.name}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Flag-off Time</span>
                  <span className="font-bold text-charcoal flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-[#e9387c]" /> {city.flagOff}
                  </span>
                </div>
              </div>
            </div>

            {/* Runner Parameters Review */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-black uppercase tracking-wider text-charcoal mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-[#e9387c]" /> Runner Parameters (Locked)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Participant Name</span>
                  <span className="font-bold text-charcoal text-sm">{data.runnerName || data.fullName}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Email Address</span>
                  <span className="font-bold text-charcoal text-sm truncate block">{data.runnerEmail || data.email}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Phone Number</span>
                  <span className="font-bold text-charcoal text-sm">{data.runnerPhone || data.phone}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">T-Shirt Size</span>
                  <span className="font-bold text-charcoal text-sm flex items-center gap-1">
                    <Shirt className="h-3.5 w-3.5 text-[#e9387c]" /> Size {data.tshirtSize || data.size || "M"}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Emergency Profile</span>
                  <span className="font-bold text-charcoal text-sm">{data.emergencyContactName || "Nominated Contact"} ({data.emergencyContact})</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block font-medium">Medical Disclosure</span>
                  <span className="font-bold text-charcoal text-sm">{data.medicalDeclaration || "Health cleared / No contraindications"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing & Checkout Summary Sidebar */}
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border-2 border-slate-200 p-6 shadow-soft space-y-6">
              <h3 className="font-extrabold text-base text-charcoal pb-3 border-b border-slate-100">
                Payment Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Race Entry Fee ({race.distance} KM)</span>
                  <span className="font-bold text-charcoal">₹{basePrice}.00</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>RFID Timing Chip & Bib</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Finisher Medal & Technical Tee</span>
                  <span className="font-semibold text-emerald-600">Included</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Gateway Platform Charges</span>
                  <span className="font-bold text-emerald-600">₹0.00 (Waived)</span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-black text-sm text-charcoal">Total Amount</span>
                  <span className="font-display text-3xl font-black text-[#e9387c]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="btn-initiate-razorpay"
                onClick={initiateMarathonPayment}
                disabled={loadingOrder || verifyingPayment}
                className="w-full rounded-2xl bg-[#e9387c] hover:bg-[#d82a6e] active:scale-[0.99] disabled:opacity-60 text-white py-4 px-6 text-sm font-extrabold shadow-elevated transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loadingOrder ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Preparing Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" /> Pay with Razorpay <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Operational Security Trust Badges */}
              <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-2 text-slate-600">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Razorpay Standard Checkout Overlay</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Instant Bib allocation upon cryptographic HMAC verification</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Automated WhatsApp & Email confirmation</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500">
              <span className="font-bold text-slate-700 block mb-1">Need help with checkout?</span>
              Reach our organizers at <a href={`mailto:${EVENT.supportEmail}`} className="text-[#e9387c] underline">{EVENT.supportEmail}</a> or WhatsApp our support desk.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
