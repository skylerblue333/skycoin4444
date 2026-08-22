export interface PageSkeletonProps {
  readonly rows?: number;
}

function SkeletonBar({ className = "" }: { readonly className?: string }) {
  return <div className={`animate-pulse rounded bg-muted/50 ${className}`} aria-hidden="true" />;
}

export function PageSkeleton({ rows = 4 }: PageSkeletonProps) {
  return (
    <div className="space-y-4" role="status" aria-label="Loading page">
      <SkeletonBar className="h-8 w-1/3" />
      <SkeletonBar className="h-4 w-2/3" />
      {Array.from({ length: rows }, (_, index) => <SkeletonBar key={index} className="h-16 w-full" />)}
      <span className="sr-only">Loading</span>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: PageSkeletonProps) {
  return (
    <div className="space-y-2" role="status" aria-label="Loading table">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex gap-3 rounded-lg border border-border/50 p-3">
          <SkeletonBar className="h-8 w-8 shrink-0" />
          <SkeletonBar className="h-8 flex-1" />
          <SkeletonBar className="h-8 w-24" />
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

