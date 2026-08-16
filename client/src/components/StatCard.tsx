import { createElement, type ComponentType, type ReactNode } from "react";

export type StatCardProps = {
  icon?: ReactNode | ComponentType<{ className?: string }>;
  label: string;
  value: ReactNode;
  color?: string;
  accent?: "cyan" | "purple" | "green" | "pink" | "yellow";
  change?: number;
};

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  cyan: "border-cyan-500/30 text-cyan-300",
  purple: "border-purple-500/30 text-purple-300",
  green: "border-green-500/30 text-green-300",
  pink: "border-pink-500/30 text-pink-300",
  yellow: "border-yellow-500/30 text-yellow-300",
};

export function StatCard({ icon, label, value, color, accent = "cyan" }: StatCardProps) {
  const iconNode = typeof icon === "function" ? createElement(icon, { className: "h-4 w-4" }) : icon;
  return (
    <div className={`rounded-xl border bg-card/60 p-4 ${accentClasses[accent]}`} style={color ? { borderColor: color } : undefined}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {iconNode}
        <span>{label}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold text-foreground">{value}</div>
    </div>
  );
}
