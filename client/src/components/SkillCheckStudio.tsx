import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  gradeSkillCheck,
  learningTracks,
  type AssessmentResult,
  type LearningTrackId,
} from "@/lib/learningAssessment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const bandCopy = {
  "needs-practice": {
    label: "Practice next",
    detail: "Review the explanations and use the recommended learning route.",
  },
  building: {
    label: "Building",
    detail: "You have the core idea; another pass should tighten weak spots.",
  },
  strong: {
    label: "Strong",
    detail: "You demonstrated solid recall on this practice set.",
  },
} as const;

export default function SkillCheckStudio() {
  const [trackId, setTrackId] = useState<LearningTrackId>("ai-literacy");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const track = useMemo(
    () => learningTracks.find(item => item.id === trackId) ?? learningTracks[0],
    [trackId],
  );

  function chooseTrack(next: LearningTrackId) {
    setTrackId(next);
    setAnswers({});
    setResult(null);
  }

  function reset() {
    setAnswers({});
    setResult(null);
  }

  function submit() {
    setResult(gradeSkillCheck(track.id, answers));
  }

  return (
    <section
      id="skill-checks"
      className="rounded-3xl border border-sky-300/15 bg-sky-300/[0.035] p-5 sm:p-6"
      aria-label="SkySchool skill checks"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-sky-400/15 text-sky-100">
              Interactive skill checks
            </Badge>
            <Badge
              variant="outline"
              className="border-white/10 text-white/40"
            >
              20 authored questions · practice only
            </Badge>
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight">
            Test recall before you move on.
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-white/48">
            These checks score deterministic authored questions in the browser.
            They are learning feedback—not accredited exams, credentials, hiring
            assessments, investment advice, or professional certification.
          </p>
        </div>
        <Button variant="outline" onClick={reset} className="shrink-0">
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset track
        </Button>
      </div>

      <div className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {learningTracks.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => chooseTrack(item.id)}
            className={
              "rounded-2xl border p-4 text-left transition " +
              (track.id === item.id
                ? "border-sky-300/30 bg-sky-300/[0.08]"
                : "border-white/10 bg-black/15 hover:border-white/20")
            }
          >
            <p className="font-black text-white">{item.title}</p>
            <p className="mt-1 text-xs leading-5 text-white/38">
              {item.description}
            </p>
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {track.questions.map((item, questionIndex) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/15 p-4"
          >
            <div className="flex gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/[0.05] text-xs font-black text-white/45">
                {questionIndex + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold leading-6 text-white/90">
                  {item.prompt}
                </p>
                <div className="mt-3 grid gap-2">
                  {item.choices.map((choice, choiceIndex) => {
                    const selected = answers[item.id] === choiceIndex;
                    const showCorrect =
                      Boolean(result) && choiceIndex === item.correctIndex;
                    const showWrong =
                      Boolean(result) && selected && choiceIndex !== item.correctIndex;
                    return (
                      <button
                        key={choice}
                        type="button"
                        disabled={Boolean(result)}
                        onClick={() =>
                          setAnswers(current => ({
                            ...current,
                            [item.id]: choiceIndex,
                          }))
                        }
                        className={
                          "rounded-xl border px-3 py-2.5 text-left text-sm transition " +
                          (showCorrect
                            ? "border-emerald-300/30 bg-emerald-300/[0.08] text-emerald-50"
                            : showWrong
                              ? "border-rose-300/30 bg-rose-300/[0.07] text-rose-50"
                              : selected
                                ? "border-sky-300/30 bg-sky-300/[0.08] text-white"
                                : "border-white/[0.08] bg-white/[0.02] text-white/55 hover:border-white/20 hover:text-white")
                        }
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
                {result ? (
                  <p className="mt-3 text-xs leading-5 text-white/45">
                    <strong className="text-white/65">Why:</strong>{" "}
                    {item.explanation}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!result ? (
        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-white">
              {Object.keys(answers).length}/{track.questions.length} answered
            </p>
            <p className="mt-1 text-xs text-white/38">
              Unanswered questions count as missed so the score stays deterministic.
            </p>
          </div>
          <Button onClick={submit}>
            <Brain className="mr-2 h-4 w-4" />
            Score this check
          </Button>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/[0.045] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                <p className="font-black text-white">
                  {bandCopy[result.band].label}: {result.scorePercent}%
                </p>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/48">
                {result.correctCount}/{result.questionCount} correct ·{" "}
                {result.answeredCount}/{result.questionCount} answered.{" "}
                {bandCopy[result.band].detail}
              </p>
            </div>
            <Sparkles className="h-6 w-6 shrink-0 text-emerald-200" />
          </div>
          <Progress value={result.scorePercent} className="mt-4 h-2" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={result.recommendedRoute}>
              <Button size="sm">
                Continue learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="sm" variant="outline" onClick={reset}>
              Try again
            </Button>
          </div>
        </div>
      )}

      <p className="mt-5 text-[11px] leading-5 text-white/30">
        <ShieldCheck className="mr-1.5 inline h-3.5 w-3.5 text-sky-200" />
        Scores are local practice feedback and are not persisted as credentials.
        Correct answers and explanations are intentionally revealed after scoring
        so the activity remains a learning tool.
      </p>
    </section>
  );
}
