import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Lock } from "lucide-react";

const REQUIREMENTS = [
  "Canonical authenticated conversation and message procedures",
  "Persisted message ownership, deletion, and read-state semantics",
  "Explicit transport and encryption guarantees verified by implementation",
  "Validated attachments with scanning and storage authorization",
  "Integration tests for send, receive, retry, and failure states",
] as const;

export default function Messages() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#0a0614] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0a0614] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-purple-400" />Messages</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to view account-scoped conversations.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0614] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Messages</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Canonical messaging service unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              The canonical repository does not expose the conversation procedures required by this page. It therefore does not display synthetic conversations, unread counts, presence, message content, encryption claims, or successful sends, edits, deletions, uploads, calls, or disappearing-message actions.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-white/[0.03]">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="text-sm text-slate-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No DM query, mutation, upload, encryption assertion, or synthetic success path is initiated by this page. ShadowChat-Core remains the primary product for the separately implemented messaging workflow; any canonical activation requires shared typed contracts and integration tests.
        </p>
      </div>
    </main>
  );
}
