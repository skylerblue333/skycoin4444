import { ArrowRight, BookOpenCheck, CheckCircle2, Route, ShieldCheck } from "lucide-react";
import { gapCourses } from "@/data/gapCourses";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import {
  getLearningContinuation,
  getSessionRecallSummary,
  summarizeLearningPortfolio,
} from "@/lib/learningContinuity";

export default function LearningContinuityPanel({
  selectedCourseId,
  answers,
  isAuthenticated,
  onSelectCourse,
}: {
  selectedCourseId: string;
  answers: Readonly<Record<string, number>>;
  isAuthenticated: boolean;
  onSelectCourse: (courseId: string) => void;
}) {
  const progressQuery = trpc.learningProgress.listAll.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });
  const selectedCourse =
    gapCourses.find(course => course.id === selectedCourseId) ?? gapCourses[0];
  if (!selectedCourse) return null;

  const records = progressQuery.data ?? [];
  const portfolio = summarizeLearningPortfolio(gapCourses, records);
  const continuation = getLearningContinuation(
    gapCourses,
    records,
    selectedCourse.id
  );
  const recall = getSessionRecallSummary(selectedCourse, answers);

  const openNextLesson = () => {
    if (!continuation?.nextLessonId) return;
    const target = document.getElementById(
      `lesson-${selectedCourse.id}-${continuation.nextLessonId}`
    );
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectNextCourse = () => {
    if (!continuation?.nextCourseId) return;
    onSelectCourse(continuation.nextCourseId);
    requestAnimationFrame(() => {
      document
        .getElementById("course-learning-panel")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section
      id="course-learning-panel"
      className="rounded-3xl border border-sky-300/15 bg-sky-300/[0.035] p-5 text-white"
      aria-label="Learning continuity"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-sky-200/55">
            <Route className="h-3.5 w-3.5" />
            Learning continuity
          </div>
          <h2 className="mt-2 text-xl font-black">
            Keep moving from persisted evidence, not invented mastery.
          </h2>
          <p className="mt-2 text-xs leading-5 text-white/40">
            Account progress comes from stored lesson-completion records. Session recall below reflects only answers on this page and resets when the page reloads; it is not a credential, grade, or proficiency score.
          </p>
        </div>

        {isAuthenticated ? (
          <div className="min-w-52 rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="flex items-end justify-between gap-3">
              <div>
                <strong className="text-3xl font-black">
                  {portfolio.overallPercent}%
                </strong>
                <p className="mt-1 text-[10px] text-white/35">
                  authored lessons complete
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-200" />
            </div>
            <Progress value={portfolio.overallPercent} className="mt-3 h-2" />
            <p className="mt-2 text-[10px] leading-4 text-white/35">
              {portfolio.overallCompletedLessons}/{portfolio.overallLessons} lessons · {portfolio.completedCourses}/{portfolio.totalCourses} courses complete
            </p>
          </div>
        ) : (
          <div className="min-w-52 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4 text-xs leading-5 text-white/45">
            <ShieldCheck className="mb-2 h-4 w-4 text-amber-200" />
            Sign in with an invited beta account to load account-wide learning continuity.
          </div>
        )}
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Selected course
          </p>
          <p className="mt-2 text-sm font-bold text-white/80">
            {selectedCourse.title}
          </p>
          <p className="mt-1 text-xs text-white/35">
            {isAuthenticated && continuation
              ? `${continuation.selectedSummary.completedCount}/${continuation.selectedSummary.lessonCount} persisted lessons · ${continuation.selectedSummary.percent}%`
              : `${selectedCourse.lessons.length} authored lessons`}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Session recall
          </p>
          <p className="mt-2 text-sm font-bold text-white/80">
            {recall.correct}/{recall.answered || 0} correct from answered questions
          </p>
          <p className="mt-1 text-xs text-white/35">
            {recall.answered}/{recall.total} questions attempted · page-session only
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
            Next action
          </p>
          {!isAuthenticated ? (
            <p className="mt-2 text-xs leading-5 text-white/40">
              Preview lessons freely; sign in before treating completion as durable progress.
            </p>
          ) : progressQuery.isLoading ? (
            <p className="mt-2 text-xs text-white/40">Loading account progress…</p>
          ) : progressQuery.isError ? (
            <p className="mt-2 text-xs leading-5 text-rose-200/75">
              Account-wide progress could not be loaded, so no continuation recommendation is inferred.
            </p>
          ) : continuation?.action === "continue-course" ? (
            <button
              type="button"
              onClick={openNextLesson}
              className="mt-2 inline-flex items-center text-left text-xs font-bold text-sky-200 hover:text-white"
            >
              Continue the next unfinished lesson
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </button>
          ) : continuation?.action === "next-course" ? (
            <button
              type="button"
              onClick={selectNextCourse}
              className="mt-2 inline-flex items-center text-left text-xs font-bold text-sky-200 hover:text-white"
            >
              Open the next incomplete authored course
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </button>
          ) : (
            <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-emerald-100/75">
              <BookOpenCheck className="mt-0.5 h-4 w-4 shrink-0" />
              All authored lessons are recorded. Review any course as needed; no accreditation or mastery certification is implied.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
