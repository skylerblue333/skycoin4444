import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Brain } from "lucide-react";

const REQUIREMENTS = [
  "Persisted persona identities with explicit provenance and ownership",
  "Server-side execution with authorization and resource limits",
  "Moderation, consent, and disclosure for AI-generated social activity",
  "Auditable behavior, relationship, and memory state",
  "Tests proving simulated activity cannot appear as real-user engagement",
] as const;

export default function AIPersonaSystem() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-purple-400" />AI Persona System</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped AI systems.</p>
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
          <h1 className="text-3xl font-bold">AI Persona System</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Persona simulation unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified persona execution, storage, moderation, or disclosure service is currently exposed. This page does not run a simulated world or display seed personas, follower counts, reputation scores, relationships, trending terms, behavior events, or autonomous social activity as real ecosystem activity.
            </p>
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
          No persona tick, timer, generated post, reply, reaction, relationship update, metric calculation, or synthetic success path is initiated by this page. Any future activation requires explicit AI labeling, moderation, persistence, and tests separating simulation from real-user activity.
        </p>
      </div>
    </main>
  );
}
