import { useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Users,
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

const connectedPaths = [
  {
    title: "Ask HopeAI",
    detail:
      "Take a lesson question into the specialist workspace. Provider availability and tool boundaries still apply.",
    href: "/hope-a-i",
    icon: Bot,
  },
  {
    title: "Practice in Games",
    detail:
      "Use demo-credit and skill games for recall or a reset. Learning progress never becomes a wager or payout.",
    href: "/gaming",
    icon: Gamepad2,
  },
  {
    title: "Open SkyHope",
    detail:
      "Turn learning into an impact-planning idea without implying a donation, beneficiary verification, or fund movement.",
    href: "/charity",
    icon: HeartHandshake,
  },
  {
    title: "Share in Social",
    detail:
      "Continue into the account-aware social surface when you want to discuss what you learned.",
    href: "/activity-feed",
    icon: Users,
  },
] as const;

export default function SchoolDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const progress = trpc.learningProgress.listAll.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const authoredLessonCount = useMemo(
    () =>
      gapCourses.reduce(
        (total, course) => total + course.lessons.length,
        0,
      ),
    [],
  );

  const completionKeys = useMemo(
    () =>
      new Set(
        (progress.data ?? []).map(
          item => item.courseId + "::" + item.lessonId,
        ),
      ),
    [progress.data],
  );

  const completedLessonCount = completionKeys.size;

  const courseProgress = useMemo(
    () =>
      gapCourses.map(course => {
        const completed = course.lessons.reduce(
          (count, lesson) =>
            count +
            (completionKeys.has(course.id + "::" + lesson.id) ? 1 : 0),
          0,
        );
        return {
          course,
          completed,
          percent:
            course.lessons.length === 0
              ? 0
              : Math.round((completed / course.lessons.length) * 100),
        };
      }),
    [completionKeys],
  );

  const startedCourses = courseProgress.filter(item => item.completed > 0).length;
  const completedCourses = courseProgress.filter(
    item =>
      item.course.lessons.length > 0 &&
      item.completed === item.course.lessons.length,
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07090f] p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="h-10 w-60 animate-pulse rounded-xl bg-white/10" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl bg-white/[0.04]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090f] text-white">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="grid gap-6 border-b border-white/10 pb-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-blue-400/15 text-blue-100">
                SkySchool progress
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Authored curriculum · account-owned completion
              </Badge>
            </div>
            <h1 className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
              My Learning
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              This dashboard is derived from the authored SkySchool course
              catalog and the signed-in learning-progress records. It no longer
              invents enrollments, XP, certificates, ratings, or on-chain
              credentials.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/course-catalog">
              <Button size="lg" className="w-full">
                <BookOpen className="mr-2 h-4 w-4" />
                Browse courses
              </Button>
            </Link>
            <Link href="/hope-a-i">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                <Bot className="mr-2 h-4 w-4" />
                Ask HopeAI
              </Button>
            </Link>
          </div>
        </header>

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <p className="font-semibold text-amber-100">
                    Course browsing is open; personal progress needs sign-in
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    Anonymous visitors can inspect the authored curriculum.
                    This page shows no made-up account history while you are
                    signed out.
                  </p>
                </div>
              </div>
              <Link href="/signin">
                <Button className="shrink-0">Sign in</Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              label: "Authored courses",
              value: gapCourses.length,
              icon: GraduationCap,
            },
            {
              label: "Authored lessons",
              value: authoredLessonCount,
              icon: BookOpen,
            },
            {
              label: "Lessons completed",
              value: isAuthenticated
                ? progress.isLoading
                  ? "…"
                  : completedLessonCount
                : "Sign in",
              icon: CheckCircle2,
            },
            {
              label: "Courses started",
              value: isAuthenticated
                ? progress.isLoading
                  ? "…"
                  : startedCourses
                : "Sign in",
              icon: Sparkles,
            },
            {
              label: "Courses completed",
              value: isAuthenticated
                ? progress.isLoading
                  ? "…"
                  : completedCourses
                : "Sign in",
              icon: GraduationCap,
            },
          ].map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
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

        {progress.error && isAuthenticated ? (
          <Card className="border-red-300/20 bg-red-300/[0.04] text-white">
            <CardContent className="p-5 text-sm text-red-100">
              Learning progress is temporarily unavailable. The authored
              course catalog is still visible below, but this page will not
              substitute fake completion values.
            </CardContent>
          </Card>
        ) : null}

        <section>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-200/60">
                Real course progress
              </p>
              <h2 className="mt-2 text-3xl font-black">
                Continue an authored track
              </h2>
            </div>
            <Link
              href="/course-catalog"
              className="inline-flex items-center text-sm font-semibold text-blue-200"
            >
              Full catalog
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {courseProgress.map(({ course, completed, percent }) => (
              <Card
                key={course.id}
                className="border-white/10 bg-white/[0.035] text-white"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-3">
                    <Badge
                      variant="outline"
                      className="border-white/10 text-white/40"
                    >
                      {course.level}
                    </Badge>
                    <span className="text-xs font-bold text-white/35">
                      {isAuthenticated
                        ? progress.isLoading
                          ? "Loading…"
                          : completed + "/" + course.lessons.length
                        : course.lessons.length + " lessons"}
                    </span>
                  </div>
                  <CardTitle className="mt-3 text-white">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-white/45">
                    {course.lessons.length} authored lessons with deterministic
                    knowledge checks.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isAuthenticated ? (
                    <>
                      <Progress value={progress.isLoading ? 0 : percent} />
                      <p className="text-xs text-white/35">
                        {progress.isLoading
                          ? "Reading account progress…"
                          : percent + "% of authored lessons completed"}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-white/35">
                      Sign in to persist and display lesson completion.
                    </p>
                  )}
                  <Link href="/course-catalog">
                    <Button
                      variant="outline"
                      className="w-full border-white/15 bg-white/[0.03] text-white"
                    >
                      Open in Course Catalog
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-200/60">
              Connected learning loop
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Learn, ask, practice, help, share.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {connectedPaths.map(item => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.href}
                  className="border-white/10 bg-white/[0.03] text-white"
                >
                  <CardHeader>
                    <Icon className="h-6 w-6 text-violet-200" />
                    <CardTitle className="mt-3 text-lg text-white">
                      {item.title}
                    </CardTitle>
                    <CardDescription className="leading-6 text-white/45">
                      {item.detail}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={item.href}>
                      <Button
                        variant="outline"
                        className="w-full border-white/15 bg-white/[0.03] text-white"
                      >
                        Open
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          SkySchool is an engineering beta, not an accredited institution.
          Lesson completion is account progress, not a degree, professional
          license, blockchain credential, or guaranteed certification. This
          dashboard does not mint certificates or write learning records to a
          blockchain.
        </section>
      </div>
    </main>
  );
}
