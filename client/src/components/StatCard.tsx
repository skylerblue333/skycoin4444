import type { ComponentType, ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatCardColor =
  | "primary"
  | "success"
  | "accent"
  | "warning"
  | "cyan"
  | "purple"
  | "green"
  | "emerald"
  | "violet"
  | "yellow";

type StatCardProps = {
  icon?: ComponentType<{ className?: string }> | ReactNode;
  label: string;
  value: ReactNode;
  change?: number;
  changeLabel?: string;
  color?: StatCardColor;
  accent?: StatCardColor;
  className?: string;
};

const accentClasses: Record<StatCardColor, string> = {
  primary: "border-primary/30 bg-primary/5 text-primary",
  success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-500",
  accent: "border-violet-500/30 bg-violet-500/5 text-violet-500",
  warning: "border-amber-500/30 bg-amber-500/5 text-amber-500",
  cyan: "border-cyan-500/30 bg-cyan-500/5 text-cyan-500",
  purple: "border-purple-500/30 bg-purple-500/5 text-purple-500",
  green: "border-green-500/30 bg-green-500/5 text-green-500",
  emerald: "border-emerald-500/30 bg-emerald-500/5 text-emerald-500",
  violet: "border-violet-500/30 bg-violet-500/5 text-violet-500",
  yellow: "border-yellow-500/30 bg-yellow-500/5 text-yellow-500",
};

function MetricIcon({ icon }: Pick<StatCardProps, "icon">) {
  if (!icon) return null;
  if (typeof icon === "function") {
    const Icon = icon;
    return <Icon className="h-4 w-4" />;
  }
  return icon;
}

export function StatCard({
  icon,
  label,
  value,
  change,
  changeLabel,
  color,
  accent,
  className,
}: StatCardProps) {
  const selectedAccent = accent ?? color ?? "primary";
  const hasChange = typeof change === "number" && Number.isFinite(change);
  const isPositive = (change ?? 0) >= 0;

  return (
    <section
      aria-label={label}
      className={cn(
        "rounded-xl border p-4 shadow-sm",
        accentClasses[selectedAccent],
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        {icon ? (
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-current/20 bg-background/40">
            <MetricIcon icon={icon} />
          </div>
        ) : null}
      </div>
      {hasChange ? (
        <p
          className={cn(
            "mt-3 flex items-center gap-1 text-xs font-medium",
            isPositive ? "text-emerald-600" : "text-red-600"
          )}
        >
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{`${isPositive && change > 0 ? "+" : ""}${change}%`}</span>
          {changeLabel ? (
            <span className="font-normal text-muted-foreground">
              {changeLabel}
            </span>
          ) : null}
        </p>
      ) : null}
    </section>
  );
}
