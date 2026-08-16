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
  badgeVariant?: "default" | "destructive" | "secondary" | "outline";
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
    <div className="mb-8 flex flex-wrap items-start gap-4">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        {Icon ? (
          <div className="mt-1 rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
        <div className="min-w-0">
          {backHref ? (
            <Link
              href={backHref}
              className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back
            </Link>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold">{title}</h1>
            {badge ? (
              <span
                data-variant={badgeVariant}
                className="rounded-full border px-2 py-0.5 text-xs font-medium"
              >
                {badge}
              </span>
            ) : null}
          </div>
          {supportingText ? (
            <p className="mt-2 text-muted-foreground">{supportingText}</p>
          ) : null}
          {children}
        </div>
      </div>
      {actions ? (
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}

export default PageHeader;
