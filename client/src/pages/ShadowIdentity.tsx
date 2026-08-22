import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Ghost, ShieldAlert } from "lucide-react";

const REQUIREMENTS = [
  "Persisted identity-mode and verified-reveal state with ownership controls",
  "Documented privacy model and server-side authorization boundaries",
  "Reputation calculation from auditable events rather than seed values",
  "Leaderboard visibility, consent, and anti-manipulation controls",
  "Integration tests for identity changes, privacy, and score integrity",
] as const;

export default function ShadowIdentity() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-black p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black p-8 text-white">
        <Card className="w-full max-w-md border-gray-700 bg-gray-900">
          <CardHeader><CardTitle className="flex items-center gap-2"><Ghost className="h-5 w-5 text-purple-400" />Shadow Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to view account-scoped identity controls.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <Ghost className="h-7 w-7 text-purple-400" />
          <h1 className="text-3xl font-bold">Shadow Identity</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Shadow identity service unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  No verified identity-mode, reveal, reputation, or leaderboard service is currently exposed. This page does not display synthetic shadow IDs, trust tiers, reputation scores, leaderboard entries, relationship metrics, or successful privacy-setting changes.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-700 bg-gray-900">
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-3">
                <span className="text-sm text-gray-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-gray-500">
          No identity query, reputation calculation, leaderboard query, mode mutation, reveal mutation, or synthetic success path is initiated by this page. Any future activation requires privacy review, persistence, authorization tests, and auditable score derivation.
        </p>
      </div>
    </main>
  );
}
