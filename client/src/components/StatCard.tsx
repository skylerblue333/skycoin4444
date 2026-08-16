import type { ComponentType, ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export type StatCardProps = {
  icon?: ComponentType<{ className?: string }> | ReactNode;
  label: string;
  value: ReactNode;
  change?: number;
  changeLabel?: string;
  color?: "primary" | "success" | "accent" | "warning";
};

const colorClasses = {
  primary: "border-primary/30 bg-primary/5",
  success: "border-emerald-500/30 bg-emerald-500/5",
  accent: "border-cyan-500/30 bg-cyan-500/5",
  warning: "border-amber-500/30 bg-amber-500/5",
} as const;

export function StatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  color = "primary",
}: StatCardProps) {
  const renderedIcon =
    typeof icon === "function"
      ? (() => {
          const Icon = icon as ComponentType<{ className?: string }>;
          return <Icon className="h-5 w-5" />;
        })()
      : icon;

  return (
    <section
      className={`rounded-xl border p-4 shadow-sm ${colorClasses[color]}`}
      aria-label={label}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        {renderedIcon ? (
          <div className="rounded-lg bg-background/60 p-2" aria-hidden="true">
            {renderedIcon}
          </div>
        ) : null}
      </div>
      {typeof change === "number" ? (
        <p
          className={`mt-3 flex items-center gap-1 text-xs ${change >= 0 ? "text-emerald-500" : "text-rose-500"}`}
        >
          {change >= 0 ? (
            <ArrowUpRight className="h-3.5 w-3.5" />
          ) : (
            <ArrowDownRight className="h-3.5 w-3.5" />
          )}
          <span>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
          {changeLabel ? (
            <span className="text-muted-foreground">{changeLabel}</span>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}

export default StatCard;
