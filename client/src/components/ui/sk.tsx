import type { ComponentType, HTMLAttributes, ReactNode } from "react";
import { Card } from "./card";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/StatCard";

export { Card, StatCard };

interface IconTileProps extends HTMLAttributes<HTMLDivElement> {
  icon: ComponentType<{ className?: string }>;
  label?: string;
  children?: ReactNode;
}

export function IconTile({ icon: Icon, label, children, className, ...props }: IconTileProps) {
  return (
    <div className={cn("flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3", className)} {...props}>
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      {label ? <span className="text-sm font-medium">{label}</span> : null}
      {children}
    </div>
  );
}
