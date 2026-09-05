import { useState } from "react";
import { Link } from "wouter";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Flag,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const journeySteps = [
  {
    id: "profile",
    title: "Profile",
    description: "Save your account-owned profile and privacy choices.",
    href: "/profile",
    action: "Open profile",
    icon: UserRound,
  },
  {
    id: "learning",
    title: "SkySchool",
    description: "Complete a deterministic lesson and persist progress.",
    href: "/course-catalog",
    action: "Open learning",
    icon: BookOpen,
  },
  {
    id: "social",
    title: "Social",
    description: "Publish a bounded post that belongs to this account.",
    href: "/activity-feed",
    action: "Open social",
    icon: MessageSquare,
  },
  {
    id: "feedback",
    title: "Feedback",
    description: "Record one actionable beta observation for the next release.",
    href: "/beta-feedback",
    action: "Send feedback",
    icon: Flag,
  },
] as const;

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const activation = trpc.activation.status.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });
  const activity = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#050510] px-4 py-14 text-white">
        <div className="mx-auto max-w-3xl">
          <Card className="overflow-hidden border-white/10 bg-white/[0.035] text-white">
            <CardHeader className="border-b border-white/[0.07] bg-gradient-to-br from-sky-400/[0.08] via-transparent to-violet-400/[0.08] p-8">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-sky-300/30 bg-sky-300/[0.05] text-sky-100"
                >
                  Account command center
                </Badge>
                <Badge
                  variant="outline"
                  className="border-amber-300/25 text-amber-100"
                >
                  Invitation required
                </Badge>
              </div>
              <CardTitle className="mt-5 text-4xl font-black tracking-tight">
                Sign in to see your real beta progress.
              </CardTitle>
              <CardDescription className="mt-3 max-w-2xl text-base leading-7 text-white/55">
                The dashboard shows account-owned activation evidence and recent
                persisted activity. It does not fabricate users, balances,
                trades, rewards, viewers, matches, or platform-scale metrics.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 p-8 sm:grid-cols-2">
              <Link href="/signin">
                <Button size="lg" className="w-full">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Enter invitation beta
                </Button>
              </Link>
              <Link href="/beta-workspace">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Browse public beta labs
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  const completed = new Map(
    activation.data?.steps.map(step => [step.id, step.complete]) ?? []
  );
  const completedCount = activation.data?.completedCount ?? 1;
  const totalSteps = activation.data?.totalCount ?? 5;
  const percent =
    activation.data?.percent ??
    Math.round((completedCount / Math.max(totalSteps, 1)) * 100);
  const displayName = user.name?.trim() || "Invited beta tester";
  const events = activity.data ?? [];

  async function signOut() {
    setSigningOut(true);
    try {
      await logout();
      window.location.assign("/");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-300/30 bg-emerald-300/[0.05] text-emerald-100"
              >
                Signed-in engineering beta
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/50"
              >
                Account-owned evidence only
              </Badge>
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-sky-200/65">
              Your command center
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
              Welcome back, {displayName}.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/55">
              Continue the real beta journey, inspect what your account has
              persisted, and move directly into the strongest product areas
              without fake activity or placeholder performance numbers.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/onboarding">
              <Button type="button">
                Continue activation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button
              type="button"
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
              disabled={signingOut}
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {signingOut ? "Signing out…" : "Sign out"}
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Card className="border-sky-300/20 bg-sky-300/[0.045] text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardDescription className="text-white/45">
                    Activation
                  </CardDescription>
                  <CardTitle className="mt-1 text-3xl text-white">
                    {activation.isLoading ? "…" : `${percent}%`}
                  </CardTitle>
                </div>
                <CheckCircle2 className="h-6 w-6 text-sky-200" />
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={percent} className="h-2" />
              <p className="mt-3 text-xs leading-5 text-white/40">
                {activation.error
                  ? "Activation evidence is temporarily unavailable."
                  : `${completedCount} of ${totalSteps} persisted gates complete.`}
              </p>
            </CardContent>
          </Card>

          <Card className="border-violet-300/20 bg-violet-300/[0.045] text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardDescription className="text-white/45">
                    Recorded activity
                  </CardDescription>
                  <CardTitle className="mt-1 text-3xl text-white">
                    {activity.isLoading ? "…" : events.length}
                  </CardTitle>
                </div>
                <Activity className="h-6 w-6 text-violet-200" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-5 text-white/40">
                Account-owned evidence currently returned to this dashboard,
                capped by the activity-evidence API.
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/20 bg-emerald-300/[0.045] text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardDescription className="text-white/45">
                    Session boundary
                  </CardDescription>
                  <CardTitle className="mt-1 text-lg text-white">
                    Invitation admitted
                  </CardTitle>
                </div>
                <ShieldCheck className="h-6 w-6 text-emerald-200" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs leading-5 text-white/40">
                Protected requests still re-check beta admission. This is not
                independent legal identity verification.
              </p>
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                Continue where it matters
              </p>
              <h2 className="mt-2 text-2xl font-black">
                Four account-owned milestones
              </h2>
            </div>
            <Link
              href="/activity-evidence"
              className="inline-flex items-center text-sm font-semibold text-sky-200 hover:text-sky-100"
            >
              Inspect all evidence
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {journeySteps.map(step => {
              const isComplete = Boolean(completed.get(step.id));
              const Icon = step.icon;
              return (
                <Card
                  key={step.id}
                  className={
                    "flex h-full flex-col text-white " +
                    (isComplete
                      ? "border-emerald-300/20 bg-emerald-300/[0.035]"
                      : "border-white/10 bg-white/[0.03]")
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={
                          "grid h-10 w-10 place-items-center rounded-xl " +
                          (isComplete
                            ? "bg-emerald-300/10 text-emerald-200"
                            : "bg-white/[0.06] text-sky-200")
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      {isComplete ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                      ) : (
                        <Circle className="h-5 w-5 text-white/20" />
                      )}
                    </div>
                    <CardTitle className="mt-3 text-lg text-white">
                      {step.title}
                    </CardTitle>
                    <CardDescription className="leading-6 text-white/50">
                      {step.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Link href={step.href}>
                      <Button
                        type="button"
                        variant={isComplete ? "ghost" : "outline"}
                        className="w-full"
                      >
                        {isComplete ? "Review evidence" : step.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Activity className="h-5 w-5 text-violet-200" />
                    Recent evidence
                  </CardTitle>
                  <CardDescription className="mt-1 text-white/45">
                    Your latest persisted product records, not a simulated
                    platform activity feed.
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-white/10 text-white/40"
                >
                  Latest 3
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activity.isLoading ? (
                <p className="text-sm text-white/45">
                  Loading account evidence…
                </p>
              ) : activity.error ? (
                <p className="text-sm text-rose-200">
                  Activity evidence is temporarily unavailable.
                </p>
              ) : events.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-white/25" />
                  <p className="mt-3 text-sm text-white/50">
                    No persisted activity evidence yet.
                  </p>
                  <p className="mt-1 text-xs text-white/30">
                    Finish a lesson, publish a post, or submit feedback to create
                    real account evidence.
                  </p>
                </div>
              ) : (
                events.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <p className="font-semibold text-white">{event.label}</p>
                    <p className="mt-1 text-sm leading-6 text-white/50">
                      {event.detail}
                    </p>
                    <p className="mt-2 text-xs text-white/30">
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-300/20 bg-amber-300/[0.035] text-white">
            <CardHeader>
              <ShieldCheck className="h-5 w-5 text-amber-200" />
              <CardTitle className="mt-3 text-white">
                What this dashboard does not claim
              </CardTitle>
              <CardDescription className="text-white/50">
                A polished screen is not evidence of unavailable infrastructure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-6 text-white/55">
              <p>No fabricated online-user or engagement counts.</p>
              <p>No invented trades, balances, staking, rewards, or prices.</p>
              <p>No live payment, custody, signing, or blockchain execution.</p>
              <p>No provider-backed AI or livestream delivery unless separately verified.</p>
              <Link
                href="/beta-workspace"
                className="mt-2 inline-flex items-center font-semibold text-amber-100 hover:text-white"
              >
                Open ecosystem workspace
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
