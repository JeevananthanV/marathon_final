import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { AlertTriangle, RefreshCw, ArrowLeft, MessageSquare, ShieldAlert, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { EVENT } from "@/data/marathon";

export const Route = createFileRoute("/status/failure")({
  head: () => ({
    meta: [
      { title: "Payment Incomplete · Run Beyond Limits 2026" },
      { name: "description", content: "Your payment was not completed or was dropped. You can easily retry your checkout." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    id: (search.id as string) || "",
    reason: (search.reason as string) || "",
  }),
  component: PaymentFailurePage,
});

function PaymentFailurePage() {
  const search = useSearch({ from: "/status/failure" });
  const reason = search.reason || "Payment was cancelled or interrupted during the gateway checkout.";
  const orderId = search.id || "";

  return (
    <div className="gradient-page min-h-screen py-16 md:py-24 text-charcoal">
      <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white border border-slate-200 p-8 md:p-10 shadow-elevated text-center"
        >
          {/* Warning Icon */}
          <div className="mx-auto h-20 w-20 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-soft mb-6">
            <AlertTriangle className="h-10 w-10 text-rose-500" />
          </div>

          <span className="inline-block rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 mb-2">
            Payment Not Completed
          </span>

          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-charcoal">
            Transaction Interrupted
          </h1>

          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            We were unable to secure your registration payment. Your runner profile details are still temporarily saved.
          </p>

          {/* Reason Box */}
          <div className="mt-6 rounded-2xl bg-rose-50/60 border border-rose-100 p-4 text-left">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-rose-900 block mb-0.5">Gateway Feedback</span>
                <span className="text-rose-700">{reason}</span>
                {orderId && (
                  <span className="block mt-2 font-mono text-[10px] text-slate-500">
                    Tracking Ref: {orderId}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Direct Retry and Action Buttons */}
          <div className="mt-8 space-y-3">
            <Link
              to="/checkout-summary"
              className="w-full rounded-full bg-[#e9387c] hover:bg-[#d82a6e] text-white py-3.5 px-6 text-sm font-bold shadow-soft transition-all inline-flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" /> Retry Checkout Flow
            </Link>

            <Link
              to="/register"
              className="w-full rounded-full bg-slate-100 hover:bg-slate-200 text-charcoal py-3 px-6 text-xs font-bold transition-all inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Edit Registration Details
            </Link>

            <a
              href={`https://wa.me/911234567890?text=${encodeURIComponent(
                `Hi, my payment for Run Beyond Limits 2026 was dropped. Order ID: ${orderId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 px-6 text-xs font-bold transition-all inline-flex items-center justify-center gap-2"
            >
              <MessageSquare className="h-4 w-4 text-emerald-600" /> WhatsApp Support Desk
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-[11px] text-slate-400">
            Did money get deducted from your account? Please don't worry. Unsettled amounts are automatically reversed by your bank within 3–5 working days, or email us at <span className="text-slate-600 font-semibold">{EVENT.supportEmail}</span>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
