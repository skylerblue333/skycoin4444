import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Authenticated feed retrieval",
  "Translation provider and supported language contract",
  "Persisted likes, comments, and shares",
  "Content moderation and abuse handling",
  "Translation loading, failure, and retry states",
] as const;

export function TranslationEnabledSocialFeed() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-slate-950 p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-8 text-white">
        <Card className="w-full max-w-md border-slate-700 bg-slate-900">
          <CardHeader><CardTitle>Global Social Feed</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to view account-scoped social content.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Global Social Feed</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Translated feed unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              No verified feed or translation backend is currently exposed. This page does not display mock posts, translated text, authors, timestamps, likes, comments, shares, or claims that content was automatically translated.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-slate-700 bg-black/20 p-3">
                <span className="text-sm text-slate-300">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No social-feed request, translation request, or engagement mutation is initiated by this page. Any future activation requires real source content, language detection, provider attribution, moderation, persistence, and tested failure handling.
        </p>
      </div>
    </main>
  );
}

export default TranslationEnabledSocialFeed;
