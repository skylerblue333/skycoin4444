import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Authenticated story-feed retrieval and ownership checks",
  "Verified media storage, scanning, and content moderation",
  "Age-gating and restricted-content policy enforcement",
  "Persisted views, reactions, replies, and sharing",
  "Story creation, expiry, and failure handling",
] as const;

export default function Stories() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-background p-8">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-8">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle>Stories</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to view account-scoped stories.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Stories</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Stories unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No verified story-feed or media backend is currently exposed. This page does not display mock creators, story text, media URLs, view counts, reactions, live status, trending rankings, restricted-content claims, or successful story creation and viewing events.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
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
          No story-feed request, media operation, age verification, view mutation, reaction, reply, upload, or synthetic success path is initiated by this page. Any future activation requires server-side authorization, media validation, moderation, expiry, and tested restricted-content handling.
        </p>
      </div>
    </main>
  );
}
