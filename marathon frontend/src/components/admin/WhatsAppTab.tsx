import { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  MessageCircle, QrCode, RefreshCw, Send, Unplug, CheckCircle2,
  XCircle, Loader2, Info, Phone,
} from "lucide-react";

interface WaStatus {
  status: "starting" | "qr_pending" | "connected" | "disconnected" | "disabled" | "error";
  qr: string | null;
  webEnabled: boolean;
  channels: { web: boolean; cloud: boolean; twilio: boolean };
}

const API = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/admin/whatsapp`;

const STATUS_META: Record<WaStatus["status"], { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  connected: { label: "Connected", cls: "bg-success/20 text-success-light border-success/30", icon: CheckCircle2 },
  qr_pending: { label: "Waiting for scan", cls: "bg-warning/20 text-warning-light border-warning/30", icon: QrCode },
  starting: { label: "Starting…", cls: "bg-muted text-muted-foreground border-border", icon: Loader2 },
  disconnected: { label: "Disconnected", cls: "bg-muted text-muted-foreground border-border", icon: XCircle },
  disabled: { label: "Disabled", cls: "bg-muted text-muted-foreground border-border", icon: XCircle },
  error: { label: "Error", cls: "bg-destructive/20 text-destructive-light border-destructive/30", icon: XCircle },
};

export function WhatsAppTab() {
  const [status, setStatus] = useState<WaStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState(
    "Hello! This is a test message from Run Beyond Limits 2026."
  );

  const token = localStorage.getItem("admin_token") || "";
  const failCountRef = useRef(0); // consecutive poll failures

  const refresh = useCallback(
    async (silent = false) => {
      try {
        const res = await fetch(`${API}/status`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) throw new Error("Failed to load WhatsApp status");
        setStatus(await res.json());
        failCountRef.current = 0;
      } catch (err) {
        failCountRef.current += 1;
        // Polling runs every 2.5s - only surface the first failure to avoid toast spam.
        if (!silent || failCountRef.current === 1) {
          toast.error(err instanceof Error ? err.message : "Failed to load status");
        }
      }
    },
    [token]
  );

  useEffect(() => {
    refresh(true);
    // Poll for status/QR changes. The backend re-starts the browser itself
    // after a failure, so a transient "error" heals without user action.
    const t = setInterval(() => refresh(true), 2500);
    return () => clearInterval(t);
  }, [refresh]);

  async function requestQR() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/qr`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Could not generate QR code");
      const data: WaStatus = await res.json();
      setStatus(data);
      if (data.qr) {
        toast.info("Scan this QR code with WhatsApp to link your number");
      } else if (data.status === "error") {
        toast.error("Could not start the WhatsApp browser - try again in a few seconds");
      } else {
        toast.info("Starting the WhatsApp browser - press Show QR code again shortly");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "QR request failed");
    } finally {
      setLoading(false);
    }
  }

  async function disconnect() {
    setLoading(true);
    try {
      const res = await fetch(`${API}/disconnect`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data: WaStatus = await res.json();
      setStatus(data);
      toast.success("WhatsApp disconnected");
    } catch (err) {
      toast.error("Disconnect failed");
    } finally {
      setLoading(false);
    }
  }

  async function sendTest() {
    if (!testPhone || !testMessage) {
      toast.error("Enter a phone number and message");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/test`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ phone: testPhone, message: testMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      if (data.mock) {
        toast.info("No provider configured — message logged to server console (mock).");
      } else {
        toast.success(`Sent via ${data.provider} to ${data.to}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Send failed");
    } finally {
      setLoading(false);
    }
  }

  const meta = status ? STATUS_META[status.status] : null;
  const StatusIcon = meta?.icon;

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Status banner */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#25D366]/15">
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-foreground">WhatsApp Automation</h2>
              <p className="text-xs text-muted-foreground">
                Link a number once — registration & payment messages send automatically.
              </p>
            </div>
          </div>

          {status && meta && StatusIcon && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={meta.cls}>
                <StatusIcon className={`mr-1.5 h-3 w-3 ${status.status === "starting" ? "animate-spin" : ""}`} />
                {meta.label}
              </Badge>
              <Button variant="outline" size="sm" className="h-8" onClick={() => refresh()} disabled={loading}>
                <RefreshCw className={`mr-1 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          )}
        </div>

        {/* Channel availability */}
        {status && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(["web", "cloud", "twilio"] as const).map((ch) => (
              <Badge
                key={ch}
                variant="outline"
                className={
                  status.channels[ch]
                    ? "bg-success/15 text-success-light border-success/30"
                    : "bg-muted text-muted-foreground"
                }
              >
                {ch === "web" ? "QR-linked number" : ch === "cloud" ? "Meta Cloud API" : "Twilio"}
                {status.channels[ch] ? " · ready" : " · not set"}
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* QR connect */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <QrCode className="h-4 w-4 text-primary" /> Link a WhatsApp number
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          1. Open WhatsApp on your phone → <strong>Settings → Linked Devices</strong>.
          <br />
          2. Tap <strong>Link a Device</strong> and scan the code below.
          <br />
          3. Once linked, this server sends messages from that number automatically.
        </p>

        <div className="mt-4 flex flex-col items-center gap-4">
          {status?.qr ? (
            <div className="rounded-2xl border-2 border-dashed border-primary/40 bg-white p-3">
              <img src={status.qr} alt="WhatsApp QR code" className="h-56 w-56" />
            </div>
          ) : (
            <div className="grid h-56 w-56 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/30">
              <div className="text-center">
                <QrCode className="mx-auto h-10 w-10 text-muted-foreground/40" />
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {status?.status === "connected"
                    ? "Already linked"
                    : status?.status === "error"
                      ? 'Could not start the browser - click "Show QR code" to retry'
                      : status?.status === "starting"
                        ? "Starting the browser…"
                        : "QR code will appear here"}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button onClick={requestQR} disabled={loading || status?.status === "connected"}>
              {status?.qr ? "Regenerate QR" : "Show QR code"}
            </Button>
            {status?.status === "connected" && (
              <Button variant="outline" onClick={disconnect} disabled={loading}>
                <Unplug className="mr-1.5 h-3.5 w-3.5" /> Disconnect
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Test message */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <Send className="h-4 w-4 text-primary" /> Send a test message
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Verifies the channel before relying on it for registration messages.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="wa-phone" className="text-xs font-bold text-muted-foreground">
              Phone number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
              <Input
                id="wa-phone"
                placeholder="9876543210"
                value={testPhone}
                onChange={(e) => setTestPhone(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="wa-msg" className="text-xs font-bold text-muted-foreground">
              Message
            </Label>
            <Input
              id="wa-msg"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendTest()}
            />
          </div>
        </div>

        <Button className="mt-4" onClick={sendTest} disabled={loading}>
          <Send className="mr-1.5 h-4 w-4" /> Send test
        </Button>
      </Card>

      {/* Automation info */}
      <Card className="p-5 border border-slate-200 dark:border-white/10 shadow-sm bg-muted/20">
        <h3 className="text-sm font-extrabold text-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" /> What sends automatically
        </h3>
        <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground leading-relaxed">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            On registration — confirmation with city, race category &amp; T-shirt size.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            On payment approval — BIB number + certificate download link.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            Reminders at 7 days, 3 days and 24 hours before race day.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
            Thank-you &amp; certificate emails after the event.
          </li>
        </ul>
        <p className="mt-3 text-[11px] text-muted-foreground/80">
          If no channel is linked, messages are logged to the server console instead of failing —
          so registration never breaks.
        </p>
      </Card>
    </div>
  );
}