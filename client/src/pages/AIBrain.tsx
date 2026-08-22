import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const CAPABILITIES = [
  "Authenticated AI chat",
  "Code generation and review",
  "Educational lesson generation",
  "Configured provider model discovery",
  "Evaluation and safety telemetry",
] as const;

export default function AIBrain() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-white">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>AI Brain</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped AI capabilities.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold">AI Brain</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
          </div>
          <p className="text-muted-foreground">A transparent boundary for model-backed chat, code, and learning features.</p>
        </header>

        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">AI services unavailable</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              No verified AI router is currently exposed for this application. This page does not claim model superiority, module accuracy, live AI status, generated code, educational output, provider availability, or evaluation metrics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <div key={capability} className="flex items-center justify-between rounded-lg border border-border/50 bg-card/60 p-3">
                <span className="text-sm text-muted-foreground">{capability}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs leading-5 text-muted-foreground">
          No prompt, code, personal data, or provider request is sent by this page. Any future AI implementation must expose authenticated procedures, protect sensitive inputs, identify model provenance, handle failures, and publish measured evaluation evidence rather than hard-coded claims.
        </p>
      </div>
    </main>
  );
}
