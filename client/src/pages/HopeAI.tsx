import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clipboard,
  Gamepad2,
  GraduationCap,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  createHopePlan,
  summarizeHopeActivity,
  type HopeFocus,
  type HopePlan,
} from "@/lib/hopeCoach";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const focusOptions: Array<{
  id: HopeFocus;
  label: string;
  detail: string;
  icon: typeof Brain;
}> = [
  {
    id: "build",
    label: "Build",
    detail: "Improve one real product surface.",
    icon: WandSparkles,
  },
  {
    id: "learn",
    label: "Learn",
    detail: "Turn a goal into a lesson + recall loop.",
    icon: GraduationCap,
  },
  {
    id: "play",
    label: "Play",
    detail: "Use games as a short skill/replay loop.",
    icon: Gamepad2,
  },
  {
    id: "ship",
    label: "Ship",
    detail: "Walk the tester path and close feedback.",
    icon: CheckCircle2,
  },
];

const quickGoals = [
  "Make the gaming hub more fun with a rush game",
  "Learn blockchain basics and test myself",
  "Improve the social beta without fake metrics",
  "Ship one visible beta improvement today",
] as const;

export default function HopeAI() {
  const { user, loading, isAuthenticated } = useAuth();
  const activity = trpc.activityEvidence.list.useQuery(undefined, {
    enabled: Boolean(user),
    retry: false,
  });
  const [goal, setGoal] = useState("");
  const [focus, setFocus] = useState<HopeFocus>("build");
  const [plan, setPlan] = useState<HopePlan | null>(null);
  const [copied, setCopied] = useState(false);

  const summary = useMemo(
    () => summarizeHopeActivity(activity.data ?? []),
    [activity.data]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050510] p-8 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="h-8 w-56 animate-pulse rounded-lg bg-white/10" />
          <div className="mt-6 h-72 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
        </div>
      </main>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-[#050510] px-4 py-14 text-white">
        <Card className="mx-auto max-w-xl border-white/10 bg-white/[0.035] text-white">
          <CardHeader>
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-300/10 text-violet-200">
              <Brain className="h-6 w-6" />
            </div>
            <CardTitle className="mt-4 text-3xl">HopeAI Coach</CardTitle>
            <CardDescription className="leading-6 text-white/50">
              Sign in to let the deterministic beta coach use your
              account-owned activity evidence when choosing the next useful
              step.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Link href="/signin">
              <Button className="w-full">
                Open invitation sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/beta-workspace">
              <Button
                variant="outline"
                className="w-full border-white/15 bg-white/[0.03] text-white"
              >
                Browse beta workspace
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  function generatePlan() {
    setPlan(
      createHopePlan({
        goal,
        focus,
        activity: summary,
      })
    );
    setCopied(false);
  }

  async function copyPlan() {
    if (!plan) return;
    const text = [
      plan.title,
      plan.summary,
      ...plan.steps.map(
        (step, index) =>
          `${index + 1}. ${step.title} (${step.minutes} min) — ${step.detail}`
      ),
      plan.coachNote,
    ].join("\n\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-40 h-[28rem] w-[28rem] rounded-full bg-cyan-500/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-7 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-violet-500/15 text-violet-100">
                Functional beta coach
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Deterministic · no external model
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              HopeAI Coach
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Turn a goal into a short action sprint using typed rules plus your
              account-owned beta evidence. This is useful today without
              pretending model connectivity, emotional inference, hidden memory,
              or autonomous agents exist.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href="/sky-school">
              <Button
                variant="outline"
                className="border-white/15 bg-white/[0.03] text-white"
              >
                <GraduationCap className="mr-2 h-4 w-4" />
                SkySchool
              </Button>
            </Link>
            <Link href="/gaming">
              <Button
                variant="outline"
                className="border-white/15 bg-white/[0.03] text-white"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Gaming
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-4">
          {[
            ["Lessons", summary.lessons],
            ["Posts", summary.posts],
            ["Feedback", summary.feedback],
            ["Other evidence", summary.other],
          ].map(([label, value]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <p className="text-2xl font-black">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                {label}
              </p>
            </div>
          ))}
        </section>

        {activity.error ? (
          <div
            className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4 text-sm text-amber-100"
            role="alert"
          >
            Account evidence could not be loaded, so the coach will use only
            your typed goal and selected focus.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/10 bg-white/[0.035] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Lightbulb className="h-5 w-5 text-amber-200" />
                What are you trying to do?
              </CardTitle>
              <CardDescription className="text-white/45">
                Keep it concrete. The planner normalizes and bounds the goal
                before generating a route-aware sprint.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Textarea
                value={goal}
                maxLength={500}
                onChange={event => setGoal(event.target.value)}
                placeholder="Example: make the gaming hub more fun and give me a useful next step"
                className="min-h-32 border-white/10 bg-black/25 text-white placeholder:text-white/25"
              />
              <div className="flex items-center justify-between text-xs text-white/30">
                <span>{goal.length}/500</span>
                <button
                  type="button"
                  onClick={() => {
                    setGoal("");
                    setPlan(null);
                  }}
                  className="inline-flex items-center gap-1 hover:text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear
                </button>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                  Focus
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {focusOptions.map(option => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFocus(option.id)}
                        aria-pressed={focus === option.id}
                        className={
                          "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 " +
                          (focus === option.id
                            ? "border-violet-300/35 bg-violet-300/[0.08]"
                            : "border-white/[0.08] bg-black/20 hover:border-white/20")
                        }
                      >
                        <Icon className="h-5 w-5 text-violet-200" />
                        <strong className="mt-3 block">{option.label}</strong>
                        <span className="mt-1 block text-xs leading-5 text-white/35">
                          {option.detail}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                  Quick goals
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickGoals.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setGoal(item)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/50 transition hover:border-violet-300/30 hover:text-white"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={generatePlan}>
                <Sparkles className="mr-2 h-4 w-4" />
                Build my sprint
              </Button>
            </CardContent>
          </Card>

          <Card className="border-violet-300/15 bg-gradient-to-br from-violet-300/[0.06] via-white/[0.025] to-sky-300/[0.05] text-white">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bot className="h-5 w-5 text-violet-200" />
                    Action sprint
                  </CardTitle>
                  <CardDescription className="mt-1 text-white/45">
                    {plan
                      ? `${plan.sprintMinutes} focused minutes across ${plan.steps.length} steps`
                      : "Generate a plan to turn this panel into a route-aware checklist."}
                  </CardDescription>
                </div>
                {plan ? (
                  <Badge
                    variant="outline"
                    className="border-violet-300/25 text-violet-100"
                  >
                    {plan.provenance}
                  </Badge>
                ) : null}
              </div>
            </CardHeader>

            <CardContent>
              {!plan ? (
                <div className="grid min-h-96 place-items-center rounded-3xl border border-dashed border-white/15 bg-black/15 p-8 text-center">
                  <div>
                    <Brain className="mx-auto h-10 w-10 text-white/20" />
                    <p className="mt-4 font-semibold text-white/70">
                      No generated plan yet
                    </p>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                      Choose Build, Learn, Play, or Ship and add a goal. The
                      coach will point you into the live beta routes that match.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-100/55">
                      {plan.focus}
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-tight">
                      {plan.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      {plan.summary}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {plan.steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="rounded-2xl border border-white/10 bg-black/20 p-4"
                      >
                        <div className="flex items-start gap-4">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-300/10 text-sm font-black text-violet-100">
                            {index + 1}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <h3 className="font-bold">{step.title}</h3>
                              <span className="text-xs text-white/30">
                                {step.minutes} min
                              </span>
                            </div>
                            <p className="mt-1 text-sm leading-6 text-white/45">
                              {step.detail}
                            </p>
                            <Link
                              href={step.href}
                              className="mt-3 inline-flex items-center text-sm font-semibold text-sky-200 hover:text-white"
                            >
                              Open step
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
                    <ShieldCheck className="h-4 w-4 text-amber-200" />
                    <p className="mt-2 text-xs leading-5 text-white/40">
                      {plan.coachNote}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-white/15 bg-white/[0.03] text-white"
                    onClick={copyPlan}
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    {copied ? "Plan copied" : "Copy sprint"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          HopeAI Coach currently performs deterministic local planning only. It
          does not send prompts to an external model, create autonomous agents,
          infer mental state, claim hidden memory, or present synthetic model
          metrics/confidence.
        </section>
      </div>
    </main>
  );
}
