/*
 * Activity evidence beta boundary: account-owned persisted events only.
 * This is not analytics, popularity, revenue, or blockchain activity.
 */
import {
  Activity,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function eventTone(type: string) {
  if (type === "lesson_completed") return "text-blue-200 bg-blue-300/10";
  if (type === "feedback_submitted") return "text-amber-200 bg-amber-300/10";
  if (type === "post_created") return "text-violet-200 bg-violet-300/10";
  if (type === "privacy_request") return "text-emerald-200 bg-emerald-300/10";
  return "text-lime-200 bg-lime-300/10";
}

export default function ActivityEvidence() {
  const { user, loading } = useAuth();
  const events = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-52 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-lime-300/25 bg-lime-300/[0.04] text-lime-100"
              >
                Account evidence
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Latest 50 maximum
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              What your account actually recorded
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              This view combines bounded records from your posts, lesson
              progress, feedback, discovery actions, creator briefs, and privacy
              requests. It does not infer audience size, engagement, uptime,
              revenue, rankings, balances, or blockchain activity.
            </p>
          </div>

          {user ? (
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
              onClick={() => events.refetch()}
              disabled={events.isFetching}
            >
              <RefreshCw
                className={
                  "mr-2 h-4 w-4 " +
                  (events.isFetching ? "animate-spin" : "")
                }
              />
              Refresh evidence
            </Button>
          ) : null}
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-lime-200" />
                Evidence log
              </CardTitle>
              <CardDescription className="text-white/45">
                {user
                  ? events.isLoading
                    ? "Loading account-owned records…"
                    : `${events.data?.length ?? 0} records currently returned`
                  : "Sign in to load account-owned records."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {!user ? (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                    <div>
                      <p className="font-semibold text-amber-100">
                        Evidence is private to the signed-in account
                      </p>
                      <p className="mt-1 text-sm leading-6 text-white/45">
                        Anonymous activity is intentionally not collected or
                        displayed by this account evidence surface.
                      </p>
                    </div>
                  </div>
                  <Link href="/signin">
                    <Button className="mt-4">Open invitation sign in</Button>
                  </Link>
                </div>
              ) : events.isLoading ? (
                <div className="space-y-3">
                  {[0, 1, 2].map(index => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/[0.025]"
                    />
                  ))}
                </div>
              ) : events.error ? (
                <div
                  className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
                  role="alert"
                >
                  Activity evidence could not be loaded. Try refreshing before
                  relying on this screen.
                </div>
              ) : (events.data?.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-white/20" />
                  <p className="mt-3 text-sm text-white/45">
                    No persisted activity evidence is available yet.
                  </p>
                  <p className="mt-1 text-xs leading-5 text-white/30">
                    Complete a lesson, submit feedback, publish a post, save a
                    discovery reference, or create a creator brief.
                  </p>
                </div>
              ) : (
                events.data?.map(event => (
                  <article
                    key={event.id}
                    className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div
                      className={
                        "mt-0.5 rounded-xl p-2.5 " + eventTone(event.type)
                      }
                    >
                      <Clock3 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-semibold text-white">
                          {event.label}
                        </h2>
                        <Badge
                          variant="outline"
                          className="border-white/10 text-[10px] text-white/35"
                        >
                          {event.type.replaceAll("_", " ")}
                        </Badge>
                      </div>
                      <p className="mt-1 break-words text-sm leading-6 text-white/50">
                        {event.detail}
                      </p>
                      <time className="mt-2 block text-xs text-white/25">
                        {new Date(event.createdAt).toLocaleString()}
                      </time>
                    </div>
                  </article>
                ))
              )}
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-lime-300/20 bg-lime-300/[0.04] text-white">
              <CardHeader>
                <ShieldCheck className="h-5 w-5 text-lime-200" />
                <CardTitle className="mt-2 text-lime-100">
                  Scope boundary
                </CardTitle>
                <CardDescription className="text-white/45">
                  The API returns only account-owned records and caps the
                  combined, sorted result at 50.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-white/50">
                <p>No public activity claims</p>
                <p>No inferred popularity or performance metrics</p>
                <p>No wallet, payment, settlement, or chain events</p>
                <p>No provider-wide telemetry claim</p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-base text-white">
                  Create real evidence
                </CardTitle>
                <CardDescription className="text-white/45">
                  These routes write the records used by activation and this log.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {[
                  ["/course-catalog", "Complete a lesson"],
                  ["/activity-feed", "Publish a post"],
                  ["/beta-feedback", "Submit feedback"],
                  ["/privacy-settings", "Review privacy controls"],
                ].map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="rounded-xl border border-white/[0.08] bg-black/20 px-3 py-3 text-sm font-semibold text-white/60 transition hover:border-lime-300/25 hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          This is an evidence log, not a performance dashboard. It does not
          authorize or report payments, wallet actions, transfers, signing,
          settlement, staking, mining, or production-chain execution.
        </section>
      </div>
    </main>
  );
}
