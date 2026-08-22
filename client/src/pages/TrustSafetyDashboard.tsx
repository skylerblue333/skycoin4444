import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Authenticated trust-score calculation with documented inputs",
  "Moderation rules with authorized administration",
  "Persisted moderation actions and appeal handling",
  "Redacted audit log with retention policy",
  "Measured rate-limit telemetry and alerting",
] as const;

export default function TrustSafetyDashboard() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-gray-800 bg-gray-900">
          <CardHeader><CardTitle>Trust & Safety</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to view account-scoped trust and safety information.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Trust & Safety</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-red-400/30 bg-red-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-100">Trust and safety telemetry unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              No verified trust-safety procedures are currently exposed. This page does not display trust scores, risk levels, moderation rules, moderation actions, audit events, rate-limit counts, security conclusions, or claims that content has been reviewed.
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-gray-800 bg-black/20 p-3">
                <span className="text-sm text-gray-300">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-gray-500">
          No moderation mutation, audit query, score calculation, or rate-limit request is initiated by this page. Future activation requires authorization tests, privacy review, redaction, retention controls, appeal paths, and measurable operational evidence.
        </p>
      </div>
    </main>
  );
}
