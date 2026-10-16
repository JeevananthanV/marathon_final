import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PremiumStackedBarChart } from "./charts/PremiumCharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { COLORS } from "./charts/PremiumCharts";
import { PremiumBadge, InsightCard, PremiumAvatar, PremiumSkeleton, StatTrend, PremiumProgressRing, PremiumCard, SectionHeader, PageHeader } from "./PremiumUI";
import { TrendBadge } from "./TrendComponents";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { ReportRow, Participant } from "./types";
import { motion } from "framer-motion";
import { useMemo } from "react";

interface ReportsTabProps {
  reportData: ReportRow[];
  revenueByCity: { name: string; revenue: number }[];
  revenueByRace: { name: string; revenue: number }[];
  participants: Participant[];
}

export function ReportsTab({ reportData, revenueByCity, revenueByRace, participants }: ReportsTabProps) {
  const cityPerformance = useMemo(() => {
    const cities: Record<string, { registered: number; paid: number; pending: number; revenue: number }> = {};
    participants.forEach((p) => {
      const cityKey = p.cityId ? p.cityId.charAt(0).toUpperCase() + p.cityId.slice(1) : "Unknown";
      if (!cities[cityKey]) {
        cities[cityKey] = { registered: 0, paid: 0, pending: 0, revenue: 0 };
      }
      cities[cityKey].registered++;
      if (p.paymentStatus === "Paid") {
        cities[cityKey].paid++;
        const rId = (p.raceId || "").toLowerCase();
        const price = { "5k": 499, "10k": 799, "21k": 999 }[rId] || 0;
        cities[cityKey].revenue += price;
      } else {
        cities[cityKey].pending++;
      }
    });
    return Object.entries(cities).map(([name, d]) => ({ name, ...d }));
  }, [participants]);
  const totalRegistered = reportData.reduce((a, r) => a + r.registered, 0);
  const totalPaid = reportData.reduce((a, r) => a + r.paid, 0);
  const totalPending = reportData.reduce((a, r) => a + r.pending, 0);
  const totalRevenue = reportData.reduce((a, r) => a + r.revenue, 0);
  const overallConversion = totalRegistered > 0 ? Math.round((totalPaid / totalRegistered) * 100) : 0;

  function exportCSV() {
    const headers = ["Race", "Registered", "Paid", "Pending", "Revenue (₹)"];
    const rows = reportData.map((r) => [r.race, r.registered, r.paid, r.pending, r.revenue]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Report");
    XLSX.writeFile(wb, `revenue_report_${Date.now()}.csv`);
    toast.success("Report downloaded!");
  }

  function exportExcel() {
    const headers = ["Race", "Registered", "Paid", "Pending", "Revenue (₹)"];
    const rows = reportData.map((r) => [r.race, r.registered, r.paid, r.pending, r.revenue]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Revenue Report");
    XLSX.writeFile(wb, `revenue_report_${Date.now()}.xlsx`);
    toast.success("Excel downloaded!");
  }

  const cityChartData = revenueByCity.map((c, i) => ({
    ...c,
    fill: COLORS.qualitative[i % COLORS.qualitative.length],
  }));

  const raceChartData = revenueByRace.map((r, i) => ({
    ...r,
    fill: COLORS.qualitative[i % COLORS.qualitative.length],
  }));

  const projectedRevenue = Math.round(totalRevenue * 1.25);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center text-center gap-3">
        <div>
          <p className="text-sm text-muted-foreground text-center">
            Total revenue: <span className="font-semibold text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</span>
            {" • "}Conversion: <span className="font-semibold text-primary">{overallConversion}%</span>
            {" • "}Projected: <span className="font-semibold text-success">₹{projectedRevenue.toLocaleString("en-IN")}</span>
          </p>
        </div>
        <div className="flex gap-2 justify-center">
          <Button variant="outline" size="sm" className="h-9 rounded-xl text-sm font-semibold text-success border-success/30 hover:bg-success/10" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-1.5" /> CSV
          </Button>
          <Button size="sm" className="h-9 rounded-xl text-sm font-semibold" onClick={exportExcel}>
            <Download className="h-4 w-4 mr-1.5" /> Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by City - Bar Chart */}
        <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Revenue by City
            </CardTitle>
            <PremiumBadge variant="primary" size="sm">Live</PremiumBadge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-56">
              {cityChartData.map((city, i) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{city.name}</span>
                    <span className="font-display text-sm font-black text-foreground">₹{city.revenue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(city.revenue / Math.max(...revenueByCity.map(c => c.revenue))) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{ background: `linear-gradient(90deg, ${city.fill}, ${city.fill}dd)` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/40 dark:border-white/10">
              <div className="text-center p-3 rounded-xl bg-primary/10">
                <div className="font-display text-xl font-black text-primary">{revenueByCity.length}</div>
                <div className="text-xs text-muted-foreground">Active Cities</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-success/10">
                <div className="font-display text-xl font-black text-success">₹{Math.max(...revenueByCity.map(c => c.revenue)).toLocaleString("en-IN")}</div>
                <div className="text-xs text-muted-foreground">Top City</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-accent/10">
                <div className="font-display text-xl font-black text-accent-foreground">{((totalRevenue / 100000)).toFixed(1)}L</div>
                <div className="text-xs text-muted-foreground">Total Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category - Bar Chart */}
        <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Revenue by Category
            </CardTitle>
            <PremiumBadge variant="secondary" size="sm">Race Types</PremiumBadge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-56">
              {raceChartData.map((race, i) => (
                <motion.div
                  key={race.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-3"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground">{race.name}</span>
                    <span className="font-display text-sm font-black text-foreground">₹{race.revenue.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(race.revenue / Math.max(...revenueByRace.map(r => r.revenue))) * 100}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full relative overflow-hidden"
                      style={{ background: `linear-gradient(90deg, ${race.fill}, ${race.fill}dd)` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/40 dark:border-white/10">
              {raceChartData.map((race, i) => (
                <div key={race.name} className="text-center p-3 rounded-xl bg-muted/40 dark:bg-white/5">
                  <div className="font-display text-xl font-black" style={{ color: race.fill }}>
                    ₹{(race.revenue / 100000).toFixed(1)}L
                  </div>
                  <div className="text-xs text-muted-foreground">{race.name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Premium Payment Summary Table */}
      <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        <CardHeader className="border-b border-border/40 pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="h-2 w-2 rounded-full bg-success" />
            Payment Summary by Race
          </CardTitle>
        </CardHeader>
        {/* Desktop View */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-border/40">
              <TableHead className="font-bold text-xs uppercase tracking-wider">Race</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Registered</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Paid</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Pending</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Conv. Rate</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.map((r) => {
              const convRate = r.registered > 0 ? Math.round((r.paid / r.registered) * 100) : 0;
              return (
                <TableRow key={r.race} className="border-b-border/20 hover:bg-muted/40 transition-colors">
                  <TableCell className="font-bold text-primary text-sm">{r.race}</TableCell>
                  <TableCell className="text-center text-sm">{r.registered.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-sm text-success font-semibold">{r.paid.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-sm text-warning font-semibold">{r.pending.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-sm">
                    <TrendBadge value={`${convRate}%`} direction={convRate >= 50 ? "up" : convRate >= 30 ? "neutral" : "down"} size="sm" />
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm text-foreground">₹{r.revenue.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              );
            })}
            <TableRow className="bg-muted/40 hover:bg-muted/50">
              <TableCell className="font-black text-foreground text-sm">TOTAL</TableCell>
              <TableCell className="text-center font-black text-sm">{totalRegistered.toLocaleString()}</TableCell>
              <TableCell className="text-center font-black text-sm text-success">{totalPaid.toLocaleString()}</TableCell>
              <TableCell className="text-center font-black text-sm text-warning">{totalPending.toLocaleString()}</TableCell>
              <TableCell className="text-center font-black text-sm">
                <TrendBadge value={`${overallConversion}%`} direction={overallConversion >= 50 ? "up" : "neutral"} size="sm" />
              </TableCell>
              <TableCell className="text-right font-black text-sm text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-border/20 dark:divide-white/5">
          {reportData.map((r) => {
            const convRate = r.registered > 0 ? Math.round((r.paid / r.registered) * 100) : 0;
            return (
              <div key={r.race} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-sm">{r.race}</span>
                  <TrendBadge value={`${convRate}%`} direction={convRate >= 50 ? "up" : convRate >= 30 ? "neutral" : "down"} size="sm" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-muted/30 dark:bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-muted-foreground block">Registered</span>
                    <span className="font-semibold text-foreground">{r.registered.toLocaleString()}</span>
                  </div>
                  <div className="bg-success-muted p-2 rounded-lg">
                    <span className="text-[10px] text-success block">Paid</span>
                    <span className="font-semibold text-success">{r.paid.toLocaleString()}</span>
                  </div>
                  <div className="bg-warning-muted p-2 rounded-lg">
                    <span className="text-[10px] text-warning block">Pending</span>
                    <span className="font-semibold text-warning">{r.pending.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-bold text-foreground">₹{r.revenue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
          {/* Total Row */}
          <div className="p-4 bg-muted/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-black text-foreground text-sm">TOTAL</span>
              <TrendBadge value={`${overallConversion}%`} direction={overallConversion >= 50 ? "up" : "neutral"} size="sm" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-muted p-2 rounded-lg">
                <span className="text-[10px] text-muted-foreground block font-bold">Registered</span>
                <span className="font-black text-foreground">{totalRegistered.toLocaleString()}</span>
              </div>
              <div className="bg-success-muted p-2 rounded-lg">
                <span className="text-[10px] text-success block font-bold">Paid</span>
                <span className="font-black text-success">{totalPaid.toLocaleString()}</span>
              </div>
              <div className="bg-warning-muted p-2 rounded-lg">
                <span className="text-[10px] text-warning block font-bold">Pending</span>
                <span className="font-black text-warning">{totalPending.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="font-bold text-muted-foreground">Total Revenue:</span>
              <span className="font-black text-foreground">₹{totalRevenue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Premium City Breakdown Table */}
      <Card className="glass-strong overflow-hidden mt-6">
        <CardHeader className="border-b border-border/40 pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Registration & Revenue Performance by City
          </CardTitle>
        </CardHeader>
        {/* Desktop View */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-border/40">
              <TableHead className="font-bold text-xs uppercase tracking-wider">City</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Registered</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Paid</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Pending</TableHead>
              <TableHead className="text-center font-bold text-xs uppercase tracking-wider">Conv. Rate</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-wider">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cityPerformance.map((c) => {
              const convRate = c.registered > 0 ? Math.round((c.paid / c.registered) * 100) : 0;
              return (
                <TableRow key={c.name} className="border-b-border/20 hover:bg-muted/40 transition-colors">
                  <TableCell className="font-bold text-secondary text-sm">{c.name}</TableCell>
                  <TableCell className="text-center text-sm">{c.registered.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-sm text-success font-semibold">{c.paid.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-sm text-warning font-semibold">{c.pending.toLocaleString()}</TableCell>
                  <TableCell className="text-center text-sm">
                    <TrendBadge value={`${convRate}%`} direction={convRate >= 50 ? "up" : convRate >= 30 ? "neutral" : "down"} size="sm" />
                  </TableCell>
                  <TableCell className="text-right font-bold text-sm text-foreground">₹{c.revenue.toLocaleString("en-IN")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Mobile View */}
        <div className="block md:hidden divide-y divide-border/20 dark:divide-white/5">
          {cityPerformance.map((c) => {
            const convRate = c.registered > 0 ? Math.round((c.paid / c.registered) * 100) : 0;
            return (
              <div key={c.name} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-secondary text-sm">{c.name}</span>
                  <TrendBadge value={`${convRate}%`} direction={convRate >= 50 ? "up" : convRate >= 30 ? "neutral" : "down"} size="sm" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-muted/30 dark:bg-white/5 p-2 rounded-lg">
                    <span className="text-[10px] text-muted-foreground block">Registered</span>
                    <span className="font-semibold text-foreground">{c.registered.toLocaleString()}</span>
                  </div>
                  <div className="bg-success-muted p-2 rounded-lg">
                    <span className="text-[10px] text-success block">Paid</span>
                    <span className="font-semibold text-success">{c.paid.toLocaleString()}</span>
                  </div>
                  <div className="bg-warning-muted p-2 rounded-lg">
                    <span className="text-[10px] text-warning block">Pending</span>
                    <span className="font-semibold text-warning">{c.pending.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-bold text-foreground">₹{c.revenue.toLocaleString("en-IN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
