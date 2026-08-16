export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading table">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-12 animate-pulse rounded-md bg-muted/40"
        />
      ))}
      <span className="sr-only">Loading table data</span>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading page">
      <div className="h-8 w-1/3 animate-pulse rounded bg-muted/40" />
      <div className="h-32 animate-pulse rounded-xl bg-muted/40" />
      <TableSkeleton rows={4} />
      <span className="sr-only">Loading page</span>
    </div>
  );
}
