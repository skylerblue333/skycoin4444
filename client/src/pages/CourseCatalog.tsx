/*
 * Field Atlas beta surface: evidence-led education on bone paper, with explicit
 * persistence and authentication states. This page must never imply credentials,
 * financial activity, or production Web3 execution.
 */
import { useMemo, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { gapCourses } from "@/data/gapCourses";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Search, ShieldCheck } from "lucide-react";

export default function CourseCatalog() {
  const { isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(gapCourses[0]?.id ?? "");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const utils = trpc.useUtils();

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return gapCourses;
    return gapCourses.filter((course) =>
      [course.title, course.level, course.id].some((value) => value.toLowerCase().includes(q)),
    );
  }, [searchQuery]);

  const selected = gapCourses.find((course) => course.id === selectedCourseId) ?? filtered[0];
  const progressQuery = trpc.learningProgress.get.useQuery(
    { courseId: selectedCourseId },
    { enabled: isAuthenticated && Boolean(selectedCourseId) },
  );
  const completeLesson = trpc.learningProgress.complete.useMutation({
    onSuccess: () => utils.learningProgress.get.invalidate({ courseId: selectedCourseId }),
  });

  const completedIds = new Set((progressQuery.data ?? []).map((item) => item.lessonId));
  const completedCount = selected ? selected.lessons.filter((lesson) => completedIds.has(lesson.id)).length : 0;
  const progress = selected ? Math.round((completedCount / selected.lessons.length) * 100) : 0;

  if (loading) return <main className="min-h-screen p-8">Loading account state…</main>;

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3">Engineering beta curriculum</Badge>
            <h1 className="text-3xl font-bold">SkySchool Course Catalog</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Authored learning tracks with deterministic assessments and durable progress for signed-in beta testers. No certificates, financial advice, or chain actions are issued here.
            </p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search courses" className="pl-9" />
          </div>
        </div>

        {!isAuthenticated && (
          <Card className="mb-6 border-amber-500/40 bg-amber-500/5">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Sign in to save your verified progress.</p>
                <p className="mt-1 text-sm text-muted-foreground">You can inspect the curriculum without an account; completion persistence is account-scoped.</p>
              </div>
              <Button onClick={() => startLogin()} className="shrink-0">Sign in</Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-3">
            {filtered.map((course) => (
              <button key={course.id} type="button" className="w-full text-left" onClick={() => setSelectedCourseId(course.id)}>
                <Card className={selected?.id === course.id ? "border-primary" : "border-border/60"}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                    <CardDescription>{course.lessons.length} authored lessons</CardDescription>
                  </CardHeader>
                </Card>
              </button>
            ))}
            {!filtered.length && <Card className="p-6 text-sm text-muted-foreground">No matching courses.</Card>}
          </div>

          {selected && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />{selected.title}</CardTitle>
                    <CardDescription className="mt-2">{completedCount}/{selected.lessons.length} lessons completed {isAuthenticated ? "for this account" : "in preview"}</CardDescription>
                  </div>
                  <Badge>{progress}%</Badge>
                </div>
                <Progress value={progress} className="mt-3" />
              </CardHeader>
              <CardContent className="space-y-4">
                {selected.lessons.map((lesson, index) => {
                  const key = `${selected.id}:${lesson.id}`;
                  const answer = answers[key];
                  const correct = answer === lesson.question.correctIndex;
                  const completed = completedIds.has(lesson.id);
                  return (
                    <Card key={lesson.id} className="border-border/60">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-lg">{index + 1}. {lesson.title}</CardTitle>
                          {completed && <CheckCircle2 className="h-5 w-5 text-primary" />}
                        </div>
                        <CardDescription>{lesson.objective}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm leading-6 text-muted-foreground">{lesson.summary}</p>
                        <div className="rounded-lg border p-4">
                          <p className="mb-3 font-medium">{lesson.question.prompt}</p>
                          <div className="grid gap-2">
                            {lesson.question.choices.map((choice, choiceIndex) => (
                              <Button key={choice} type="button" variant={answer === choiceIndex ? "default" : "outline"} className="justify-start whitespace-normal text-left" onClick={() => setAnswers((current) => ({ ...current, [key]: choiceIndex }))}>
                                {choice}
                              </Button>
                            ))}
                          </div>
                          {answer !== undefined && <p className={`mt-3 text-sm ${correct ? "text-primary" : "text-destructive"}`}>{correct ? "Correct. You can record this lesson." : "Not quite. Review the lesson summary and try again."}</p>}
                        </div>
                        <Button
                          type="button"
                          disabled={!correct || completed || !isAuthenticated || completeLesson.isPending}
                          onClick={() => completeLesson.mutate({ courseId: selected.id, lessonId: lesson.id })}
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          {completed ? "Progress recorded" : completeLesson.isPending ? "Recording…" : "Mark lesson complete"}
                        </Button>
                        {!isAuthenticated && <p className="text-xs text-muted-foreground">Sign in to write durable progress for this lesson.</p>}
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
