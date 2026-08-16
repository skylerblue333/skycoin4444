import { AlertTriangle } from "lucide-react";

export function UnavailableFeature({
  name,
  reason = "This capability is not connected to a verified backend integration yet.",
}: {
  name: string;
  reason?: string;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-background p-6">
      <section
        className="w-full max-w-2xl rounded-xl border border-dashed border-border bg-card p-8 text-center shadow-sm"
        role="status"
        aria-live="polite"
      >
        <AlertTriangle
          className="mx-auto mb-4 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Not available in production
        </p>
        <h1 className="text-2xl font-semibold">{name}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
          {reason}
        </p>
        <p className="mx-auto mt-4 max-w-lg text-xs text-muted-foreground">
          SKYCOIN4444 will not display simulated data or claim a successful
          operation until the integration is verified.
        </p>
      </section>
    </main>
  );
}

export default UnavailableFeature;
