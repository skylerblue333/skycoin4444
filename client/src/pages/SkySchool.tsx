import { useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { gapCourses } from "@/data/gapCourses";
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

const practiceCards = [
  {
    title: "Crypto Quiz Blitz",
    detail:
      "Fast recall practice with game-only Study XP and no token payout.",
    href: "/game-crypto-quiz",
    icon: Brain,
    accent: "border-blue-300/20 bg-blue-300/[0.04]",
  },
  {
    title: "Sky Rush",
    detail:
      "Short arcade reset: dodge gates, build combos, and collect no-value Sparks.",
    href: "/game-sky-rush",
    icon: Gamepad2,
    accent: "border-violet-300/20 bg-violet-300/[0.04]",
  },
  {
    title: "Arcade Lab",
    detail:
      "Deterministic memory, word, logic, board, and puzzle mini-games.",
    href: "/arcade",
    icon: Sparkles,
    accent: "border-emerald-300/20 bg-emerald-300/[0.04]",
  },
] as const;

export default function SkySchool() {
  const { user, isAuthenticated, loading } = useAuth();
  const activity = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });

  const lessonCount = useMemo(
    () =>
      gapCourses.reduce(
        (total, course) => total + course.lessons.length,
        0
      ),
    []
  );
  const completedLessonEvidence = useMemo(
    () =>
      (activity.data ?? []).filter(
        event => event.type === "lesson_completed"
      ).length,
    [activity.data]
  );
  const evidenceProgress = Math.min(
    100,
    Math.round(
      (completedLessonEvidence / Math.max(1, lessonCount)) * 100
    )
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-60 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-20 h-[30rem] w-[30rem] rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-violet-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-500/15 text-blue-100">
                SkySchool
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Authored lessons + persisted progress
              </Badge>
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Learn something. Prove it. Play with it.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              SkySchool combines authored course material with deterministic
              checks and short practice games. Durable lesson completion is
              account-owned; preview and game scores do not become credentials
              or financial rewards.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Link href="/course-catalog">
              <Button size="lg" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Open course catalog
              </Button>
            </Link>
            <Link href="/hope-a-i">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                <Brain className="mr-2 h-4 w-4" />
                Ask HopeAI Coach
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Authored courses", gapCourses.length, GraduationCap],
            ["Authored lessons", lessonCount, BookOpen],
            [
              "Persisted lesson events",
              isAuthenticated
                ? activity.isLoading
                  ? "…"
                  : completedLessonEvidence
                : "Sign in",
              CheckCircle2,
            ],
            ["Practice modes", practiceCards.length, Gamepad2],
          ].map(([label, value, Icon]) => (
            <Card
              key={label as string}
              className="border-white/10 bg-white/[0.035] text-white"
            >
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-blue-200" />
                <p className="mt-4 text-3xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <p className="font-semibold text-amber-100">
                    Preview is open; durable learning evidence requires sign-in
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    You can browse courses and play deterministic practice games
                    without an account. Lesson completion is persisted only for
                    an invited beta account.
                  </p>
                </div>
              </div>
              <Link href="/signin">
                <Button className="shrink-0">
                  Open invitation sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-blue-300/20 bg-blue-300/[0.04] text-white">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-blue-100">
                    Account learning evidence
                  </p>
                  <p className="mt-1 text-sm text-white/45">
                    {activity.error
                      ? "Evidence is temporarily unavailable."
                      : `${completedLessonEvidence} lesson-completion events are currently visible in the bounded activity-evidence feed.`}
                  </p>
                </div>
                <Link href="/activity-evidence">
                  <Button
                    variant="outline"
                    className="border-blue-300/20 bg-blue-300/[0.03] text-white"
                  >
                    Inspect evidence
                  </Button>
                </Link>
              </div>
              <Progress value={evidenceProgress} className="mt-4 h-2" />
              <p className="mt-2 text-xs text-white/30">
                This percentage compares currently visible lesson-completion
                evidence with authored lesson count. It is not a credential or
                guaranteed full-history transcript.
              </p>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-sky-200" />
                Start with an authored track
              </CardTitle>
              <CardDescription className="text-white/45">
                These are the real course records currently packaged with the
                beta—not invented enrollments, ratings, prices, or student
                counts.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-3">
              {gapCourses.slice(0, 6).map(course => (
                <Link
                  key={course.id}
                  href="/course-catalog"
                  className="group rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:border-blue-300/25 hover:bg-blue-300/[0.03]"
                >
                  <div className="flex items-start gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-300/10 text-blue-100">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h2 className="font-bold text-white">
                          {course.title}
                        </h2>
                        <Badge
                          variant="outline"
                          className="border-white/10 text-white/35"
                        >
                          {course.level}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-white/40">
                        {course.lessons.length} authored lessons
                      </p>
                      <span className="mt-3 inline-flex items-center text-xs font-semibold text-sky-200">
                        Open in Course Catalog
                        <ArrowRight className="ml-1 h-3 w-3 transition group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-5">
            <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Brain className="h-5 w-5 text-violet-200" />
                  HopeAI study sprint
                </CardTitle>
                <CardDescription className="text-white/45">
                  Use the deterministic coach to choose a learning goal and
                  convert it into a short route-aware plan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/hope-a-i">
                  <Button className="w-full">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Build a study sprint
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="text-white">
                  Learn → recall → play
                </CardTitle>
                <CardDescription className="text-white/45">
                  Short game sessions make the beta more engaging without
                  attaching money or token value to performance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {practiceCards.map(card => {
                  const Icon = card.icon;
                  return (
                    <Link
                      key={card.href}
                      href={card.href}
                      className={
                        "block rounded-2xl border p-4 transition hover:-translate-y-0.5 " +
                        card.accent
                      }
                    >
                      <Icon className="h-5 w-5 text-white/75" />
                      <h3 className="mt-3 font-bold">{card.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-white/40">
                        {card.detail}
                      </p>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "1. Learn",
              detail:
                "Read an authored lesson and answer the deterministic check.",
              icon: BookOpen,
            },
            {
              title: "2. Record",
              detail:
                "If signed in, persist completion so activation/evidence can use it.",
              icon: CheckCircle2,
            },
            {
              title: "3. Play",
              detail:
                "Use a short game as recall or a reset, then return to the next lesson.",
              icon: PlayCircle,
            },
          ].map(item => {
            const Icon = item.icon;
            return (
              <Card
                key={item.title}
                className="border-white/10 bg-white/[0.025] text-white"
              >
                <CardContent className="p-5">
                  <Icon className="h-5 w-5 text-emerald-200" />
                  <h2 className="mt-3 font-bold">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/40">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          SkySchool does not issue an accredited credential in this beta.
          Practice XP/Sparks have no cash or token value. Course pages may teach
          blockchain concepts, but completing lessons does not perform staking,
          mining, signing, transfers, or other live chain activity.
        </section>
      </div>
    </main>
  );
}
