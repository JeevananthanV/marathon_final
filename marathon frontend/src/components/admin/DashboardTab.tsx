import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "./StatCard";
import { Users, CheckCircle, Clock, IndianRupee, TrendingUp, Target, DollarSign, Activity, Award } from "lucide-react";
import { PremiumBadge, InsightCard, PremiumAvatar, PremiumSkeleton, StatTrend, PremiumProgressRing, PremiumCard, SectionHeader, PageHeader } from "./PremiumUI";
import { TrendBadge } from "./TrendComponents";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLORS, CHART_DEFAULTS, PremiumLineChart, PremiumBarChart, PremiumDonutChart, PremiumStackedBarChart } from "./charts/PremiumCharts";
import type { Participant } from "./types";
import { useMemo, useState } from "react";

interface DashboardTabProps {
  stats: { total: number; paid: number; pending: number; revenue: number };
  categoryData: { name: string; count: number }[];
  dailyData: { date: string; count: number }[];
  cityData: { name: string; value: number }[];
  participants: Participant[];
  revenueByRace: { name: string; revenue: number }[];
}

const tooltipStyle = {
  background: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(148, 163, 184, 0.2)",
  borderRadius: "14px",
  padding: "14px 18px",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.1)",
  backdropFilter: "blur(20px)",
  fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
  fontSize: "13px",
  color: "#F8FAFC",
};

export function DashboardTab({ stats, categoryData, dailyData, cityData, participants, revenueByRace }: DashboardTabProps) {
  const conversionRate = stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0;
  const avgRevenuePerPaid = stats.paid > 0 ? Math.round(stats.revenue / stats.paid) : 0;
  const pendingValue = stats.pending * 799; // Average estimate

  const [registrationGoal, setRegistrationGoal] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_registration_goal");
      return saved ? parseInt(saved, 10) : 500;
    }
    return 500;
  });

  const handleGoalChange = (val: number) => {
    if (val >= 0) {
      setRegistrationGoal(val);
      localStorage.setItem("admin_registration_goal", val.toString());
    }
  };

  const goalProgress = registrationGoal > 0 ? Math.min(100, Math.round((stats.paid / registrationGoal) * 100)) : 0;

  const recentRegistrations = useMemo(() => {
    return [...participants]
      .sort((a, b) => new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime())
      .slice(0, 5);
  }, [participants]);

  // Prepare chart data with enhanced formatting
  const categoryChartData = categoryData.map((d) => ({
    name: d.name,
    value: d.count,
    fill: COLORS.qualitative[["5K", "10K", "21K"].indexOf(d.name)] || COLORS.primary,
  }));

  const cityChartData = cityData.map((d, i) => ({
    ...d,
    fill: COLORS.qualitative[i % COLORS.qualitative.length],
  }));

  const dailyChartData = dailyData.map((d, i) => ({
    ...d,
    count: d.count,
  }));

  // Weekly comparison data (simulated)
  const weeklyComparison = [
    { day: "Mon", thisWeek: 12, lastWeek: 8 },
    { day: "Tue", thisWeek: 19, lastWeek: 15 },
    { day: "Wed", thisWeek: 8, lastWeek: 12 },
    { day: "Thu", thisWeek: 24, lastWeek: 18 },
    { day: "Fri", thisWeek: 31, lastWeek: 25 },
    { day: "Sat", thisWeek: 42, lastWeek: 35 },
    { day: "Sun", thisWeek: 15, lastWeek: 10 },
  ];

  // Payment funnel data
  const funnelData = [
    { stage: "Registered", count: stats.total, color: COLORS.primary },
    { stage: "Pending Payment", count: stats.pending, color: COLORS.warning },
    { stage: "Paid", count: stats.paid, color: COLORS.success },
  ];

  const thisWeekTotal = weeklyComparison.reduce((sum, d) => sum + d.thisWeek, 0);
  const lastWeekTotal = weeklyComparison.reduce((sum, d) => sum + d.lastWeek, 0);
  const weekOverWeek = lastWeekTotal > 0 ? Math.round(((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100) : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Premium KPI Grid - 2 cols on mobile */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 xl:grid-cols-4">
        <StatCard
          title="Total Registrations"
          value={stats.total}
          icon={Users}
          color="primary"
          subtitle={`${participants.length} total in system`}
          delay={0}
        />
        <StatCard
          title="Confirmed (Paid)"
          value={stats.paid}
          icon={CheckCircle}
          color="success"
          subtitle={`${conversionRate}% conversion rate`}
          delay={1}
        />
        <StatCard
          title="Pending Payment"
          value={stats.pending}
          icon={Clock}
          color="warning"
          subtitle={`~₹${pendingValue.toLocaleString()} outstanding`}
          delay={2}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          icon={IndianRupee}
          color="accent"
          subtitle={
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
              {revenueByRace.map(r => (
                <span key={r.name} className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-foreground/80">{r.name}:</span>
                  <span className="font-semibold text-sm text-foreground">₹{r.revenue.toLocaleString("en-IN")}</span>
                </span>
              ))}
            </div>
          }
          delay={3}
        />
      </div>

      {/* Premium Analytics Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution - Donut */}
        <Card className="glass-strong p-6 overflow-hidden relative">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Race Category Distribution
            </CardTitle>
            <PremiumBadge variant="primary" size="sm">Live</PremiumBadge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-center h-64">
              <PremiumDonutChart
                data={categoryChartData}
                height={256}
                innerRadius={60}
                outerRadius={88}
                centerContent={
                  <div className="text-center">
                    <div className="font-display text-3xl font-black text-foreground counter-value">{stats.total}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 uppercase tracking-wider">Total Runners</div>
                  </div>
                }
                formatter={(v: number) => v.toLocaleString()}
              />
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-4">
              {categoryChartData.map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 md:h-4 md:w-4 rounded-full"
                    style={{ backgroundColor: cat.fill }}
                  />
                  <span className="text-sm md:text-base font-bold text-foreground">{cat.name}</span>
                  <span className="text-sm md:text-base font-black text-foreground bg-muted/60 px-3 py-1 rounded-full min-w-[44px] text-center shadow-sm">
                    {cat.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Daily Registrations - Area Chart */}
        <Card className="glass-strong p-6 overflow-hidden relative lg:col-span-2">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Daily Registrations Trend
            </CardTitle>
            <div className="flex items-center gap-2">
              <PremiumBadge variant="secondary" size="sm">7 Days</PremiumBadge>
              <TrendBadge value={`${weekOverWeek > 0 ? "+" : ""}${weekOverWeek}%`} label="" direction={weekOverWeek >= 0 ? "up" : "down"} size="sm" />
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <PremiumLineChart
              data={dailyChartData}
              dataKey="count"
              name="Registrations"
              color={COLORS.secondary}
              height={240}
              formatter={(v: number) => v.toLocaleString()}
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                  <span className="text-xs text-muted-foreground">This Week</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary/50" />
                  <span className="text-xs text-muted-foreground">Last Week</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Weekly Total</div>
                <div className="font-display text-xl font-black text-foreground">{thisWeekTotal}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Premium Goal Tracker & Recent Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Goal Tracker */}
        <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden relative flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <Award className="h-4.5 w-4.5 text-accent" />
              Event Registration Goal
            </CardTitle>
            <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/20 rounded-xl px-2.5 py-1 text-accent">
              <span className="text-[10px] font-black uppercase tracking-wider">Goal:</span>
              <input
                type="number"
                value={registrationGoal || ""}
                onChange={(e) => handleGoalChange(parseInt(e.target.value, 10) || 0)}
                className="w-12 bg-transparent text-xs font-black text-accent text-center focus:outline-none border-b border-accent/20 focus:border-accent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                min="1"
              />
            </div>
          </CardHeader>
          <CardContent className="pt-2 flex-1 flex flex-col items-center justify-center min-h-[220px]">
            <div className="relative flex items-center justify-center mb-6">
              <PremiumProgressRing
                progress={goalProgress}
                size={140}
                strokeWidth={10}
                color="accent"
                value={`${goalProgress}%`}
              />
            </div>
            <div className="text-center w-full">
              <p className="text-sm font-bold text-foreground">
                {stats.paid} of {registrationGoal} Confirmed
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.max(0, registrationGoal - stats.paid)} more paid registrations to reach our goal!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Registrations Feed */}
        <Card className="bg-card border border-slate-200 dark:border-white/10 rounded-3xl p-6 overflow-hidden relative lg:col-span-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium">
          <CardHeader className="pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm font-bold text-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              Recent Registrations Feed
            </CardTitle>
            <PremiumBadge variant="success" size="sm">Live Feed</PremiumBadge>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="divide-y divide-white/10 space-y-3.5 max-h-[280px] overflow-y-auto pr-1 scrollbar-hide">
              {recentRegistrations.map((p, idx) => (
                <div key={p._id || idx} className="flex items-center justify-between pt-3.5 first:pt-0 group">
                  <div className="flex items-center gap-3">
                    <PremiumAvatar name={p.fullName} size="md" colorIndex={idx} />
                    <div>
                      <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {p.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <span>{p.cityId ? p.cityId.charAt(0).toUpperCase() + p.cityId.slice(1) : "Unknown"}</span>
                        <span>•</span>
                        <span>{new Date(p.registrationDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold bg-muted/60 border border-border/60 px-2.5 py-1 rounded-full text-foreground/80 dark:bg-white/5 dark:border-white/10 dark:text-white/80">
                      {p.raceId.toUpperCase()}
                    </span>
                    <span className={cn(
                      "text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border",
                      p.paymentStatus === "Paid"
                        ? "bg-success-muted text-success border-success/20"
                        : "bg-warning-muted text-warning border-warning/20"
                    )}>
                      {p.paymentStatus}
                    </span>
                  </div>
                </div>
              ))}
              {recentRegistrations.length === 0 && (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  No registrations found yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}