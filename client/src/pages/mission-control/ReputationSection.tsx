import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Account reputation score",
  "Category-level activity scores",
  "Leaderboard rankings",
  "Reputation recomputation",
] as const;

export function ReputationSection() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <p className="text-sm text-white/50">Loading account state…</p>;

  if (!isAuthenticated || !user) {
    return (
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="text-white">Reputation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/50">Sign in to view account-scoped reputation information.</p>
          <Button onClick={() => startLogin()}>Sign in</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-bold text-white">Reputation</h2>
        <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
      </header>
      <Card className="border-amber-400/30 bg-amber-400/[0.06]">
        <CardContent className="p-6">
          <h3 className="font-semibold text-amber-100">Reputation service unavailable</h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            No verified reputation backend is currently exposed. This page does not display an overall score, category scores, a leaderboard position, or a claim that scores were computed from real activity.
          </p>
        </CardContent>
      </Card>
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="text-white text-base">Required capabilities before activation</CardTitle></CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {CAPABILITIES.map((capability) => (
            <div key={capability} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <span className="text-sm text-white/70">{capability}</span>
              <Badge variant="secondary">Unavailable</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
