import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

const REQUIREMENTS = [
  "Persisted video and live-stream catalog",
  "Authenticated upload and ownership controls",
  "CDN/HLS playback with availability checks",
  "Verified views, likes, comments, and trending calculations",
  "Moderation, retention, and content-reporting workflows",
] as const;

export default function VideoArea() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-white/10 bg-[#0e0a1a]">
          <CardHeader><CardTitle>Sky Video</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-400">Sign in to view account-scoped video content.</p>
            <Button onClick={() => startLogin()}>Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold">Sky Video</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-amber-100">Video services unavailable</h2>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              No verified video, live-stream, upload, or playback backend is currently exposed. This page does not display mock reels, video titles, creators, view counts, likes, live viewer counts, trending rankings, thumbnails, or upload success claims.
            </p>
          </CardContent>
        </Card>
        <Card className="border-white/10 bg-[#0e0a1a]">
          <CardHeader><CardTitle>Required capabilities before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 p-3">
                <span className="text-sm text-slate-300">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-slate-500">
          No video query, upload, CDN request, playback, engagement mutation, or ranking calculation is initiated by this page. Any future activation requires signed media access, file validation, moderation, retention controls, and tested failure states.
        </p>
      </div>
    </main>
  );
}
