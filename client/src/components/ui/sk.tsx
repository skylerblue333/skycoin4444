import type { ComponentType, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export { StatCard } from "@/components/StatCard";

type IconTileProps = {
  icon: LucideIcon | ReactNode;
  label: string;
  description?: string;
  className?: string;
};

export function IconTile({
  icon,
  label,
  description,
  className,
}: IconTileProps) {
  const Icon =
    typeof icon === "function"
      ? (icon as ComponentType<{ className?: string }>)
      : null;
  const iconNode = Icon ? null : (icon as ReactNode);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border bg-card p-4 text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {Icon ? <Icon className="h-4 w-4" /> : iconNode}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
