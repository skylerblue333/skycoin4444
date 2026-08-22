import type { ReactNode } from "react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ title = "Nothing here yet", description, children }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-border p-8 text-center">
      <h2 className="font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-sm text-muted-foreground">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

export default EmptyState;
