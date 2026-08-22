import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Brain, ShieldAlert } from "lucide-react";

const REQUIREMENTS = [
  "Versioned server-side chat contract with authenticated ownership",
  "Explicit model provenance, availability, and safety policy",
  "Persisted conversation lifecycle with deletion and retention controls",
  "Rate limits, abuse handling, and prompt/output privacy boundaries",
  "Tests for chat responses, history persistence, and failure states",
] as const;

export default function HopeAI() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-400" />HopeAI</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to access account-scoped AI services.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <Brain className="h-7 w-7 text-purple-400" />
          <h1 className="text-3xl font-bold">HopeAI</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">HopeAI service unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No verified chat, model, history, or gray-area analysis contract is currently exposed. This page does not accept prompts or display synthetic responses, companion personas, model names, usage claims, saved conversations, emotional inferences, safety analysis, or successful AI actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 p-3">
                <span className="text-sm text-muted-foreground">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-muted-foreground">
          No chat mutation, history query, persistence mutation, analysis request, signal capture, model selection, or synthetic success path is initiated by this page. Any future activation requires a typed backend contract, explicit model provenance, and AI safety tests.
        </p>
      </div>
    </main>
  );
}
