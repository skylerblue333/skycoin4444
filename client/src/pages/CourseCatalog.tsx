/*
 * Evidence-led education beta surface with deterministic lessons, explicit
 * persistence, and authentication states. No credentials, financial activity,
 * or production Web3 execution are implied.
 */
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Search,
  ShieldCheck,
  Sparkles,
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

export default function CourseCatalog() {
  const { isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(
    gapCourses[0]?.id ?? ""
  );
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const utils = trpc.useUtils();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return gapCourses;
    return gapCourses.filter(course =>
      [course.title, course.level, course.id].some(value =>
        value.toLowerCase().includes(q)
      )
    );
  }, [searchQuery]);

  const selected =
    filtered.find(course => course.id === selectedCourseId) ?? filtered[0];
  const activeCourseId = selected?.id ?? "";

  const progressQuery = trpc.learningProgress.get.useQuery(
    { courseId: activeCourseId },
    {
      enabled: isAuthenticated && Boolean(activeCourseId),
      retry: false,
    }
  );
  const completeLesson = trpc.learningProgress.complete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.learningProgress.get.invalidate({
          courseId: activeCourseId,
        }),
        utils.activation.status.invalidate(),
      ]);
    },
  });

  const completedIds = new Set(
    (progressQuery.data ?? []).map(item => item.lessonId)
  );
  const completedCount = selected
    ? selected.lessons.filter(lesson => completedIds.has(lesson.id)).length
    : 0;
  const progress = selected
    ? Math.round((completedCount / selected.lessons.length) * 100)
    : 0;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-80 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className="border-blue-300/25 bg-blue-300/[0.04] text-blue-100"
              >
                SkySchool engineering beta
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                {gapCourses.length} authored courses
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight">
              Course catalog
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Authored learning tracks with deterministic assessment questions
              and account-owned progress. This screen does not issue
              certificates, financial advice, token rewards, or chain actions.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-white/30" />
              <Input
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
                placeholder="Search courses or level"
                aria-label="Search SkySchool courses"
                className="border-white/10 bg-black/25 pl-9 text-white placeholder:text-white/25"
              />
            </div>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white sm:w-auto"
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/signin">
                <Button className="w-full sm:w-auto">Sign in</Button>
              </Link>
            )}
          </div>
        </header>

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <p className="font-semibold text-amber-100">
                    Preview is open; durable progress requires an invited account
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    You can read lessons and try deterministic questions without
                    signing in. Completion records are written only for an
                    authenticated beta account.
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
        ) : null}

        {completeLesson.error ? (
          <div
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
            role="alert"
          >
            Lesson progress could not be recorded. Try again before leaving the
            page.
          </div>
        ) : null}

        {completeLesson.isSuccess ? (
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.05] p-4 text-sm text-emerald-100"
            role="status"
            aria-live="polite"
          >
            <span>Lesson completion persisted for this account.</span>
            <Link
              href="/onboarding"
              className="inline-flex items-center font-semibold"
            >
              Continue activation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-3" aria-label="Course list">
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                Courses
              </p>
              <span className="text-xs text-white/30">
                {filtered.length} visible
              </span>
            </div>

            {filtered.map(course => (
              <button
                key={course.id}
                type="button"
                className="w-full rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
                onClick={() => setSelectedCourseId(course.id)}
                aria-pressed={selected?.id === course.id}
              >
                <Card
                  className={
                    "text-white transition " +
                    (selected?.id === course.id
                      ? "border-blue-300/35 bg-blue-300/[0.06]"
                      : "border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]")
                  }
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base text-white">
                        {course.title}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-white/45"
                      >
                        {course.level}
                      </Badge>
                    </div>
                    <CardDescription className="text-white/40">
                      {course.lessons.length} authored lessons
                    </CardDescription>
                  </CardHeader>
                </Card>
              </button>
            ))}

            {!filtered.length ? (
              <Card className="border-dashed border-white/15 bg-white/[0.02] text-white">
                <CardContent className="p-6 text-center">
                  <Search className="mx-auto h-6 w-6 text-white/20" />
                  <p className="mt-3 text-sm text-white/45">
                    No courses match “{searchQuery.trim()}”.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </aside>

          {selected ? (
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader className="border-b border-white/[0.07]">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-2xl text-white">
                      <BookOpen className="h-5 w-5 text-blue-200" />
                      {selected.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-white/45">
                      {isAuthenticated
                        ? `${completedCount}/${selected.lessons.length} lessons persisted for this account`
                        : "Preview mode — answers stay only on this page"}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-500/15 text-blue-100">
                    {isAuthenticated ? `${progress}% complete` : "Preview"}
                  </Badge>
                </div>

                {isAuthenticated ? (
                  <Progress value={progress} className="mt-4 h-2" />
                ) : null}

                {progressQuery.isError ? (
                  <p className="mt-3 text-sm text-rose-200" role="alert">
                    Saved progress for this course could not be loaded.
                  </p>
                ) : null}
              </CardHeader>

              <CardContent className="space-y-4 pt-6">
                {selected.lessons.map((lesson, index) => {
                  const key = `${selected.id}:${lesson.id}`;
                  const answer = answers[key];
                  const correct = answer === lesson.question.correctIndex;
                  const completed = completedIds.has(lesson.id);

                  return (
                    <Card
                      key={lesson.id}
                      className={
                        "text-white " +
                        (completed
                          ? "border-emerald-300/20 bg-emerald-300/[0.035]"
                          : "border-white/10 bg-black/20")
                      }
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/25">
                              Lesson {index + 1}
                            </p>
                            <CardTitle className="mt-2 text-lg text-white">
                              {lesson.title}
                            </CardTitle>
                          </div>
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                          ) : (
                            <Sparkles className="h-5 w-5 text-white/20" />
                          )}
                        </div>
                        <CardDescription className="text-white/45">
                          {lesson.objective}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-sm leading-6 text-white/55">
                          {lesson.summary}
                        </p>

                        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                          <p className="mb-3 font-medium text-white">
                            {lesson.question.prompt}
                          </p>
                          <div className="grid gap-2">
                            {lesson.question.choices.map(
                              (choice, choiceIndex) => (
                                <Button
                                  key={choice}
                                  type="button"
                                  variant={
                                    answer === choiceIndex
                                      ? "default"
                                      : "outline"
                                  }
                                  className="h-auto min-h-10 justify-start whitespace-normal py-2.5 text-left"
                                  onClick={() =>
                                    setAnswers(current => ({
                                      ...current,
                                      [key]: choiceIndex,
                                    }))
                                  }
                                >
                                  {choice}
                                </Button>
                              )
                            )}
                          </div>

                          {answer !== undefined ? (
                            <p
                              className={
                                "mt-3 text-sm " +
                                (correct
                                  ? "text-emerald-200"
                                  : "text-amber-200")
                              }
                              role="status"
                            >
                              {correct
                                ? "Correct. This lesson is ready to record."
                                : "Not quite. Review the summary and try again."}
                            </p>
                          ) : null}
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <Button
                            type="button"
                            disabled={
                              !correct ||
                              completed ||
                              !isAuthenticated ||
                              completeLesson.isPending
                            }
                            onClick={() =>
                              completeLesson.mutate({
                                courseId: selected.id,
                                lessonId: lesson.id,
                              })
                            }
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            {completed
                              ? "Progress recorded"
                              : completeLesson.isPending
                                ? "Recording…"
                                : "Record lesson completion"}
                          </Button>

                          {!isAuthenticated ? (
                            <Link
                              href="/signin"
                              className="inline-flex items-center text-xs font-semibold text-sky-200"
                            >
                              Sign in to persist progress
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          ) : null}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed border-white/15 bg-white/[0.02] text-white">
              <CardContent className="grid min-h-72 place-items-center p-8 text-center">
                <div>
                  <BookOpen className="mx-auto h-8 w-8 text-white/20" />
                  <p className="mt-3 text-white/45">
                    Choose a matching course to open its lessons.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
