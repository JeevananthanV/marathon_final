import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Download, Filter, Search, Eye, EyeOff, Edit3, Check, X, Send, Trash2,
  ChevronLeft, ChevronRight, MoreVertical,
} from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Participant } from "./types";
import { PremiumAvatar, TrendBadge } from "./PremiumUI";


interface ParticipantsTabProps {
  participants: Participant[];
  filteredParticipants: Participant[];
  cityFilter: string;
  setCityFilter: (v: string) => void;
  raceFilter: string;
  setRaceFilter: (v: string) => void;
  paymentFilter: string;
  setPaymentFilter: (v: string) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  onEdit: (p: Participant) => void;
  onDelete: (id: string) => void;
  onTogglePayment: (id: string, status: "Paid" | "Pending") => void;
  onSendCertificate: (id: string) => void;
}

const ROWS_PER_PAGE = 12;

export function ParticipantsTab({
  filteredParticipants,
  cityFilter,
  setCityFilter,
  raceFilter,
  setRaceFilter,
  paymentFilter,
  setPaymentFilter,
  searchQuery,
  setSearchQuery,
  onEdit,
  onDelete,
  onTogglePayment,
  onSendCertificate,
}: ParticipantsTabProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const sortedParticipants = [...filteredParticipants].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = (a as any)[key] || "";
    const bValue = (b as any)[key] || "";
    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedParticipants.length / ROWS_PER_PAGE);
  const paginatedParticipants = sortedParticipants.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  function exportCSV() {
    const headers = ["Full Name", "DOB", "Gender", "Phone", "Email", "City", "Race", "T-Shirt", "Payment", "BIB", "Date"];
    const rows = filteredParticipants.map((p) => [
      p.fullName, p.dob, p.gender, p.phone, p.email, p.city,
      p.raceId.toUpperCase(), p.size, p.paymentStatus, p.bibNumber || "N/A",
      new Date(p.registrationDate).toLocaleDateString(),
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, `participants_${Date.now()}.csv`);
    toast.success("CSV downloaded!");
  }

  function exportExcel() {
    const headers = ["Full Name", "DOB", "Gender", "Phone", "Email", "Address", "City", "State", "Pincode", "Race", "T-Shirt", "Payment", "BIB", "Emergency Contact", "Date"];
    const rows = filteredParticipants.map((p) => [
      p.fullName, p.dob, p.gender, p.phone, p.email, p.address, p.city, p.state, p.pincode,
      p.raceId.toUpperCase(), p.size, p.paymentStatus, p.bibNumber || "N/A", p.emergencyContact,
      new Date(p.registrationDate).toLocaleDateString(),
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Participants");
    XLSX.writeFile(wb, `participants_${Date.now()}.xlsx`);
    toast.success("Excel downloaded!");
  }

  function handleSort(key: string) {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Premium Filter Bar */}
      <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <div className="p-4 sm:p-5 border-b border-border bg-muted dark:bg-[#111827]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                <Filter className="h-3.5 w-3.5" /> Filters
              </span>
              <Select value={cityFilter || "__all__"} onValueChange={(v) => setCityFilter(v === "__all__" ? "" : v)}>
                <SelectTrigger
                  className="h-8 w-[100px] md:w-[130px] text-xs md:text-sm rounded-xl border border-border text-foreground shadow-sm"
                  style={{ background: "var(--color-card)" }}
                >
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent
                  className="border shadow-xl rounded-xl z-[9999]"
                  style={{ backgroundColor: "var(--popover)", color: "var(--popover-foreground)", borderColor: "var(--border)" }}
                >
                  <SelectItem value="__all__">All Cities</SelectItem>
                  <SelectItem value="salem">Salem</SelectItem>
                  <SelectItem value="bengaluru">Bengaluru</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                </SelectContent>
              </Select>
              <Select value={raceFilter || "__all__"} onValueChange={(v) => setRaceFilter(v === "__all__" ? "" : v)}>
                <SelectTrigger
                  className="h-8 w-[90px] md:w-[120px] text-xs md:text-sm rounded-xl border border-border text-foreground shadow-sm"
                  style={{ background: "var(--color-card)" }}
                >
                  <SelectValue placeholder="All Races" />
                </SelectTrigger>
                <SelectContent
                  className="border shadow-xl rounded-xl z-[9999]"
                  style={{ backgroundColor: "var(--popover)", color: "var(--popover-foreground)", borderColor: "var(--border)" }}
                >
                  <SelectItem value="__all__">All Races</SelectItem>
                  <SelectItem value="5k">5K</SelectItem>
                  <SelectItem value="10k">10K</SelectItem>
                  <SelectItem value="21k">21K</SelectItem>
                </SelectContent>
              </Select>
              <Select value={paymentFilter || "__all__"} onValueChange={(v) => setPaymentFilter(v === "__all__" ? "" : v)}>
                <SelectTrigger
                  className="h-8 w-[100px] md:w-[130px] text-xs md:text-sm rounded-xl border border-border text-foreground shadow-sm"
                  style={{ background: "var(--color-card)" }}
                >
                  <SelectValue placeholder="All Payments" />
                </SelectTrigger>
                <SelectContent
                  className="border shadow-xl rounded-xl z-[9999]"
                  style={{ backgroundColor: "var(--popover)", color: "var(--popover-foreground)", borderColor: "var(--border)" }}
                >
                  <SelectItem value="__all__">All Payments</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
              <Input
                  placeholder="Search name, email, phone, BIB..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                  className="h-9 pl-9 text-sm rounded-xl border border-border text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 shadow-sm"
                  style={{ background: "var(--color-card)" }}
                />
              </div>
              <Button size="sm" variant="outline" className="h-8 md:h-9 rounded-xl text-xs md:text-sm font-semibold text-success border-success/30 hover:bg-success/10" onClick={exportCSV}>
                <Download className="h-3.5 w-3.5 mr-1" /> CSV
              </Button>
              <Button size="sm" className="h-8 md:h-9 rounded-xl text-xs md:text-sm font-semibold" onClick={exportExcel}>
                <Download className="h-3.5 w-3.5 mr-1" /> Excel
              </Button>
            </div>
          </div>
        </div>

        {/* Premium Table - Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b-white/10">
                <TableHead className="w-12"></TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1.5">
                    Participant
                    {sortConfig?.key === "name" && (
                      <span className="text-primary">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort("email")}>Contact</TableHead>
                <TableHead>Category / City</TableHead>
                <TableHead className="text-center">T-Shirt</TableHead>
                <TableHead>BIB</TableHead>
                <TableHead className="text-center">Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParticipants.map((p) => (
                <tr
                  key={p._id}
                  className="group border-b border-border/30 dark:border-white/5"
                >
                  <TableCell className="pl-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-lg"
                      onClick={() => setExpandedRow(expandedRow === p._id ? null : p._id)}
                    >
                      {expandedRow === p._id
                        ? <EyeOff className="h-4 w-4 text-muted-foreground dark:text-white/50" />
                        : <Eye className="h-4 w-4 text-muted-foreground dark:text-white/50" />
                      }
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <PremiumAvatar name={p.fullName} size="md" colorIndex={String(p._id).charCodeAt(0)} />
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-foreground leading-snug truncate max-w-[200px]">
                          {p.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(p.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-foreground/80 truncate max-w-[180px]">{p.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.phone}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-bold text-[11px] px-2 py-0.5 rounded-lg border",
                          p.raceId === "21k" && "bg-purple-500/20 text-purple-400 border-purple-500/30",
                          p.raceId === "10k" && "bg-orange-500/20 text-orange-400 border-orange-500/30",
                          p.raceId === "5k" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                        )}
                      >
                        {p.raceId.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground capitalize mt-1">{p.cityId}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground">
                      {p.size}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm font-bold text-foreground tracking-wide">
                      {p.bibNumber || "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full border",
                        p.paymentStatus === "Paid"
                          ? "bg-success/20 text-success-light border-success/30"
                          : "bg-warning/20 text-warning-light border-warning/30"
                      )}
                    >
                      <span className={cn(
                        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                        p.paymentStatus === "Paid" ? "bg-success-light" : "bg-warning-light"
                      )} />
                      {p.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-primary hover:bg-primary/10" onClick={() => onEdit(p)}>
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "h-8 w-8 p-0 rounded-lg",
                          p.paymentStatus === "Paid"
                            ? "text-muted-foreground/50 hover:bg-muted/10"
                            : "text-success hover:bg-success/10"
                        )}
                        onClick={() => onTogglePayment(p._id, p.paymentStatus)}
                        title={p.paymentStatus === "Paid" ? "Mark Pending" : "Mark Paid"}
                      >
                        {p.paymentStatus === "Paid" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      {p.paymentStatus === "Paid" && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-accent hover:bg-accent/10" onClick={() => onSendCertificate(p._id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-destructive hover:bg-destructive/10" onClick={() => onDelete(p._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </tr>
              ))}
              {paginatedParticipants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-2xl bg-muted grid place-items-center">
                        <Search className="h-7 w-7 text-muted-foreground/40" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">No participants found</p>
                        <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search query</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Premium Card List - Mobile View */}
        <div className="block md:hidden divide-y divide-border/30 dark:divide-white/5">
          {paginatedParticipants.map((p, idx) => (
            <div key={p._id} className="p-4 space-y-3.5 hover:bg-muted/10 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <PremiumAvatar name={p.fullName} size="md" colorIndex={String(p._id).charCodeAt(0)} />
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground text-sm leading-snug truncate">{p.fullName}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {new Date(p.registrationDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "font-bold text-[10px] px-2 py-0.5 rounded-lg border shrink-0",
                    p.raceId === "21k" && "bg-purple-500/20 text-purple-400 border-purple-500/30",
                    p.raceId === "10k" && "bg-orange-500/20 text-orange-400 border-orange-500/30",
                    p.raceId === "5k" && "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
                  )}
                >
                  {p.raceId.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs bg-muted/30 dark:bg-white/5 rounded-xl p-3">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">City</span>
                  <p className="font-semibold text-foreground capitalize mt-0.5">{p.cityId}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">T-Shirt</span>
                  <p className="font-semibold text-foreground mt-0.5">{p.size}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">BIB</span>
                  <p className="font-mono font-bold text-foreground mt-0.5">{p.bibNumber || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">Payment</span>
                  <div className="mt-0.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        p.paymentStatus === "Paid"
                          ? "bg-success/20 text-success-light border-success/30"
                          : "bg-warning/20 text-warning-light border-warning/30"
                      )}
                    >
                      {p.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-1 px-1">
                <p className="text-foreground/80 truncate"><span className="text-muted-foreground font-medium">Email: </span>{p.email}</p>
                <p className="text-foreground/80"><span className="text-muted-foreground font-medium">Phone: </span>{p.phone}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/20 dark:border-white/5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground/50">Actions</span>
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" className="h-8 px-2.5 rounded-lg text-xs font-semibold text-primary" onClick={() => onEdit(p)}>
                    <Edit3 className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 px-2.5 rounded-lg text-xs font-semibold",
                      p.paymentStatus === "Paid"
                        ? "text-muted-foreground hover:bg-muted/10 border-border"
                        : "text-success border-success/30 hover:bg-success/10"
                    )}
                    onClick={() => onTogglePayment(p._id, p.paymentStatus)}
                  >
                    {p.paymentStatus === "Paid" ? <X className="h-3.5 w-3.5 mr-1 text-destructive" /> : <Check className="h-3.5 w-3.5 mr-1" />}
                    {p.paymentStatus === "Paid" ? "Unpay" : "Pay"}
                  </Button>
                  {p.paymentStatus === "Paid" && (
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg text-accent border-accent/20 hover:bg-accent/10" onClick={() => onSendCertificate(p._id)} title="Send Certificate">
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg text-destructive border-destructive/20 hover:bg-destructive/10" onClick={() => onDelete(p._id)} title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {paginatedParticipants.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm font-semibold text-foreground">No participants found</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>

        {/* Premium Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-border/40 bg-muted/20">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{page * ROWS_PER_PAGE + 1}</span>
              {" "}to{" "}
              <span className="font-semibold text-foreground">{Math.min((page + 1) * ROWS_PER_PAGE, filteredParticipants.length)}</span>
              {" "}of{" "}
              <span className="font-semibold text-foreground">{filteredParticipants.length}</span> participants
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 7) pageNum = i;
                else if (page < 3) pageNum = i;
                else if (page > totalPages - 4) pageNum = totalPages - 7 + i;
                else pageNum = page - 3 + i;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    className={cn("h-8 w-8 p-0 rounded-lg text-sm font-semibold", page === pageNum && "shadow-md")}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg"
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}