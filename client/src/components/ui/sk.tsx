import type { ComponentType, ReactNode } from "react";
import { Card as BaseCard } from "./card";
import { StatCard as BaseStatCard, type StatCardProps } from "../StatCard";

export const Card = BaseCard;
export const StatCard = BaseStatCard;

export type IconTileProps = {
  icon: ComponentType<{ className?: string }>;
  label?: string;
  className?: string;
  children?: ReactNode;
};

export function IconTile({ icon: Icon, label, className = "", children }: IconTileProps) {
  return (
    <div className={`flex items-center gap-2 rounded-lg border border-border/50 bg-card/60 p-2 ${className}`}>
      <Icon className="h-4 w-4" />
      {label ? <span className="text-sm">{label}</span> : null}
      {children}
    </div>
  );
}

export type { StatCardProps };
