import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Download, Search, Send, Check, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import type { Participant } from "./types";
import { API_BASE } from "./types";

interface ResultsTabProps {
  participants: Participant[];
  onUpdateParticipant: (id: string, data: Partial<Participant>) => Promise<void>;
  onSendCertificate: (id: string) => Promise<void>;
}

const ROWS_PER_PAGE = 10;

export function ResultsTab({ participants, onUpdateParticipant, onSendCertificate }: ResultsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [raceFilter, setRaceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [page, setPage] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  // Local state for inline edits
  const [editTimes, setEditTimes] = useState<Record<string, string>>({});
  const [editStatuses, setEditStatuses] = useState<Record<string, "Pending" | "Finished" | "DNF" | "DNS">>({});

  // Filter participants (we generally manage results for Paid participants, but show all)
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => {
      const matchesSearch = searchQuery
        ? p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery) ||
          (p.bibNumber && p.bibNumber.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      const matchesCity = cityFilter === "all" ? true : p.cityId === cityFilter;
      const matchesRace = raceFilter === "all" ? true : p.raceId === raceFilter;
      
      const currentStatus = editStatuses[p._id] || p.raceStatus || "Pending";
      const matchesStatus = statusFilter === "all" ? true : currentStatus === statusFilter;

      return matchesSearch && matchesCity && matchesRace && matchesStatus;
    });
  }, [participants, searchQuery, cityFilter, raceFilter, statusFilter, editStatuses]);

  // Pagination
  const totalPages = Math.ceil(filteredParticipants.length / ROWS_PER_PAGE);
  const paginatedParticipants = filteredParticipants.slice(
    page * ROWS_PER_PAGE,
    (page + 1) * ROWS_PER_PAGE
  );

  const handleStatusChange = (id: string, value: "Pending" | "Finished" | "DNF" | "DNS") => {
    setEditStatuses((prev) => ({ ...prev, [id]: value }));
  };

  const handleTimeChange = (id: string, value: string) => {
    setEditTimes((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async (p: Participant) => {
    const status = editStatuses[p._id] || p.raceStatus || "Pending";
    const time = editTimes[p._id] !== undefined ? editTimes[p._id] : (p.finishTime || "");

    if (status === "Finished" && !time.trim()) {
      toast.error("Please enter a finish time for completed runners (e.g., 01:45:30)");
      return;
    }

    setSavingId(p._id);
    try {
      await onUpdateParticipant(p._id, {
        raceStatus: status,
        finishTime: time,
      });
      toast.success(`Saved results for ${p.fullName}`);
    } catch (err) {
      toast.error("Failed to save participant results");
    } finally {
      setSavingId(null);
    }
  };

  const handleSendEmail = async (id: string) => {
    setSendingId(id);
    try {
      await onSendCertificate(id);
    } catch (err: any) {
      toast.error(err.message || "Failed to send certificate email");
    } finally {
      setSendingId(null);
    }
  };

  const getDownloadUrl = (id: string) => {
    return `${API_BASE.replace("/api/admin", "/api/certificate/download")}/${id}`;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <Card className="p-4 md:p-6 border-border/40 dark:border-white/10 bg-card/45 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, BIB, email..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="pl-10 h-11 rounded-xl bg-muted/40 border-border/50 dark:bg-slate-900/50"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* City Filter */}
            <Select value={cityFilter} onValueChange={(val) => { setCityFilter(val); setPage(0); }}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/40 border-border/50 dark:bg-slate-900/50">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="bengaluru">Bengaluru</SelectItem>
                <SelectItem value="salem">Salem</SelectItem>
              </SelectContent>
            </Select>

            {/* Race Filter */}
            <Select value={raceFilter} onValueChange={(val) => { setRaceFilter(val); setPage(0); }}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/40 border-border/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Race" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Races</SelectItem>
                <SelectItem value="5k">5K Run</SelectItem>
                <SelectItem value="10k">10K Run</SelectItem>
                <SelectItem value="21k">21K Run</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={(val) => { setStatusFilter(val); setPage(0); }}>
              <SelectTrigger className="w-[140px] h-11 rounded-xl bg-muted/40 border-border/50 dark:bg-slate-900/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Finished">Finished</SelectItem>
                <SelectItem value="DNF">DNF</SelectItem>
                <SelectItem value="DNS">DNS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border/40 dark:border-white/10 overflow-hidden bg-card/65">
          <Table>
            <TableHeader className="bg-muted/40 dark:bg-white/5">
              <TableRow>
                <TableHead className="font-semibold">Participant</TableHead>
                <TableHead className="font-semibold">Race Category</TableHead>
                <TableHead className="font-semibold">BIB Number</TableHead>
                <TableHead className="font-semibold w-[160px]">Status</TableHead>
                <TableHead className="font-semibold w-[180px]">Finish Time</TableHead>
                <TableHead className="text-right font-semibold pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedParticipants.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No participants matching filters found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedParticipants.map((p) => {
                  const currentStatus = editStatuses[p._id] || p.raceStatus || "Pending";
                  const currentTime = editTimes[p._id] !== undefined ? editTimes[p._id] : (p.finishTime || "");
                  const isPaid = p.paymentStatus === "Paid";
                  const canCert = isPaid && currentStatus === "Finished";

                  return (
                    <TableRow key={p._id} className="hover:bg-muted/20 dark:hover:bg-white/5 transition-colors">
                      <TableCell>
                        <div>
                          <p className="font-bold text-foreground">{p.fullName}</p>
                          <p className="text-xs text-muted-foreground">{p.email} | {p.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{p.cityId}</span> · <span className="font-semibold text-primary">{p.raceId.toUpperCase()}</span>
                      </TableCell>
                      <TableCell>
                        {p.bibNumber ? (
                          <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary bg-primary/5">
                            {p.bibNumber}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">No BIB (Unpaid)</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={currentStatus}
                          onValueChange={(val: any) => handleStatusChange(p._id, val)}
                        >
                          <SelectTrigger className="h-9 rounded-lg bg-background border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Finished">Finished</SelectItem>
                            <SelectItem value="DNF">DNF (Did Not Finish)</SelectItem>
                            <SelectItem value="DNS">DNS (Did Not Start)</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="text"
                          placeholder="hh:mm:ss"
                          value={currentTime}
                          disabled={currentStatus !== "Finished"}
                          onChange={(e) => handleTimeChange(p._id, e.target.value)}
                          className="h-9 font-mono rounded-lg bg-background border-border/50 text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Save Button */}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSave(p)}
                            disabled={savingId === p._id}
                            className="h-9 px-3 rounded-lg flex items-center gap-1.5"
                          >
                            {savingId === p._id ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            Save
                          </Button>

                          {/* Certificate Download */}
                          {canCert ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-9 px-3 rounded-lg border-primary/30 text-primary hover:bg-primary/5 flex items-center gap-1.5"
                            >
                              <a href={getDownloadUrl(p._id)} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </a>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="h-9 px-3 rounded-lg opacity-40 flex items-center gap-1.5"
                              title={!isPaid ? "Payment Pending" : "Status not Finished"}
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          )}

                          {/* Email Certificate */}
                          {canCert ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendEmail(p._id)}
                              disabled={sendingId === p._id}
                              className="h-9 px-3 rounded-lg border-secondary/30 text-secondary hover:bg-secondary/5 flex items-center gap-1.5"
                            >
                              {sendingId === p._id ? (
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Send className="h-3.5 w-3.5" />
                              )}
                              Email
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              disabled
                              className="h-9 px-3 rounded-lg opacity-40 flex items-center gap-1.5"
                            >
                              <Send className="h-3.5 w-3.5" />
                              Email
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-muted-foreground">
              Showing {page * ROWS_PER_PAGE + 1} - {Math.min((page + 1) * ROWS_PER_PAGE, filteredParticipants.length)} of {filteredParticipants.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="h-9 rounded-lg"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="h-9 rounded-lg"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
