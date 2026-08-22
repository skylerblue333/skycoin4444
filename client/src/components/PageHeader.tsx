import type { ComponentType, ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  backHref?: string;
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({
  title,
  description,
  subtitle,
  badge,
  icon: Icon,
  backHref,
  actions,
  children,
}: PageHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div className="min-w-0">
        {backHref ? (
          <Link href={backHref} className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        ) : null}
        <div className="flex items-center gap-3">
          {Icon ? <Icon className="h-7 w-7 shrink-0 text-primary" /> : null}
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {badge ? <span className="shrink-0">{badge}</span> : null}
        </div>
        {(description || subtitle) ? (
          <p className={cn("mt-2 text-muted-foreground", subtitle && "text-sm")}>{description ?? subtitle}</p>
        ) : null}
        {children}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

export default PageHeader;
