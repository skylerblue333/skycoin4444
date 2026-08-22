import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

const colorClasses = {
  primary: "text-primary bg-primary/10",
  success: "text-emerald-500 bg-emerald-500/10",
  accent: "text-cyan-500 bg-cyan-500/10",
  warning: "text-amber-500 bg-amber-500/10",
} as const;

type StatColor = keyof typeof colorClasses;

interface StatCardProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color?: StatColor;
}

export function StatCard({ icon: Icon, label, value, color = "primary" }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded-lg", colorClasses[color])}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
