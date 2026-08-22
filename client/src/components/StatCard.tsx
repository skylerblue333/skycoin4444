import type { LucideIcon } from "lucide-react";

export interface StatCardProps {
  readonly icon: LucideIcon;
  readonly label: string;
  readonly value: string;
  readonly change?: number;
  readonly changeLabel?: string;
  readonly color?: "primary" | "success" | "accent" | "warning" | string;
}

const colorClasses: Record<string, string> = {
  primary: "text-primary",
  success: "text-success",
  accent: "text-accent",
  warning: "text-warning",
};

export function StatCard({ icon: Icon, label, value, change, changeLabel = "from prior period", color = "primary" }: StatCardProps) {
  const colorClass = colorClasses[color] ?? color;
  return (
    <article className="card p-4" aria-label={label}>
      <div className="flex items-center justify-between gap-3">
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/60 ${colorClass}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        {typeof change === "number" && (
          <span className={change >= 0 ? "text-xs text-success" : "text-xs text-destructive"}>
            {change >= 0 ? "+" : ""}{change}%
          </span>
        )}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      {typeof change === "number" && <p className="mt-1 text-xs text-muted-foreground">{changeLabel}</p>}
    </article>
  );
}

