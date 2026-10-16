import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

export const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#818CF8",
  primaryDark: "#3730A3",
  secondary: "#06B6D4",
  secondaryLight: "#22D3EE",
  secondaryDark: "#0E7490",
  accent: "#F59E0B",
  accentLight: "#FBBF24",
  accentDark: "#D97706",
  success: "#10B981",
  successLight: "#34D399",
  successDark: "#059669",
  warning: "#F97316",
  warningLight: "#FB923C",
  warningDark: "#EA580C",
  destructive: "#EF4444",
  destructiveLight: "#F87171",
  destructiveDark: "#DC2626",
  info: "#0EA5E9",
  infoLight: "#38BDF8",
  infoDark: "#0284C7",

  qualitative: [
    "#4F46E5", "#06B6D4", "#F59E0B", "#10B981", "#F97316", "#8B5CF6", "#EC4899", "#14B8A6", "#F43F5E",
  ],
  sequential: [
    "#FAFBFF", "#E2E8F0", "#CBD5E1", "#94A3B8", "#64748B", "#475569", "#334155", "#1E293B", "#0F172A",
  ],
  diverging: [
    "#EF4444", "#F97316", "#F59E0B", "#10B981", "#4F46E5",
  ],

  grid: "var(--color-border)",
  tickColor: "var(--color-muted-foreground)",
  fontFamily: '"Inter", "Plus Jakarta Sans", sans-serif',
};

export const CHART_DEFAULTS = {
  margin: { top: 12, right: 16, left: -10, bottom: 0 },
  axis: {
    tick: { fill: COLORS.tickColor, fontSize: 11, fontFamily: COLORS.fontFamily },
    tickLine: { stroke: "transparent" },
    axisLine: { stroke: "transparent" },
    vertical: false,
  },
  grid: {
    strokeDasharray: "4 4",
    stroke: COLORS.grid,
    vertical: false,
  },
  cursor: {
    stroke: COLORS.primary,
    strokeWidth: 1.5,
    strokeDasharray: "4 4",
    opacity: 0.5,
  },
  legend: {
    fontSize: 12,
    fontFamily: COLORS.fontFamily,
    wrapperStyle: {
      paddingTop: 12,
      color: "var(--color-muted-foreground)",
    },
  },
};

export function CustomTooltip({ active, payload, label, formatter }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-strong rounded-2xl px-4.5 py-3 text-xs shadow-premium-lg border border-border/80 text-foreground animate-fade-in">
        {label && <p className="font-bold text-muted-foreground/80 mb-1.5 tracking-wide">{label}</p>}
        <div className="space-y-1.5">
          {payload.map((item: any, idx: number) => {
            const val = formatter ? formatter(item.value) : item.value;
            return (
              <div key={idx} className="flex items-center gap-2.5 font-semibold">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color || item.fill }} />
                <span className="text-muted-foreground">{item.name}:</span>
                <span className="text-foreground font-black">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
}

export function PremiumBarChart({
  data,
  dataKey,
  name,
  color,
  height = 260,
  radius = [8, 8, 0, 0],
  showTooltip = true,
  formatter,
}: {
  data: any[];
  dataKey: string;
  name?: string;
  color?: string;
  height?: number;
  radius?: number | [number, number, number, number];
  showTooltip?: boolean;
  formatter?: (v: number) => string;
}) {
  const gradientId = `gradient-${dataKey}`;
  const fillColor = color || COLORS.primary;
  const fillColorLight = color ? `${color}aa` : COLORS.primaryLight;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={CHART_DEFAULTS.margin} layout="vertical" barCategoryGap="30%">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={fillColor} stopOpacity={1} />
            <stop offset="100%" stopColor={fillColorLight} stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_DEFAULTS.grid} />
        <XAxis
          type="number"
          tick={{ ...CHART_DEFAULTS.axis.tick, fill: COLORS.tickColor }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ ...CHART_DEFAULTS.axis.tick, fill: COLORS.tickColor }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        {showTooltip && (
          <Tooltip
            content={<CustomTooltip formatter={formatter} />}
            cursor={{ fill: "var(--color-muted)", opacity: 0.15 }}
          />
        )}
        <Bar
          dataKey={dataKey}
          name={name}
          fill={`url(#${gradientId})`}
          radius={radius}
          maxBarSize={48}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PremiumLineChart({
  data,
  dataKey,
  name,
  color,
  height = 260,
  strokeWidth = 3,
  showDots = true,
  dotRadius = 5,
  fillOpacity = 0.12,
  formatter,
}: {
  data: any[];
  dataKey: string;
  name?: string;
  color?: string;
  height?: number;
  strokeWidth?: number;
  showDots?: boolean;
  dotRadius?: number;
  fillOpacity?: number;
  formatter?: (v: number) => string;
}) {
  const lineColor = color || COLORS.primary;
  const gradientId = `line-gradient-${dataKey}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={CHART_DEFAULTS.margin}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_DEFAULTS.grid} />
        <XAxis
          dataKey="date"
          tick={{ ...CHART_DEFAULTS.axis.tick, fill: COLORS.tickColor }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ ...CHART_DEFAULTS.axis.tick, fill: COLORS.tickColor }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatter} />}
          cursor={CHART_DEFAULTS.cursor}
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          name={name}
          stroke={lineColor}
          strokeWidth={strokeWidth}
          fill={`url(#${gradientId})`}
          dot={showDots ? {
            r: dotRadius,
            fill: lineColor,
            strokeWidth: 3,
            stroke: "var(--color-card)",
          } : false}
          activeDot={showDots ? {
            r: dotRadius + 2,
            fill: lineColor,
            strokeWidth: 3,
            stroke: "var(--color-card)",
          } : false}
          isAnimationActive
          animationDuration={1200}
          animationEasing="ease-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function PremiumDonutChart({
  data,
  height = 260,
  innerRadius = 70,
  outerRadius = 95,
  centerContent,
  formatter,
}: {
  data: any[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  centerContent?: React.ReactNode;
  formatter?: (v: number) => string;
}) {
  return (
    <div className="relative w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={4}
            label={false}
          >
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS.qualitative[i % COLORS.qualitative.length]}
                stroke="var(--color-card)"
                strokeWidth={3}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip formatter={formatter} />}
          />
        </PieChart>
      </ResponsiveContainer>
      {centerContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {centerContent}
        </div>
      )}
    </div>
  );
}

export function PremiumStackedBarChart({
  data,
  stacks,
  height = 260,
  formatter,
}: {
  data: any[];
  stacks: { dataKey: string; name: string; color: string }[];
  height?: number;
  formatter?: (v: number) => string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={CHART_DEFAULTS.margin} barCategoryGap="20%">
        <CartesianGrid {...CHART_DEFAULTS.grid} />
        <XAxis
          dataKey="name"
          tick={{ ...CHART_DEFAULTS.axis.tick, fill: COLORS.tickColor }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ ...CHART_DEFAULTS.axis.tick, fill: COLORS.tickColor }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatter} />}
          cursor={{ fill: "var(--color-muted)", opacity: 0.15 }}
        />
        <Legend {...CHART_DEFAULTS.legend} iconType="circle" iconSize={8} />
        {stacks.map((stack, i) => (
          <Bar
            key={stack.dataKey}
            dataKey={stack.dataKey}
            name={stack.name}
            fill={stack.color}
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
            isAnimationActive
            animationDuration={1000}
            animationEasing="ease-out"
            animationBegin={i * 80}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}