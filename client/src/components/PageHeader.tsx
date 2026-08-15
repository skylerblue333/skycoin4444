import React from "react";
import { ArrowLeft } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  icon?: LucideIcon;
  backHref?: string;
  badge?: string;
  badgeVariant?: "default" | "destructive";
  actions?: React.ReactNode;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  subtitle,
  icon: Icon,
  backHref,
  badge,
  badgeVariant = "default",
  actions,
  children,
}: PageHeaderProps) {
  const supportingText = description ?? subtitle;

  return (
    <div className="mb-8">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
      ) : null}
      <div className="flex items-start gap-3">
        {Icon ? <Icon className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" /> : null}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {badge ? (
              <span
                className={
                  badgeVariant === "destructive"
                    ? "rounded-full bg-destructive/15 px-2.5 py-1 text-xs font-medium text-destructive"
                    : "rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary"
                }
              >
                {badge}
              </span>
            ) : null}
          </div>
          {supportingText ? (
            <p className="mt-2 text-muted-foreground">{supportingText}</p>
          ) : null}
        </div>
        {actions ? <div className="ml-auto shrink-0">{actions}</div> : null}
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
