import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface StatTrendProps {
  value: string;
  label?: string;
  direction: "up" | "down" | "neutral";
}

export function StatTrend({ value, label, direction }: StatTrendProps) {
  const config = {
    up: { icon: TrendingUp, color: "text-success", bg: "bg-success/10", label: "vs last period" },
    down: { icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", label: "vs last period" },
    neutral: { icon: Minus, color: "text-muted-foreground", bg: "bg-muted/50", label: "vs last period" },
  };

  const { icon: Icon, color, bg } = config[direction];

  return (
    <div className="inline-flex items-center gap-1.5 mt-2">
      <span className={cn("inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] font-bold", bg)}>
        <Icon className={cn("h-3 w-3", color)} />
      </span>
      <span className={cn("font-semibold text-sm", color)}>{value}</span>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}

interface TrendBadgeProps {
  value: string;
  label?: string;
  direction: "up" | "down" | "neutral";
  size?: "sm" | "md" | "lg";
}

export function TrendBadge({ value, label, direction, size = "md" }: TrendBadgeProps) {
  const config = {
    up: { icon: TrendingUp, color: "bg-success/10 text-success border-success/20", iconColor: "text-success" },
    down: { icon: TrendingDown, color: "bg-destructive/10 text-destructive border-destructive/20", iconColor: "text-destructive" },
    neutral: { icon: Minus, color: "bg-muted/50 text-muted-foreground border-muted/30", iconColor: "text-muted-foreground" },
  };

  const { icon: Icon, color, iconColor } = config[direction];
  const sizes = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  return (
    <span className={cn("inline-flex items-center font-semibold rounded-full border", sizes[size], color)}>
      <Icon className={cn("shrink-0", iconColor, size === "sm" ? "h-2.5 w-2.5" : size === "md" ? "h-3.5 w-3.5" : "h-4 w-4")} />
      <span>{value}</span>
      {label && <span className="text-muted-foreground/70">{label}</span>}
    </span>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  showArea?: boolean;
}

export function Sparkline({ data, color = "#4F46E5", height = 32, width = 100, showArea = true }: SparklineProps) {
  if (!data.length) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height * 0.8) - height * 0.1;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = [
    `${width},${height}`,
    ...data.map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height * 0.8) - height * 0.1;
      return `${x},${y}`;
    }).reverse().join(" "),
    `0,${height}`,
  ].join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {showArea && (
        <polygon
          points={areaPoints}
          fill={`url(#sparkline-gradient-${color.replace("#", "")})`}
          opacity={0.3}
        />
      )}
      <polyline
        points={points}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id={`sparkline-gradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral"; label?: string };
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
}

export function MetricCard({ title, value, icon: Icon, iconColor = "text-primary", trend, subtitle, className, action }: MetricCardProps) {
  return (
    <div className={cn("glass-card-hover p-5 relative overflow-hidden", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="font-display text-3xl font-black text-foreground tracking-tight counter-value">
              {typeof value === "number" ? value.toLocaleString() : value}
            </span>
            {action}
          </div>
          {trend && <TrendBadge value={trend.value} label={trend.label} direction={trend.direction} size="sm" />}
          {subtitle && <p className="text-xs text-muted-foreground mt-1.5">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={cn("flex-shrink-0 p-3 rounded-2xl", iconColor.replace("text-", "bg-").replace("text-", "bg-") + "/10")}>
            <Icon className={cn("h-6 w-6", iconColor)} />
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}