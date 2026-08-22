import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Authenticated workspace and membership authorization",
  "Persisted channels, messages, tasks, and file metadata",
  "Real-time delivery with ordering and retry handling",
  "Role-based administration and invitation controls",
  "Evidence-backed analytics from stored activity",
] as const;

export default function TeamWorkspace() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#050510] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050510] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Team Workspace</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-white/60">Sign in to view account-scoped workspace information.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Team Workspace</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Workspace services unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">
              No verified workspace, collaboration, or file service is currently exposed. This page does not display demo channels, messages, members, tasks, files, activity analytics, online presence, or claims that messages were sent or invitations were delivered.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="text-sm text-white/70">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-white/40">
          No community query, message mutation, task mutation, file operation, invitation, presence request, or synthetic success path is initiated by this page. Any future activation requires tenant isolation, authorization tests, persistence, realtime delivery, and auditability.
        </p>
      </div>
    </main>
  );
}
