import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";
import { Bell, ShieldAlert } from "lucide-react";

const REQUIREMENTS = [
  "Persisted notification feed with authenticated ownership",
  "Documented prioritization and batching rules derived from real events",
  "Verified AI-summary provenance and failure handling",
  "Read-state mutation with authorization and idempotency",
  "Analytics derived from stored notification events and tested calculations",
] as const;

export default function NotificationIntelligence() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <main className="min-h-screen bg-[#07050f] p-8 text-white">Loading account state…</main>;

  if (!isAuthenticated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07050f] p-8 text-white">
        <Card className="w-full max-w-md border-gray-800 bg-gray-900">
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-purple-400" />Notification Intelligence</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-400">Sign in to view account-scoped notifications.</p>
            <Button onClick={() => startLogin()} className="w-full">Sign in</Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07050f] p-4 text-white md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-center gap-3">
          <Bell className="h-7 w-7 text-purple-400" />
          <h1 className="text-3xl font-bold">Notification Intelligence</h1>
          <Badge variant="outline" className="border-amber-400/50 text-amber-200">Unavailable</Badge>
        </header>
        <Card className="border-amber-400/30 bg-amber-400/[0.06]">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-1 h-5 w-5 shrink-0 text-amber-300" />
              <div>
                <h2 className="text-xl font-semibold text-amber-100">Notification intelligence unavailable</h2>
                <p className="mt-2 text-sm leading-6 text-gray-300">
                  No verified notification-feed, AI-summary, analytics, or read-state service is currently exposed. This page does not display synthetic notifications, unread counts, priority scores, batch counts, AI summaries, read rates, average read times, or successful mark-read actions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-gray-800 bg-gray-900">
          <CardHeader><CardTitle>Required controls before activation</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {REQUIREMENTS.map((requirement) => (
              <div key={requirement} className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-800/50 p-3">
                <span className="text-sm text-gray-400">{requirement}</span>
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <p className="text-xs leading-5 text-gray-500">
          No notification query, AI summary request, analytics calculation, read mutation, or synthetic success path is initiated by this page. Any future activation requires typed contracts, persisted events, provenance, and authorization tests.
        </p>
      </div>
    </main>
  );
}
