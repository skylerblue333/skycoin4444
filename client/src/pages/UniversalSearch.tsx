import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "A versioned search contract covering supported resource types",
  "Authorization-aware result filtering and tenant isolation",
  "Indexed data sources with freshness and ranking guarantees",
  "Result links that resolve to verified resource identifiers",
  "Loading, empty, error, and retry behavior backed by integration tests",
] as const;

export default function UniversalSearch() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#0a0a0f] p-8 text-slate-100">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f] p-8 text-slate-100">
        <Card className="w-full max-w-md border-slate-800 bg-slate-950/70">
          <CardHeader><CardTitle>Universal Search</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to search account-scoped resources.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] p-4 text-slate-100 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Universal Search</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Search service unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              No verified cross-resource search contract is currently exposed. This page does not display synthetic trending terms, recent searches, creators, posts, tokens, communities, games, marketplace items, tournaments, charity metrics, or fallback result cards.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-950/70">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 p-3">
                <span className="text-sm text-slate-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No global-search request, synthetic ranking, fabricated result count, or navigation to unverified resources is initiated by this page. Any future activation requires a typed server contract and authorization-aware integration tests.
        </p>
      </div>
    </main>
  );
}
