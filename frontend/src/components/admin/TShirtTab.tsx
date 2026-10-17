import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PremiumStackedBarChart } from "./charts/PremiumCharts";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { COLORS } from "./charts/PremiumCharts";
import { PremiumBadge, InsightCard, PremiumAvatar, PremiumSkeleton, StatTrend, PremiumProgressRing, PremiumCard, SectionHeader, PageHeader } from "./PremiumUI";
import { TrendBadge } from "./TrendComponents";
import type { TShirtRow } from "./types";

interface TShirtTabProps {
  tshirtData: TShirtRow[];
}

export function TShirtTab({ tshirtData }: TShirtTabProps) {
  function exportCSV() {
    const headers = ["Size", "5K", "10K", "21K", "Total"];
    const rows = tshirtData.map((t) => [t.size, t.races["5k"], t.races["10k"], t.races["21k"], t.total]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "T-Shirt Report");
    XLSX.writeFile(wb, `tshirt_report_${Date.now()}.csv`);
    toast.success("T-Shirt report downloaded!");
  }

  function exportExcel() {
    const headers = ["Size", "5K", "10K", "21K", "Total"];
    const rows = tshirtData.map((t) => [t.size, t.races["5k"], t.races["10k"], t.races["21k"], t.total]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "T-Shirt Report");
    XLSX.writeFile(wb, `tshirt_report_${Date.now()}.xlsx`);
    toast.success("Excel downloaded!");
  }

  const totalAll = tshirtData.reduce((sum, t) => sum + t.total, 0);
  const topSize = tshirtData.length > 0
    ? tshirtData.reduce((max, t) => t.total > max.total ? t : max, tshirtData[0])
    : { size: "N/A", total: 0 };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center text-center gap-3">
        <div>
          <p className="text-sm text-muted-foreground text-center">
            Total orders: <span className="font-semibold text-foreground">{totalAll}</span>
            {" • "}Most popular: <span className="font-semibold text-primary">{topSize.size}</span> ({topSize.total} orders)
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

      {/* Premium Size Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {tshirtData.map((t, i) => (
          <motion.div
            key={t.size}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl text-center py-4 relative overflow-hidden group shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="relative p-4">
              <div
                className="text-3xl font-black transition-transform group-hover:scale-110"
                style={{ color: COLORS.qualitative[i % COLORS.qualitative.length] }}
              >
                {t.total}
              </div>
              <div className="text-xs font-bold text-muted-foreground uppercase mt-2 tracking-wider">{t.size}</div>
              <div className="mt-2 h-1 w-12 mx-auto rounded-full opacity-60"
                style={{ backgroundColor: COLORS.qualitative[i % COLORS.qualitative.length] }} />
              <TrendBadge
                value={`${totalAll > 0 ? Math.round((t.total / totalAll) * 100) : 0}%`}
                label="of total"
                direction="neutral"
                size="sm"
              />
            </CardContent>
          </motion.div>
        ))}
      </div>

      {/* Premium Size Table */}
      <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-muted text-xs uppercase font-bold text-muted-foreground tracking-wider">
              <tr>
                <th className="px-6 py-3.5 text-center">Size</th>
                <th className="px-6 py-3.5 text-center">5K</th>
                <th className="px-6 py-3.5 text-center">10K</th>
                <th className="px-6 py-3.5 text-center">21K</th>
                <th className="px-6 py-3.5 text-center font-black text-foreground">Total</th>
                <th className="px-6 py-3.5 text-center">Share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {tshirtData.map((t, i) => (
                <tr key={t.size} className="hover:bg-muted/40 transition-colors group">
                  <td className="px-6 py-3.5 text-center font-bold text-base"
                    style={{ color: COLORS.qualitative[i % COLORS.qualitative.length] }}>
                    {t.size}
                  </td>
                  <td className="px-6 py-3.5 text-center text-sm">{t.races["5k"]}</td>
                  <td className="px-6 py-3.5 text-center text-sm">{t.races["10k"]}</td>
                  <td className="px-6 py-3.5 text-center text-sm">{t.races["21k"]}</td>
                  <td className="px-6 py-3.5 text-center font-black text-base text-foreground">{t.total}</td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-2 w-20 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(t.total / totalAll) * 100}%`,
                            backgroundColor: COLORS.qualitative[i % COLORS.qualitative.length],
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground min-w-[40px]">
                        {((t.total / totalAll) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="block md:hidden divide-y divide-border/20 dark:divide-white/5">
          {tshirtData.map((t, i) => (
            <div key={t.size} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-black" style={{ color: COLORS.qualitative[i % COLORS.qualitative.length] }}>
                  Size {t.size}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  Share: {((t.total / totalAll) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-muted/30 dark:bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">5K</span>
                  <span className="font-semibold text-foreground">{t.races["5k"]}</span>
                </div>
                <div className="bg-muted/30 dark:bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">10K</span>
                  <span className="font-semibold text-foreground">{t.races["10k"]}</span>
                </div>
                <div className="bg-muted/30 dark:bg-white/5 p-2 rounded-lg">
                  <span className="text-[10px] text-muted-foreground block font-bold uppercase">21K</span>
                  <span className="font-semibold text-foreground">{t.races["21k"]}</span>
                </div>
                <div className="bg-primary/10 p-2 rounded-lg">
                  <span className="text-[10px] text-primary block font-bold uppercase">Total</span>
                  <span className="font-black text-primary">{t.total}</span>
                </div>
              </div>
              <div className="h-2 w-full bg-muted dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(t.total / totalAll) * 100}%`,
                    backgroundColor: COLORS.qualitative[i % COLORS.qualitative.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Premium Stacked Bar Chart */}
      <Card className="glass-strong overflow-hidden relative">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
            <span className="h-2 w-2 rounded-full bg-success" />
            Size Distribution by Race Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PremiumStackedBarChart
            data={tshirtData.map(t => ({
              name: t.size,
              "5K": t.races["5k"],
              "10K": t.races["10k"],
              "21K": t.races["21k"],
            }))}
            stacks={[
              { dataKey: "5K", name: "5K", color: COLORS.primary },
              { dataKey: "10K", name: "10K", color: COLORS.secondary },
              { dataKey: "21K", name: "21K", color: COLORS.accent },
            ]}
            height={300}
          />
        </CardContent>
      </Card>
    </div>
  );
}
