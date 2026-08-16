import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <section
      className="rounded-xl border border-dashed border-border p-8 text-center"
      aria-live="polite"
    >
      {icon ? (
        <div className="mb-3 flex justify-center text-muted-foreground">
          {icon}
        </div>
      ) : null}
      <h2 className="text-base font-medium">{title}</h2>
      {description || hint ? (
        <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
          {description ?? hint}
        </p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}

export default EmptyState;
