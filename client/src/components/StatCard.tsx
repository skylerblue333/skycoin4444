import { createElement, type ComponentType, type ReactNode } from "react";

export type StatCardProps = {
  icon?: ReactNode | ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  color?: string;
  accent?: "cyan" | "purple" | "green" | "pink" | "yellow";
  change?: number;
  changeLabel?: string;
  sub?: ReactNode;
};

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  cyan: "border-cyan-500/30 text-cyan-300",
  purple: "border-purple-500/30 text-purple-300",
  green: "border-green-500/30 text-green-300",
  pink: "border-pink-500/30 text-pink-300",
  yellow: "border-yellow-500/30 text-yellow-300",
};

export function StatCard({ icon, label, value, color, accent = "cyan", change, changeLabel, sub }: StatCardProps) {
  const iconNode = typeof icon === "function" ? createElement(icon, { className: "h-4 w-4" }) : icon;
  const colorClass = color && !color.includes("[") ? `text-${color}` : undefined;
  return (
    <div className={`rounded-xl border bg-card/60 p-4 ${accentClasses[accent]}`} style={color && !colorClass ? { borderColor: color } : undefined}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {iconNode}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
      {typeof change === "number" && (
        <div className={`mt-2 text-xs ${change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {change >= 0 ? "+" : ""}{change.toFixed(1)}%{changeLabel ? ` ${changeLabel}` : ""}
        </div>
      )}
    </div>
  );
}
