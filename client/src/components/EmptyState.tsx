import type { ComponentType, ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ComponentType<{ className?: string }> | string;
  children?: ReactNode;
}

export function EmptyState({ title = "Nothing here yet", description, icon: Icon, children }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      {typeof Icon === "string" ? (
        <div className="mb-3 text-2xl" aria-hidden="true">{Icon}</div>
      ) : Icon ? (
        <Icon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
      ) : null}
      <h2 className="font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export default EmptyState;
