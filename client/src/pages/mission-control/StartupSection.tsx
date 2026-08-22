import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Rocket } from "lucide-react";
import { GOLD } from "./shared";

const REQUIREMENTS = [
  "Persisted startup blueprint schema and ownership checks",
  "Server-side generation contract with traceable model output",
  "Input validation, rate limits, and failure handling",
  "Versioned blueprint revisions and export behavior",
  "Tests proving generated content is not presented as verified business evidence",
] as const;

export function StartupSection() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div className="text-sm text-white/60">Loading account state…</div>;

  if (!isAuthenticated || !user) {
    return (
      <Card className="border-white/10 bg-white/[0.02]">
        <CardHeader><CardTitle className="flex items-center gap-2 text-white"><Rocket className="h-4 w-4" style={{ color: GOLD }} />Startup Builder</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/60">Sign in to view account-scoped startup workspaces.</p>
          <Button onClick={() => startLogin()}>Sign in</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-amber-400/30 bg-amber-400/[0.04]">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="flex items-center gap-2 text-white"><Rocket className="h-4 w-4" style={{ color: GOLD }} />Startup Builder</CardTitle>
        <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-amber-100">Startup blueprint service unavailable</h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            No verified startup blueprint service is currently exposed. This panel does not accept an idea, call an unsupported procedure, or display synthetic business plans, branding, marketing, roadmaps, team plans, traction, funding, or other generated claims as evidence.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {REQUIREMENTS.map((requirement) => (
            <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
              <span className="text-sm text-white/70">{requirement}</span>
              <Badge variant="secondary">Unavailable</Badge>
            </div>
          ))}
        </div>
        <p className="text-xs leading-5 text-white/40">
          No startup query, generation mutation, cache invalidation, or synthetic success path is initiated by this component. Any future activation requires a typed server contract, persisted ownership, explicit AI provenance, and integration tests.
        </p>
      </CardContent>
    </Card>
  );
}
