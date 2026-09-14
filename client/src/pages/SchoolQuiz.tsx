import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { quizBank } from "@/data/quizBank";
import {
  filterQuizQuestions,
  quizCategories,
  scoreQuiz,
  type QuizAnswers,
  type QuizDifficulty,
} from "@/lib/quizEngine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const PASS_PERCENTAGE = 70;

type DifficultyFilter = QuizDifficulty | "all";

export default function SchoolQuiz() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [category, setCategory] = useState("all");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [finished, setFinished] = useState(false);

  const categories = useMemo(
    () => quizCategories(filterQuizQuestions(quizBank, difficulty, "all")),
    [difficulty],
  );

  const questions = useMemo(
    () => filterQuizQuestions(quizBank, difficulty, category),
    [difficulty, category],
  );

  const [timeLeft, setTimeLeft] = useState(quizBank.length * 60);

  const resetAttempt = () => {
    setCurrent(0);
    setAnswers({});
    setFinished(false);
    setTimeLeft(Math.max(60, questions.length * 60));
  };

  useEffect(() => {
    if (category !== "all" && !categories.includes(category)) {
      setCategory("all");
      return;
    }
    setCurrent(0);
    setAnswers({});
    setFinished(false);
    setTimeLeft(Math.max(60, questions.length * 60));
  }, [difficulty, category, categories, questions.length]);

  useEffect(() => {
    if (finished || questions.length === 0) return;
    const timer = window.setInterval(() => {
      setTimeLeft(previous => {
        if (previous <= 1) {
          setFinished(true);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished, questions.length]);

  const result = useMemo(
    () => scoreQuiz(questions, answers, PASS_PERCENTAGE),
    [questions, answers],
  );

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const question = questions[current];
  const selected = question ? answers[question.id] : undefined;
  const answered = selected !== undefined;

  const chooseAnswer = (choiceIndex: number) => {
    if (!question || answered || finished) return;
    setAnswers(previous => ({ ...previous, [question.id]: choiceIndex }));
  };

  const nextQuestion = () => {
    if (!answered) return;
    if (current + 1 >= questions.length) {
      setFinished(true);
      return;
    }
    setCurrent(previous => previous + 1);
  };

  if (finished) {
    return (
      <main className="min-h-screen bg-[#050510] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/course-catalog" className="inline-flex items-center text-sm text-white/60 hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Course catalog
            </Link>
            <Badge variant="outline" className="border-white/15 text-white/55">
              SkySchool engineering beta
            </Badge>
          </div>

          <Card className={result.passed ? "border-emerald-300/25 bg-emerald-300/[0.04] text-white" : "border-amber-300/25 bg-amber-300/[0.04] text-white"}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 text-5xl">{result.passed ? "🏆" : "📚"}</div>
              <CardTitle className="text-4xl text-white">{result.percentage}%</CardTitle>
              <p className="text-sm text-white/55">
                {result.correctCount}/{questions.length} correct · {result.earnedPoints}/{result.totalPoints} weighted points
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/55">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-200" />
                  <p>
                    {result.passed ? "Passing result recorded only in this browser session." : "Review the explanations below and retry when ready."}
                    {" "}This quiz is educational beta content. A passing result is a SkySchool platform completion signal, not an accredited credential, professional license, or financial qualification.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button variant="outline" className="gap-2 border-white/15" onClick={resetAttempt}>
                  <RotateCcw className="h-4 w-4" />
                  Retry this quiz
                </Button>
                <Link href="/course-catalog">
                  <Button className="w-full gap-2 sm:w-auto">
                    Continue learning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <section aria-labelledby="review-heading" className="space-y-3">
            <div>
              <h2 id="review-heading" className="text-xl font-bold">Answer review</h2>
              <p className="mt-1 text-sm text-white/45">Every authored question includes an explanation so missed concepts can be reviewed immediately.</p>
            </div>
            {questions.map((item, index) => {
              const answer = answers[item.id];
              const correct = answer === item.correctIndex;
              return (
                <Card key={item.id} className="border-white/10 bg-white/[0.025] text-white">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      {correct ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" /> : <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/30">Question {index + 1}</span>
                          <Badge variant="outline" className="border-white/10 text-white/45">{item.category}</Badge>
                          <Badge variant="outline" className="border-white/10 text-white/45">{item.difficulty}</Badge>
                        </div>
                        <p className="mt-3 font-medium">{item.prompt}</p>
                        <p className="mt-2 text-sm text-white/45">
                          {answer === undefined ? "No answer submitted." : `Your answer: ${item.choices[answer]}`}
                        </p>
                        {!correct ? <p className="mt-1 text-sm text-emerald-200">Correct answer: {item.choices[item.correctIndex]}</p> : null}
                        <p className="mt-3 text-sm leading-6 text-white/55">{item.explanation}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="border-b border-white/10 bg-white/[0.02] px-4 py-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-blue-300/25 bg-blue-300/[0.04] text-blue-100">SkySchool quiz lab</Badge>
              <Badge variant="outline" className="border-white/10 text-white/45">{questions.length} questions</Badge>
            </div>
            <h1 className="mt-2 text-xl font-bold">Knowledge check</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-white/50">
            <span className={timeLeft < 60 ? "flex items-center gap-1 text-rose-300" : "flex items-center gap-1"}>
              <Clock className="h-4 w-4" />
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
            <span>{questions.length ? `Q ${current + 1}/${questions.length}` : "No questions"}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Card className="border-white/10 bg-white/[0.025] text-white">
          <CardContent className="grid gap-4 p-4 md:grid-cols-[auto_1fr_1fr] md:items-end">
            <div className="hidden md:block">
              <Filter className="mb-2 h-5 w-5 text-blue-200" />
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/30">Build your quiz</p>
            </div>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-white/70">Difficulty</span>
              <select
                value={difficulty}
                onChange={event => setDifficulty(event.target.value as DifficultyFilter)}
                className="h-10 w-full rounded-md border border-white/10 bg-[#090916] px-3 text-white outline-none focus:ring-2 focus:ring-blue-300/40"
                aria-label="Quiz difficulty"
              >
                <option value="all">All levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </label>
            <label className="space-y-2 text-sm">
              <span className="font-medium text-white/70">Category</span>
              <select
                value={category}
                onChange={event => setCategory(event.target.value)}
                className="h-10 w-full rounded-md border border-white/10 bg-[#090916] px-3 text-white outline-none focus:ring-2 focus:ring-blue-300/40"
                aria-label="Quiz category"
              >
                <option value="all">All categories</option>
                {categories.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
          </CardContent>
        </Card>

        {questions.length === 0 || !question ? (
          <Card className="border-dashed border-white/15 bg-white/[0.02] text-white">
            <CardContent className="p-8 text-center">
              <p className="font-semibold">No questions match this filter.</p>
              <p className="mt-2 text-sm text-white/45">Choose another category or difficulty to continue.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Progress value={((current + (answered ? 1 : 0)) / questions.length) * 100} className="h-2" />

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-white/10 text-white/45">{question.category}</Badge>
                  <Badge variant="outline" className="border-white/10 text-white/45">{question.difficulty}</Badge>
                  <Badge variant="outline" className="border-white/10 text-white/45">{question.points} {question.points === 1 ? "point" : "points"}</Badge>
                </div>
                <CardTitle className="pt-3 text-xl leading-8 text-white">{question.prompt}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.choices.map((choice, choiceIndex) => {
                  const isCorrectChoice = choiceIndex === question.correctIndex;
                  const isSelectedChoice = choiceIndex === selected;
                  let stateClass = "border-white/10 bg-black/20 hover:border-blue-300/35 hover:bg-blue-300/[0.04]";
                  if (answered && isCorrectChoice) stateClass = "border-emerald-300/35 bg-emerald-300/[0.06]";
                  else if (answered && isSelectedChoice) stateClass = "border-rose-300/35 bg-rose-300/[0.06]";
                  else if (answered) stateClass = "border-white/[0.06] bg-black/10 text-white/40";

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={answered}
                      onClick={() => chooseAnswer(choiceIndex)}
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/50 disabled:cursor-default ${stateClass}`}
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-xs font-bold">
                        {answered && isCorrectChoice ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : answered && isSelectedChoice ? <XCircle className="h-4 w-4 text-rose-300" /> : String.fromCharCode(65 + choiceIndex)}
                      </span>
                      <span>{choice}</span>
                    </button>
                  );
                })}

                {answered ? (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-4" role="status" aria-live="polite">
                    <p className={selected === question.correctIndex ? "font-semibold text-emerald-200" : "font-semibold text-amber-200"}>
                      {selected === question.correctIndex ? "Correct" : "Review this concept"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/55">{question.explanation}</p>
                  </div>
                ) : null}

                <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-white/35">
                    Answers and results are session-only on this screen. No credential is issued here.
                  </p>
                  <Button type="button" disabled={!answered} onClick={nextQuestion} className="shrink-0 gap-2">
                    {current + 1 >= questions.length ? "See results" : "Next question"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
