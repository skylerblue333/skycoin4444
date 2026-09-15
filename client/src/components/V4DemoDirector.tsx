import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Eye,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  V3_JOURNEY_PROGRESS_KEY,
  getV3JourneyCompletionPercent,
  normalizeV3JourneyProgress,
  type V3JourneyProgress,
} from "@/lib/v3Journeys";
import {
  V4_DEMO_SESSION_KEY,
  getV4DemoProgress,
  getV4DemoTrack,
  getV4DemoTrackSteps,
  markV4DemoStepVisited,
  normalizeV4DemoSession,
  resetV4DemoSession,
  setV4DemoTrack,
  v4DemoTracks,
  type V4DemoSession,
  type V4DemoTrackId,
} from "@/lib/v4Demo";

function readJson(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null");
  } catch {
    return null;
  }
}

function persistSession(session: V4DemoSession) {
  try {
    localStorage.setItem(V4_DEMO_SESSION_KEY, JSON.stringify(session));
  } catch {
    // The demo remains usable without persistence.
  }
}

export default function V4DemoDirector() {
  const [session, setSession] = useState<V4DemoSession>(() =>
    normalizeV4DemoSession(null)
  );
  const [journeyProgress, setJourneyProgress] = useState<V3JourneyProgress>({});

  useEffect(() => {
    setSession(normalizeV4DemoSession(readJson(V4_DEMO_SESSION_KEY)));
    setJourneyProgress(
      normalizeV3JourneyProgress(readJson(V3_JOURNEY_PROGRESS_KEY))
    );
  }, []);
  useEffect(() => persistSession(session), [session]);

  const track = getV4DemoTrack(session.trackId);
  const steps = getV4DemoTrackSteps(session.trackId);
  const demoProgress = getV4DemoProgress(session);
  const evidenceAverage = useMemo(() => {
    if (!steps.length) return 0;
    const total = steps.reduce(
      (sum, step) =>
        sum + getV3JourneyCompletionPercent(journeyProgress, step.flagshipId),
      0
    );
    return Math.round(total / steps.length);
  }, [journeyProgress, steps]);

  const nextStep = demoProgress.nextStep;

  function chooseTrack(trackId: V4DemoTrackId) {
    setSession(current => setV4DemoTrack(current, trackId));
  }

  function recordVisit(stepId: string) {
    setSession(current => markV4DemoStepVisited(current, stepId));
  }

  return (
    <section className="space-y-5" aria-labelledby="v4-demo-title">
      <Card className="overflow-hidden border-cyan-300/25 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.13),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.15),transparent_42%),rgba(255,255,255,0.025)] text-white shadow-2xl shadow-cyan-950/20">
        <CardContent className="p-0">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-cyan-300/15 text-cyan-100">
                  <PlayCircle className="mr-1 h-3.5 w-3.5" />
                  Demo director
                </Badge>
                <Badge variant="outline" className="border-white/10 text-white/55">
                  {track.duration}
                </Badge>
                <Badge variant="outline" className="border-white/10 text-white/55">
                  {steps.length} product moments
                </Badge>
              </div>

              <h2 id="v4-demo-title" className="mt-5 max-w-3xl text-3xl font-black tracking-tight sm:text-5xl">
                One product story. Seven moments worth showing.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
                The V4 demo stops visitors from wandering through a giant route catalog.
                Pick a story, open the next product moment, and use the proof prompt to
                judge the behavior that actually exists. The tour remembers where you
                went, while real journey evidence remains separate.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {nextStep ? (
                  <Link href={nextStep.route} onClick={() => recordVisit(nextStep.id)}>
                    <Button size="lg" className="shadow-lg shadow-cyan-950/30">
                      {demoProgress.visitedCount ? "Resume" : "Run"} {track.name}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/beta-feedback?route=%2Fbeta-workspace">
                    <Button size="lg">
                      Tour covered · report what broke
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={() => setSession(current => resetV4DemoSession(current))}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset tour
                </Button>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white/70">Tour coverage</span>
                    <span className="text-white/40">
                      {demoProgress.visitedCount}/{demoProgress.totalCount}
                    </span>
                  </div>
                  <Progress value={demoProgress.percent} className="mt-3 h-2" />
                  <p className="mt-2 text-[11px] leading-5 text-white/30">
                    Visited means opened from this demo. It is not a tester pass.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white/70">Underlying evidence</span>
                    <span className="text-white/40">{evidenceAverage}% avg.</span>
                  </div>
                  <Progress value={evidenceAverage} className="mt-3 h-2" />
                  <p className="mt-2 text-[11px] leading-5 text-white/30">
                    This is derived from the existing six-stage journey checklists.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 bg-black/20 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-100/45">
                Demo quality target
              </p>
              <div className="mt-5 space-y-4">
                {[
                  ["Clear start", "One dominant CTA and a resumable story."],
                  ["Real behavior", "Every stop opens an implemented product loop."],
                  ["Proof prompt", "Each moment says what the tester should verify."],
                  ["Honest limits", "No payment, custody, AI-provider, or scale fiction."],
                  ["Closed loop", "The tour ends in feedback instead of a dead end."],
                ].map(([title, copy]) => (
                  <div key={title} className="flex gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200/80" />
                    <div>
                      <strong className="text-sm text-white/85">{title}</strong>
                      <p className="mt-1 text-xs leading-5 text-white/35">{copy}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
                <div className="flex gap-2">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" />
                  <p className="text-xs leading-5 text-white/45">
                    A polished demo can improve product credibility, but it does not
                    establish adoption, production readiness, security certification,
                    revenue, or market value by itself.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        {v4DemoTracks.map(item => {
          const active = item.id === session.trackId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => chooseTrack(item.id)}
              aria-pressed={active}
              className={
                "rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 " +
                (active
                  ? "border-cyan-300/35 bg-cyan-300/[0.08]"
                  : "border-white/10 bg-white/[0.025] hover:border-white/20")
              }
            >
              <div className="flex items-center justify-between gap-2">
                <strong className="text-sm text-white/85">{item.name}</strong>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                  {item.duration}
                </span>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/40">{item.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {steps.map((step, index) => {
          const visited = session.visitedStepIds.includes(step.id);
          const evidencePercent = getV3JourneyCompletionPercent(
            journeyProgress,
            step.flagshipId
          );
          return (
            <Card
              key={step.id}
              className={
                "border-white/10 bg-white/[0.025] text-white transition " +
                (nextStep?.id === step.id ? "ring-1 ring-cyan-300/35" : "")
              }
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-black text-white/55">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-base text-white/90">{step.title}</strong>
                      {visited ? (
                        <Badge variant="outline" className="border-cyan-300/25 text-cyan-100/70">
                          <Eye className="mr-1 h-3 w-3" /> visited
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-white/10 text-white/35">
                          <Circle className="mr-1 h-3 w-3" /> not visited
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={
                          evidencePercent === 100
                            ? "border-emerald-300/25 text-emerald-100/70"
                            : "border-white/10 text-white/35"
                        }
                      >
                        evidence {evidencePercent}%
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/45">{step.promise}</p>
                    <div className="mt-4 rounded-xl border border-violet-300/10 bg-violet-300/[0.035] p-3">
                      <div className="flex gap-2">
                        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-200/70" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-100/45">
                            Proof to look for
                          </p>
                          <p className="mt-1 text-xs leading-5 text-white/45">{step.proof}</p>
                        </div>
                      </div>
                    </div>
                    <Link href={step.route} onClick={() => recordVisit(step.id)}>
                      <Button size="sm" variant={nextStep?.id === step.id ? "default" : "outline"} className="mt-4">
                        {step.actionLabel}
                        <ArrowRight className="ml-2 h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}