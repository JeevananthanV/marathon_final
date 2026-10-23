import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import type { Participant, ContactMessage, TShirtRow, ReportRow, AdminTab } from "@/components/admin/types";
import { RACE_PRICES, API_BASE } from "@/components/admin/types";

export function useAdmin() {
  const [token, setToken] = useState<string | null>(null);
  const [tab, setTab] = useState<AdminTab>("dashboard");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [tshirtData, setTshirtData] = useState<TShirtRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [cityFilter, setCityFilter] = useState("");
  const [raceFilter, setRaceFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_token");
    if (saved) setToken(saved);
  }, []);

  const fetchData = useCallback(() => {
    if (!token) return;
    setLoading(true);

    fetch(`${API_BASE}/participants`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (res.status === 401 || res.status === 403) { handleLogout(); throw new Error("Session expired"); }
        if (!res.ok) throw new Error("Failed to load participants");
        return res.json();
      })
      .then((data) =>
        // Normalise _id to string: PostgreSQL SERIAL returns integers, but the
        // UI treats _id as a string (row keys, avatar colours, expanded-row compare).
        setParticipants(
          (Array.isArray(data) ? (data as Array<Participant & { _id: string | number }>) : []).map(
            (p) => ({ ...p, _id: String(p._id) })
          )
        )
      )
      .catch((err) => toast.error(err.message));

    fetch(`${API_BASE}/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setContacts(data || []))
      .catch(() => {});

    fetch(`${API_BASE}/reports/tshirt`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setTshirtData(data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  const handleLogin = useCallback(async (username: string, password: string) => {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("admin_token", data.token);
    setToken(data.token);
    toast.success("Logged in!");
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setParticipants([]);
    setContacts([]);
    setTshirtData([]);
    toast.success("Logged out.");
  }, []);

  const togglePaymentStatus = useCallback(async (id: string, currentStatus: "Pending" | "Paid") => {
    const newStatus = currentStatus === "Paid" ? "Pending" : "Paid";
    const txnId = newStatus === "Paid" ? `ADMIN-${Date.now()}` : "";
    const res = await fetch(`${API_BASE}/participants/${id}/payment`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paymentStatus: newStatus, paymentTxnId: txnId }),
    });
    if (!res.ok) throw new Error("Failed to update payment");
    await res.json();
    toast.success(`Payment updated to ${newStatus}`);
    fetchData();
  }, [token, fetchData]);

  const deleteParticipant = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/participants/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to delete");
    await res.json();
    toast.success("Participant deleted");
    fetchData();
  }, [token, fetchData]);

  const sendCertificateEmail = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/participants/${id}/send-certificate`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error);
    toast.success(d.message);
  }, [token]);

  const resendEntryQr = useCallback(async (id: string) => {
    const res = await fetch(`${API_BASE}/participants/${id}/resend-qr`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || "Failed to resend QR");
    toast.success(`Entry QR sent to ${d.phone}`);
  }, [token]);

  const toggleKitStatus = useCallback(async (id: string, currentStatus: string = "No") => {
    const newStatus = currentStatus === "Yes" ? "No" : "Yes";
    const res = await fetch(`${API_BASE}/participants/${id}/kit-distribution`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ kitCollected: newStatus }),
    });
    if (!res.ok) throw new Error("Failed to update kit distribution status");
    setParticipants((prev) =>
      prev.map((p) => (p._id === id ? { ...p, kitCollected: newStatus } : p))
    );
    toast.success(newStatus === "Yes" ? "Kit & T-Shirt marked as Collected!" : "Kit status set to Pending");
  }, [token]);

  const downloadTicket = useCallback((id: string, bib: string = "", name: string = "") => {
    const url = `/api/v1/marathon/ticket-pdf/${id}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ticket-${bib || id}-${name.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Downloading official ticket PDF...");
  }, []);

  const updateParticipant = useCallback(async (id: string, data: Partial<Participant>) => {
    const res = await fetch(`${API_BASE}/participants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update");
    await res.json();
    toast.success("Participant updated!");
    fetchData();
  }, [token, fetchData]);

  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const mc = cityFilter ? p.cityId === cityFilter : true;
      const mr = raceFilter ? p.raceId === raceFilter : true;
      const mp = paymentFilter ? p.paymentStatus === paymentFilter : true;
      const ms = searchQuery
        ? p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery) ||
          (p.bibNumber && p.bibNumber.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;
      return mc && mr && mp && ms;
    });
  }, [participants, cityFilter, raceFilter, paymentFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = participants.length;
    const paid = participants.filter((p) => p.paymentStatus === "Paid").length;
    const pending = total - paid;
    const revenue = participants
      .filter((p) => p.paymentStatus === "Paid")
      .reduce((acc, p) => acc + (RACE_PRICES[(p.raceId || "").toLowerCase()] || 0), 0);
    return { total, paid, pending, revenue };
  }, [participants]);

  const categoryData = useMemo(() => {
    const cats = { "5k": 0, "10k": 0, "21k": 0 };
    participants.forEach((p) => {
      const rId = (p.raceId || "").toLowerCase();
      if (cats[rId as keyof typeof cats] !== undefined) cats[rId as keyof typeof cats]++;
    });
    return Object.entries(cats).map(([name, count]) => ({ name: name.toUpperCase(), count }));
  }, [participants]);

  const dailyData = useMemo(() => {
    const map: Record<string, number> = {};
    participants.forEach((p) => {
      const d = new Date(p.registrationDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  }, [participants]);

  const cityData = useMemo(() => {
    const map: Record<string, number> = {};
    participants.forEach((p) => {
      const c = p.cityId || "unknown";
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [participants]);

  const reportData = useMemo((): ReportRow[] => {
    const races: Record<string, { registered: number; paid: number; pending: number; revenue: number }> = {
      "5k": { registered: 0, paid: 0, pending: 0, revenue: 0 },
      "10k": { registered: 0, paid: 0, pending: 0, revenue: 0 },
      "21k": { registered: 0, paid: 0, pending: 0, revenue: 0 },
    };
    participants.forEach((p) => {
      const rId = (p.raceId || "").toLowerCase();
      const r = races[rId];
      if (r) {
        r.registered++;
        if (p.paymentStatus === "Paid") {
          r.paid++;
          r.revenue += RACE_PRICES[rId] || 0;
        } else {
          r.pending++;
        }
      }
    });
    return Object.entries(races).map(([race, d]) => ({ race: race.toUpperCase(), ...d }));
  }, [participants]);

  const revenueByCity = useMemo(() => {
    const map: Record<string, number> = {};
    participants
      .filter((p) => p.paymentStatus === "Paid")
      .forEach((p) => {
        const c = p.cityId || "unknown";
        const rId = (p.raceId || "").toLowerCase();
        map[c] = (map[c] || 0) + (RACE_PRICES[rId] || 0);
      });
    return Object.entries(map).map(([name, revenue]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      revenue,
    }));
  }, [participants]);

  const revenueByRace = useMemo(() => {
    const map: Record<string, number> = {};
    participants
      .filter((p) => p.paymentStatus === "Paid")
      .forEach((p) => {
        const rId = (p.raceId || "").toLowerCase();
        map[rId] = (map[rId] || 0) + (RACE_PRICES[rId] || 0);
      });
    return Object.entries(map).map(([name, revenue]) => ({ name: name.toUpperCase(), revenue }));
  }, [participants]);

  return {
    token,
    tab,
    setTab,
    participants,
    contacts,
    tshirtData,
    loading,
    cityFilter,
    setCityFilter,
    raceFilter,
    setRaceFilter,
    paymentFilter,
    setPaymentFilter,
    searchQuery,
    setSearchQuery,
    filteredParticipants,
    stats,
    categoryData,
    dailyData,
    cityData,
    reportData,
    revenueByCity,
    revenueByRace,
    handleLogin,
    handleLogout,
    togglePaymentStatus,
    deleteParticipant,
    sendCertificateEmail,
    resendEntryQr,
    toggleKitStatus,
    downloadTicket,
    updateParticipant,
    fetchData,
  };
}
