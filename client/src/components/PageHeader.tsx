import type { ComponentType, ReactNode } from "react";
import { Link } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariantClasses = {
  default: "border-primary/15 bg-primary/10 text-primary",
  secondary: "border-border bg-secondary text-secondary-foreground",
  success: "border-emerald-500/15 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  warning: "border-amber-500/15 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  destructive: "border-destructive/15 bg-destructive/10 text-destructive",
  outline: "border-border bg-background/60 text-foreground",
} as const;

type BadgeVariant = keyof typeof badgeVariantClasses;

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  badge?: ReactNode;
  badgeVariant?: BadgeVariant | string;
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
  badgeVariant = "default",
  icon: Icon,
  backHref,
  actions,
  children,
}: PageHeaderProps) {
  const badgeClass = badgeVariantClasses[badgeVariant as BadgeVariant] ?? badgeVariantClasses.default;

  return (
    <header className="relative mb-7 overflow-hidden rounded-2xl border border-border/70 bg-card/85 p-4 shadow-sm backdrop-blur-xl sm:p-5 md:mb-8 md:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(99,102,241,.12),transparent_34%),radial-gradient(circle_at_92%_0%,rgba(14,165,233,.08),transparent_28%)]" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          {backHref ? (
            <Link href={backHref} className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-1 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
          ) : null}

          <div className="flex min-w-0 flex-wrap items-center gap-3">
            {Icon ? (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
                <Icon className="h-5 w-5" />
              </span>
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-primary/10 bg-primary/10 text-primary shadow-sm">
                <Sparkles className="h-5 w-5" />
              </span>
            )}

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="min-w-0 text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h1>
                {badge ? (
                  <span className={cn("shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", badgeClass)}>
                    {badge}
                  </span>
                ) : null}
              </div>
              {(description || subtitle) ? (
                <p className={cn("mt-1.5 max-w-3xl leading-6 text-muted-foreground", subtitle ? "text-sm" : "text-sm md:text-base")}>{description ?? subtitle}</p>
              ) : null}
            </div>
          </div>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2 md:justify-end">{actions}</div> : null}
      </div>
    </header>
  );
}

export default PageHeader;
