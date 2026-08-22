export function PageSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-24 animate-pulse rounded bg-muted" />
      <div className="h-48 animate-pulse rounded bg-muted" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading table">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-10 animate-pulse rounded bg-muted" />
      ))}
    </div>
  );
}

export default PageSkeleton;
