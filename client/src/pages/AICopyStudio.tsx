import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { FileText, Sparkles } from "lucide-react";

const REQUIREMENTS = [
  "Versioned AI generation, improvement, analysis, and translation contracts",
  "Explicit model provenance, prompt policy, and output safety handling",
  "Server-side rate limits, authorization, and cost controls",
  "Persisted history with user ownership and deletion semantics",
  "Tests proving scores, word counts, translations, and output claims are derived from actual responses",
] as const;

export default function AICopyStudio() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-gray-950 p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-950 p-8 text-white">
        <Card className="w-full max-w-md border-gray-700/50 bg-gray-900/60">
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-cyan-400" />AI Copy Studio</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to access account-scoped AI content tools.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <Sparkles className="h-7 w-7 text-cyan-400" />
          <h1 className="text-3xl font-bold">AI Copy Studio</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">AI copy service unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              No verified copy-generation contract is currently exposed. This page does not accept prompts or display synthetic copy, templates, word counts, analysis scores, translations, histories, or claims that output is high-converting, optimized, or produced by a real model.
            </p>
          </CardContent>
        </Card>
        <Card className="border-gray-700/50 bg-gray-900/60">
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-gray-700/50 bg-gray-800/30 p-3">
                <span className="text-sm text-gray-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-gray-500">
          No AI query, mutation, clipboard write, score calculation, translation, template lookup, or synthetic success path is initiated by this page. Any future activation requires a typed server contract, explicit model provenance, safety controls, and integration tests.
        </p>
      </div>
    </main>
  );
}
