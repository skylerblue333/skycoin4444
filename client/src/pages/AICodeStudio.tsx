import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Code2, ShieldAlert } from "lucide-react";

const REQUIREMENTS = [
  "Versioned code-generation and analysis contracts",
  "Server-side model access, authorization, rate limits, and cost controls",
  "Sandboxed execution and security scanning for generated code",
  "Persisted sessions, logs, artifacts, and ownership controls",
  "Tests proving generated code is reviewed and never presented as production-ready by default",
] as const;

export default function AICodeStudio() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Code2 className="h-5 w-5 text-purple-400" />AI Code Studio</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to access account-scoped development tools.</p>
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
          <Code2 className="h-7 w-7 text-purple-400" />
          <h1 className="text-3xl font-bold">AI Code Studio</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">AI coding services unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  No verified code-generation, analysis, execution, or autonomous-agent service is currently exposed. This page does not display synthetic bots, generated code, line counts, model claims, logs, sessions, push history, test results, or production-readiness assertions.
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
          No AI query, SSE stream, mutation, autonomous cycle, code execution, clipboard write, download, or synthetic success path is initiated by this page. Any future activation requires a typed server contract, sandboxing, explicit model provenance, and security tests.
        </p>
      </div>
    </main>
  );
}
