import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Plus, RotateCcw, Trash2 } from "lucide-react";
import {
  scoreQuiz,
  validateQuizQuestion,
  type QuizQuestion,
} from "@/lib/betaProductivity";
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

const STORAGE_KEY = "skycoin4444-beta-quiz-builder-v1";

function loadQuestions(): QuizQuestion[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function QuizBuilder() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(loadQuestions);
  const [prompt, setPrompt] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
  }, [questions]);

  const score = useMemo(
    () => scoreQuiz(questions, answers),
    [answers, questions]
  );

  const addQuestion = (event: FormEvent) => {
    event.preventDefault();
    const question: QuizQuestion = {
      prompt: prompt.trim(),
      options: options.map(option => option.trim()),
      correctIndex,
    };
    const validation = validateQuizQuestion(question);
    if (validation) {
      setError(validation);
      return;
    }
    setQuestions(current => [...current, question]);
    setPrompt("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setAnswers({});
    setError("");
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <Badge variant="outline">Browser-local builder</Badge>
          <h1 className="mt-3 text-3xl font-bold">Quiz builder</h1>
          <p className="mt-2 text-muted-foreground">
            Build deterministic multiple-choice quizzes and test them locally.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add question</CardTitle>
              <CardDescription>
                Two to six non-empty options are supported.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={addQuestion} className="space-y-4">
                <Input
                  value={prompt}
                  maxLength={240}
                  onChange={event => setPrompt(event.target.value)}
                  placeholder="Question prompt"
                />
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="radio"
                      checked={correctIndex === index}
                      onChange={() => setCorrectIndex(index)}
                      aria-label={`Mark option ${index + 1} correct`}
                    />
                    <Input
                      value={option}
                      maxLength={160}
                      onChange={event =>
                        setOptions(current =>
                          current.map((value, optionIndex) =>
                            optionIndex === index ? event.target.value : value
                          )
                        )
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                  </div>
                ))}
                <div className="flex gap-2">
                  {options.length < 6 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        setOptions(current => [...current, ""])
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Option
                    </Button>
                  )}
                  {options.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOptions(current => current.slice(0, -1));
                        setCorrectIndex(current =>
                          Math.min(current, options.length - 2)
                        );
                      }}
                    >
                      Remove option
                    </Button>
                  )}
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit">Add question</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Test quiz</CardTitle>
                  <CardDescription>
                    {questions.length} question{questions.length === 1 ? "" : "s"}
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setAnswers({})}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {questions.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  Add a question to test the quiz.
                </p>
              ) : (
                questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="rounded-xl border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{question.prompt}</p>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setQuestions(current =>
                            current.filter((_, index) => index !== questionIndex)
                          );
                          setAnswers({});
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          type="button"
                          variant={
                            answers[questionIndex] === optionIndex
                              ? "default"
                              : "outline"
                          }
                          className="justify-start whitespace-normal text-left"
                          onClick={() =>
                            setAnswers(current => ({
                              ...current,
                              [questionIndex]: optionIndex,
                            }))
                          }
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {questions.length > 0 && (
                <div className="rounded-xl border bg-muted/30 p-4">
                  <p className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Score: {score.correct}/{score.total} · {score.percent}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-muted-foreground">
          Quizzes are stored only in this browser and do not issue certificates,
          grades, credentials, or instructor analytics.
        </p>
      </div>
    </main>
  );
}
