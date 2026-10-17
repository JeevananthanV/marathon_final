import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface TrendData {
  value: number;
  label: string;
  isPositive?: boolean;
}

export function TrendBadge({ value, label, isPositive = true }: TrendData) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
      isPositive
        ? "bg-success-muted text-success border border-success/20"
        : "bg-destructive-muted text-destructive border border-destructive/20"
    )}>
      {isPositive ? (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      ) : (
        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      )}
      <span>{value > 0 ? "+" : ""}{value}{label ? `% ${label}` : ""}</span>
    </span>
  );
}

export function PremiumBadge({
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "destructive" | "accent" | "info";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  className?: string;
}) {
  const variants = {
    primary: "bg-primary-muted text-primary border border-primary/20",
    secondary: "bg-secondary-muted text-secondary border border-secondary/20",
    success: "bg-success-muted text-success border border-success/20",
    warning: "bg-warning-muted text-warning border border-warning/20",
    destructive: "bg-destructive-muted text-destructive border border-destructive/20",
    accent: "bg-accent-muted text-accent-foreground border border-accent/20",
    info: "bg-info-muted text-info border border-info/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-semibold transition-all duration-200 border",
      variants[variant],
      sizes[size],
      className
    )}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

export function PremiumAvatar({
  name,
  size = "md",
  className,
  colorIndex = 0,
}: {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  colorIndex?: number;
}) {
  const colors = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-warning",
    "bg-accent",
    "bg-info",
    "bg-destructive",
    "bg-purple-600",
  ];

  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn(
      "flex items-center justify-center rounded-full font-bold text-white border border-white/10 shadow-sm",
      colors[colorIndex % colors.length],
      sizes[size],
      className
    )}>
      {initials}
    </div>
  );
}

export function PremiumSkeleton({ className, variant = "text" }: {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "avatar";
}) {
  const variants = {
    text: "h-4 w-full",
    circular: "h-10 w-10 rounded-full",
    rectangular: "h-20 w-full rounded-xl",
    avatar: "h-10 w-10 rounded-2xl",
  };

  return (
    <div className={cn(
      "relative overflow-hidden bg-muted/50 rounded-lg",
      variants[variant],
      className
    )}>
      <div className="absolute inset-0" style={{
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s ease-in-out infinite",
      }} />
    </div>
  );
}

export function StatTrend({ value, label, icon: Icon }: {
  value: number;
  label?: string;
  icon?: LucideIcon;
}) {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center gap-1.5">
      {Icon && <Icon className={cn("h-3.5 w-3.5", isPositive ? "text-success" : "text-destructive")} />}
      <span className={cn("font-semibold text-sm", isPositive ? "text-success" : "text-destructive")}>
        {isPositive ? "+" : ""}{value}%
      </span>
      {label && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  );
}

export function PremiumProgressRing({
  progress,
  size = 64,
  strokeWidth = 4,
  color = "primary",
  showValue = true,
  value,
  className,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: "primary" | "secondary" | "success" | "warning" | "accent";
  showValue?: boolean;
  value?: string | number;
  className?: string;
}) {
  const colors = {
    primary: "var(--gradient-primary)",
    secondary: "var(--gradient-ocean)",
    success: "var(--gradient-emerald)",
    warning: "var(--gradient-sunset)",
    accent: "var(--gradient-gold)",
  };

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <defs>
          <linearGradient id={`progress-gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[color as keyof typeof colors]?.split(" ")[1] || "#4F46E5"} />
            <stop offset="100%" stopColor={colors[color as keyof typeof colors]?.split(" ")[3] || "#6366F1"} />
          </linearGradient>
        </defs>
        <circle
          className="text-muted/20"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-primary"
          strokeWidth={strokeWidth}
          stroke={colors[color as keyof typeof colors] ? `url(#progress-gradient-${color})` : "currentColor"}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
            transition: "stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: "drop-shadow(0 2px 8px rgba(79, 70, 229, 0.3))",
          }}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold text-sm text-foreground">{value ?? `${Math.round(progress)}%`}</span>
        </div>
      )}
    </div>
  );
}

export function InsightCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: TrendData;
  variant?: "default" | "highlight" | "bordered";
  className?: string;
}) {
  const variants = {
    default: "glass-card p-5",
    highlight: "glass-strong p-5 border-gradient-subtle",
    bordered: "glass-card p-5 border border-border/60",
  };

  return (
    <div className={cn(variants[variant], "transition-all duration-300 hover:shadow-premium-lg hover:-translate-y-1", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{title}</p>
          <p className="text-2xl font-black text-foreground tracking-tight mb-1">{value}</p>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
          {trend && <StatTrend {...trend} />}
        </div>
        {Icon && (
          <div className="flex-shrink-0 p-2 rounded-xl bg-primary/10 text-primary">
            {Icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function PremiumCard({
  children,
  className,
  hover = true,
  padding = "p-6",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: string;
  variant?: "default" | "elevated" | "bordered" | "glass";
}) {
  const variants = {
    default: "glass-card",
    elevated: "glass-card shadow-premium-lg",
    bordered: "glass-card border border-border/60",
    glass: "glass-strong",
  };

  return (
    <div className={cn(
      variants[variant],
      padding,
      "rounded-2xl transition-all duration-300",
      hover && "hover:shadow-premium-xl hover:-translate-y-1",
      className
    )}>
      {children}
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-5 w-5 text-primary" />}
        <div>
          <h2 className="font-display text-xl font-bold text-foreground tracking-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb = [],
  action,
}: {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
  action?: React.ReactNode;
}) {
  return (
    <div className="page-header-premium mb-8">
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          {breadcrumb.length > 0 && (
            <nav className="flex items-center gap-1.5 text-sm text-white/60 mb-2" aria-label="Breadcrumb">
              {breadcrumb.map((item, i) => (
                <span key={item.label} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-white/40">/</span>}
                  {item.href ? (
                    <a href={item.href} className="hover:text-white transition-colors">{item.label}</a>
                  ) : (
                    <span className="font-semibold text-white">{item.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/70 mt-1 text-sm sm:text-base">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0 mt-4 sm:mt-0">{action}</div>}
      </div>
    </div>
  );
}