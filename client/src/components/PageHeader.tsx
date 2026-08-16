import React from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  backHref?: string;
  icon?: React.ComponentType<{ className?: string }>;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  badgeVariant?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, subtitle, backHref, icon: Icon, actions, badge, badgeVariant, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {backHref && (
            <Link href={backHref} aria-label="Go back" className="mt-1 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
          {Icon && <Icon className="mt-1 h-7 w-7 text-primary" aria-hidden="true" />}
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {(description || subtitle) && <p className="text-muted-foreground">{description ?? subtitle}</p>}
            {badge && <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-xs ${badgeVariant ?? "border-primary/30 text-primary"}`}>{badge}</span>}
          </div>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}

export default PageHeader;
