import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download, Award, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/certificates")({
  head: () => ({
    meta: [
      { title: "Certificates · Run Beyond Limits 2026" },
      { name: "description", content: "Retrieve and download your participation certificate for Run Beyond Limits 2026." },
    ],
  }),
  component: CertificatesPage,
});

interface ParticipantResult {
  id: string;
  fullName: string;
  city: string;
  raceId: string;
  bibNumber: string;
}

function CertificatesPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParticipantResult | null>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    fetch(`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://marathon-website-2.onrender.com" : "http://localhost:5000")}/api/certificate/lookup?query=${encodeURIComponent(query.trim())}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "No participant found or payment is pending.");
        }
        return res.json();
      })
      .then((data) => {
        setResult(data);
        toast.success("Certificate found!");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to search.");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="gradient-page min-h-screen">
      <section className="page-header-banner text-white py-12 md:py-16 shadow-sm">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/70 font-semibold text-sm tracking-widest uppercase">Certificates</p>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-extrabold">Claim Your Certificate</h1>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-xl mx-auto">
            Enter the email address or phone number you used during registration to download your certificate.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="mx-auto max-w-md bg-white rounded-3xl p-8 shadow-elevated border border-slate-100/60">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="searchQuery" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Email or Phone Number
              </label>
              <div className="relative mt-2">
                <input
                  id="searchQuery"
                  type="text"
                  placeholder="e.g. runner@example.com"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-[#F8FAFC] pl-10 pr-4 py-3 text-sm outline-none focus:bg-white focus:border-navy/40 focus:ring-4 focus:ring-navy/10 shadow-sm transition-all duration-200"
                />
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full gradient-orange text-white px-8 py-3.5 font-bold shadow-soft hover:shadow-glow hover:scale-102 transition-all duration-300 disabled:opacity-70 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Searching...
                </>
              ) : (
                "Search Certificate"
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Award className="mx-auto h-16 w-16 text-orange animate-bounce" />
              <div>
                <h3 className="font-display text-xl font-bold text-charcoal">{result.fullName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Category: <span className="font-semibold text-charcoal">{result.raceId.toUpperCase()}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Bib Number: <span className="font-semibold text-charcoal">{result.bibNumber}</span>
                </p>
              </div>

              <a
                href={`${import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://marathon-website-2.onrender.com" : "http://localhost:5000")}/api/certificate/download/${result.id}`}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy text-white px-8 py-3.5 font-bold shadow-soft hover:scale-102 transition-all duration-300"
              >
                <Download className="h-4 w-4" /> Download Certificate
              </a>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
