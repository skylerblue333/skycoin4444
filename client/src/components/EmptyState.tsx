export interface EmptyStateProps {
  readonly title: string;
  readonly hint?: string;
}

export function EmptyState({ title, hint }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-12 text-center" role="status">
      <p className="font-medium text-white/70">{title}</p>
      {hint && <p className="mt-1 text-sm text-white/40">{hint}</p>}
    </div>
  );
}

