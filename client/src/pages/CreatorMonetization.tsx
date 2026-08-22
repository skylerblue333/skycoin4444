import { DollarSign, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";

export default function CreatorMonetization() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md text-center">
          <DollarSign className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <h2 className="mb-2 text-2xl font-bold">Creator Monetization</h2>
          <p className="mb-6 text-muted-foreground">Sign in to view creator tools when verified accounting integrations are available.</p>
          <Button asChild className="bg-green-600 hover:bg-green-500">
            <a href={getLoginUrl()}>Sign in</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Creator Monetization"
        subtitle="Verified revenue and payout reporting is not available in this deployment."
      />
      <div className="container max-w-3xl py-10">
        <section className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-6" aria-labelledby="creator-monetization-status">
          <div className="mb-4 flex items-center gap-3">
            <ShieldAlert className="h-6 w-6 text-amber-300" aria-hidden="true" />
            <h2 id="creator-monetization-status" className="text-xl font-semibold">Reporting unavailable</h2>
          </div>
          <p className="text-muted-foreground">
            This screen does not display estimates, placeholder balances, synthetic charts, payout history, subscriber counts, or AI growth advice. A real implementation requires a verified ledger, payment provider integration, and authenticated creator data source.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            No financial figures are shown until those dependencies are implemented and tested. Existing creator pages that depend on the same unavailable contract remain separately tracked in the audit backlog.
          </p>
        </section>
      </div>
    </div>
  );
}
