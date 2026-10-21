import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Database, CheckCircle2, XCircle, Loader2, RefreshCw, Info,
  Upload, Plug, Users, Clock, AlertTriangle,
} from "lucide-react";
import { API_BASE } from "./types";

interface ZohoSyncJob {
  running: boolean;
  total?: number;
  done?: number;
  synced?: number;
  errors?: number;
  force?: boolean;
  startedAt?: string | null;
  finishedAt?: string | null;
  lastError?: string;
}

interface ZohoStatus {
  configured: boolean;
  missing: string[];
  accountsUrl: string;
  apiUrl: string;
  stats: { total: number; synced: number; pending: number };
  syncJob: ZohoSyncJob;
}

const API = `${API_BASE}/zoho`;

function StatBox({ icon: Icon, label, value, tone }: {
  icon: typeof Users;
  label: string;
  value: number | string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900/60">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xl font-black leading-none text-foreground">{value}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function CrmTab() {
  const [status, setStatus] = useState<ZohoStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [forceResync, setForceResync] = useState(false);
  const token = localStorage.getItem("admin_token") || "";
  const failCountRef = useRef(0);

  const refresh = useCallback(
    async (silent = false) => {
      try {
        const res = await fetch(`${API}/status`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to load Zoho CRM status");
        setStatus(await res.json());
        failCountRef.current = 0;
      } catch (err) {
        failCountRef.current += 1;
        // Polling runs continuously — only surface the first failure.
        if (!silent || failCountRef.current === 1) {
          toast.error(err instanceof Error ? err.message : "Failed to load status");
        }
      }
    },
    [token]
  );

  useEffect(() => {
    refresh(true);
    const t = setInterval(() => refresh(true), 3000);
    return () => clearInterval(t);
  }, [refresh]);

  async function testConnection() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.ok) {
        toast.success("Zoho connection OK — test lead created & removed");
      } else {
        toast.error(
          data.missing
            ? `Not configured — fill in: ${data.missing.join(", ")}`
            : `Connection failed: ${data.error || "unknown error"}`
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Test failed");
    } finally {
      setLoading(false);
    }
  }

  async function syncAll() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/sync-all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ force: forceResync }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.missing ? `Not configured — fill in: ${data.missing.join(", ")}` : data.error || "Sync failed"
        );
      }
      if (data.total === 0) {
        toast.info(forceResync ? "No registrations to sync" : "All registrations are already synced to Zoho");
      } else {
        toast.info(`Syncing ${data.total} registration${data.total === 1 ? "" : "s"} to Zoho…`);
      }
      refresh(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  }

  const job = status?.syncJob;
  const jobActive = !!job?.running;
  const jobTotal = job?.total || 0;
  const jobDone = job?.done || 0;
  const pct = jobTotal > 0 ? Math.round((jobDone / jobTotal) * 100) : jobActive ? 2 : job?.finishedAt ? 100 : 0;
  const jobFinished = !!job?.finishedAt && !jobActive;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Status banner */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Zoho CRM Integration</h2>
              <p className="text-xs text-muted-foreground">
                Every registration becomes a Lead — create, update, payment stage and delete stay in sync.
              </p>
            </div>
          </div>

          {status && (
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={
                  status.configured
                    ? "bg-success/20 text-success-light border-success/30"
                    : "bg-warning/20 text-warning-light border-warning/30"
                }
              >
                {status.configured ? (
                  <CheckCircle2 className="mr-1.5 h-3 w-3" />
                ) : (
                  <XCircle className="mr-1.5 h-3 w-3" />
                )}
                {status.configured ? "Configured" : "Not configured"}
              </Badge>
              <Button variant="outline" size="sm" className="h-8" onClick={() => refresh()} disabled={loading}>
                <RefreshCw className="mr-1 h-3.5 w-3.5" />
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Missing credentials */}
        {status && !status.configured && status.missing.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2.5">
            <AlertTriangle className="h-4 w-4 shrink-0 text-warning-light" />
            <span className="text-xs font-semibold text-warning-light">Missing in backend/.env:</span>
            {status.missing.map((v) => (
              <code key={v} className="rounded-md bg-white/70 px-1.5 py-0.5 text-[11px] font-bold text-slate-700 dark:bg-black/20 dark:text-white/80">
                {v}
              </code>
            ))}
          </div>
        )}

        {/* Stats */}
        {status && (
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <StatBox icon={Users} label="Registrations" value={status.stats.total} tone="bg-primary/10 text-primary" />
            <StatBox icon={CheckCircle2} label="Synced to Zoho" value={status.stats.synced} tone="bg-success/15 text-success-light" />
            <StatBox icon={Clock} label="Pending sync" value={status.stats.pending} tone="bg-warning/15 text-warning-light" />
          </div>
        )}
      </Card>

      {/* Sync actions + progress */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" /> Sync registration data
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Pushes every registration (name, phone, email, city, race category, T-shirt size, payment status)
          into Zoho CRM as a Lead. Runs in the background — progress appears below.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={syncAll} disabled={loading || jobActive || !status?.configured}>
            {jobActive ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Upload className="mr-1.5 h-4 w-4" />}
            {jobActive ? "Syncing…" : "Sync all registrations"}
          </Button>
          <Button variant="outline" onClick={testConnection} disabled={loading || jobActive}>
            <Plug className="mr-1.5 h-4 w-4" /> Test connection
          </Button>
          <label className="flex cursor-pointer select-none items-center gap-2 text-xs font-semibold text-muted-foreground">
            <input
              type="checkbox"
              checked={forceResync}
              onChange={(e) => setForceResync(e.target.checked)}
              className="h-3.5 w-3.5 accent-primary"
            />
            Also re-update already synced leads
          </label>
        </div>

        {/* Progress bar while a job runs (and its result afterwards) */}
        {jobTotal > 0 && (jobActive || jobFinished) && (
          <div className="mt-4 rounded-xl border border-slate-200 bg-muted/30 p-3.5 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between text-xs font-bold text-foreground">
              <span className="flex items-center gap-1.5">
                {jobActive && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                {jobActive ? `Syncing ${jobDone}/${jobTotal}…` : `Synced ${job?.synced ?? 0}/${jobTotal}`}
              </span>
              <span className="text-muted-foreground">{pct}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted dark:bg-white/10">
              <div
                className={`h-full rounded-full transition-all duration-500 ${jobFinished && (job?.errors || 0) > 0 ? "bg-warning" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-muted-foreground">
              <span className="text-success-light">✓ {job?.synced ?? 0} synced</span>
              <span className={(job?.errors || 0) > 0 ? "text-destructive-light" : ""}>
                ✕ {job?.errors ?? 0} failed
              </span>
              {jobFinished && (
                <span>
                  {jobActive ? "" : "Finished"} ·{" "}
                  {job?.finishedAt ? new Date(job.finishedAt).toLocaleTimeString() : ""}
                </span>
              )}
            </div>
            {jobFinished && !!job?.lastError && (
              <p className="mt-2 break-words rounded-lg bg-destructive/10 px-2.5 py-1.5 text-[11px] text-destructive-light">
                Last error: {job.lastError}
              </p>
            )}
          </div>
        )}
      </Card>

      {/* Setup guide — only while unconfigured */}
      {status && !status.configured && (
        <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm bg-muted/20">
          <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" /> One-time Zoho setup (≈5 minutes)
          </h3>
          <ol className="mt-3 space-y-2.5 text-xs leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-black text-white">1</span>
              <span>
                Create a <strong>Self-Client</strong> app at{" "}
                <a href="https://api-console.zoho.in" target="_blank" rel="noreferrer" className="font-bold text-primary hover:underline">
                  api-console.zoho.in
                </a>{" "}
                and copy the <strong>Client ID</strong> / <strong>Client Secret</strong> into{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">backend/.env</code>.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-black text-white">2</span>
              <span>
                In the app open <strong>Generate Code</strong>, pick scopes{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">ZohoCRM.modules.CREATE</code>,{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">READ</code>,{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">UPDATE</code>,{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">DELETE</code> and copy the code.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-black text-white">3</span>
              <span>
                Run in the <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">backend/</code> folder:{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">npm run zoho-auth -- &lt;CODE&gt;</code>{" "}
                — it writes the refresh token into <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">.env</code> automatically.
              </span>
            </li>
            <li className="flex gap-2.5">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-[10px] font-black text-white">4</span>
              <span>
                Verify with{" "}
                <code className="rounded bg-white px-1 py-0.5 font-bold dark:bg-black/30">npm run zoho-auth -- --check</code>,
                restart the server, then come back here and press <strong>Test connection</strong>.
              </span>
            </li>
          </ol>
          <p className="mt-3 text-[11px] text-muted-foreground/80">
            Until it is configured the website keeps running normally — Zoho sync is simply skipped (never an error).
          </p>
        </Card>
      )}

      {/* Automation info */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm bg-muted/20">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> What syncs automatically
        </h3>
        <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            On registration — a new Lead with contact details, race category, T-shirt size and payment status.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            On admin edit — the existing Lead is updated in place.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            On payment approval — Lead status moves to <strong>Converted</strong>.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            On participant deletion — the Lead is removed from Zoho.
          </li>
        </ul>
      </Card>
    </div>
  );
}
