import type { ComponentType, ReactNode } from "react";
import { Card } from "./card";
import { StatCard } from "../StatCard";

export { Card, StatCard };

export function IconTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label?: string;
  value?: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card/60 p-3">
      <Icon className="h-5 w-5" aria-hidden="true" />
      <div>
        {label ? (
          <p className="text-xs text-muted-foreground">{label}</p>
        ) : null}
        {value !== undefined ? <p className="font-medium">{value}</p> : null}
      </div>
    </div>
  );
}
