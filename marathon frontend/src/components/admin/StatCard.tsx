import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "secondary" | "success" | "warning" | "accent" | "info" | "destructive";
  subtitle?: React.ReactNode;
  trend?: { value: number; label: string; isPositive: boolean };
  delay?: number;
}

const colorConfigs = {
  primary: { bg: "bg-primary", text: "text-primary", glow: "shadow-primary/20", gradient: "gradient-primary" },
  secondary: { bg: "bg-secondary", text: "text-secondary", glow: "shadow-secondary/20", gradient: "gradient-ocean" },
  success: { bg: "bg-success", text: "text-success", glow: "shadow-success/20", gradient: "gradient-emerald" },
  warning: { bg: "bg-warning", text: "text-warning", glow: "shadow-warning/20", gradient: "gradient-sunset" },
  accent: { bg: "bg-accent", text: "text-accent-foreground", glow: "shadow-amber-400/20", gradient: "gradient-gold" },
  info: { bg: "bg-info", text: "text-info", glow: "shadow-info/20", gradient: "gradient-ocean" },
  destructive: { bg: "bg-destructive", text: "text-destructive", glow: "shadow-destructive/20", gradient: "gradient-sunset" },
} as const;

export function StatCard({ title, value, icon: Icon, color, subtitle, trend, delay = 0 }: StatCardProps) {
  const config = colorConfigs[color];
  const iconBg = config.bg;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 + delay * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative group bg-card border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-6 overflow-hidden",
        "shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover-premium"
      )}
    >

      <div className="relative z-10 flex items-start justify-between">
        <div className="space-y-2 pr-4">
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + delay * 0.1 }}
            className="text-xs font-bold text-muted-foreground uppercase tracking-wider"
          >
            {title}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + delay * 0.1 }}
            className="text-2xl md:text-4xl font-black text-foreground tracking-tight leading-none counter-value"
          >
            {value}
          </motion.p>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + delay * 0.1 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {subtitle}
            </motion.p>
          )}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + delay * 0.1 }}
              className="flex items-center gap-1.5 mt-2"
            >
              <span className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                trend.isPositive
                  ? "bg-success/15 text-success border border-success/20"
                  : "bg-destructive/15 text-destructive border border-destructive/20"
              )}>
                {trend.isPositive ? (
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                ) : (
                  <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
                <span>{trend.isPositive ? "+" : ""}{trend.value}%</span>
                <span className="text-muted-foreground/80">{trend.label}</span>
              </span>
            </motion.div>
          )}
        </div>

        <div className={cn("flex h-10 w-10 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl md:rounded-2xl", iconBg)}>
          <Icon className="h-5 w-5 md:h-7 md:w-7 text-white" />
        </div>
      </div>

      {/* Bottom accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.8, delay: 0.6 + delay * 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
      />
    </motion.div>
  );
}