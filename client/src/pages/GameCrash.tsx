import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Crosshair,
  RotateCcw,
  ShieldCheck,
  Target,
  TimerReset,
  Trophy,
  Zap,
} from "lucide-react";
import { recordArcadeRunToStorage } from "@/lib/arcadePassport";
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

type RoundState = "idle" | "running" | "resolved" | "finished";

const SESSION_ROUNDS = 5;

function seededUnit(seed: number): number {
  const x = Math.sin(seed * 91.73 + 0.417) * 10_000;
  return x - Math.floor(x);
}

function roundConfig(seed: number, round: number) {
  const base = seed + round * 137;
  const target = 1.4 + seededUnit(base) * 2.6;
  const breakPoint = target + 0.35 + seededUnit(base + 9) * 1.6;
  return {
    target: Number(target.toFixed(2)),
    breakPoint: Number(breakPoint.toFixed(2)),
  };
}

function scoreLock(value: number, target: number): number {
  const distance = Math.abs(value - target);
  return Math.max(0, Math.round(1000 - distance * 500));
}

export default function GameCrash() {
  const [state, setState] = useState<RoundState>("idle");
  const [seed, setSeed] = useState(9124);
  const [round, setRound] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [lockedAt, setLockedAt] = useState<number | null>(null);
  const [roundScore, setRoundScore] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [bestRound, setBestRound] = useState(0);
  const [message, setMessage] = useState(
    "Track the rising curve and lock as close to the target band as you can."
  );
  const recorded = useRef(false);

  const config = roundConfig(seed, round);
  const targetLow = Math.max(1, config.target - 0.12);
  const targetHigh = config.target + 0.12;

  useEffect(() => {
    if (state !== "running") return;

    const timer = window.setInterval(() => {
      setMultiplier(current => {
        const step = 0.018 + Math.min(0.045, (current - 1) * 0.0025);
        const next = Number((current + step).toFixed(3));
        if (next >= config.breakPoint) {
          window.clearInterval(timer);
          setRoundScore(0);
          setLockedAt(null);
          setMessage(
            "The curve broke before you locked it. Read the next target and try again."
          );
          setState("resolved");
          return config.breakPoint;
        }
        return next;
      });
    }, 45);

    return () => window.clearInterval(timer);
  }, [config.breakPoint, state]);

  function startSession() {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setRound(1);
    setMultiplier(1);
    setLockedAt(null);
    setRoundScore(0);
    setSessionScore(0);
    setBestRound(0);
    setMessage("Round one started. Lock inside the highlighted target band.");
    recorded.current = false;
    setState("running");
  }

  function lock() {
    if (state !== "running") return;
    const score = scoreLock(multiplier, config.target);
    setLockedAt(multiplier);
    setRoundScore(score);
    setSessionScore(value => value + score);
    setBestRound(value => Math.max(value, score));

    if (multiplier >= targetLow && multiplier <= targetHigh) {
      setMessage("Precision lock! You landed inside the target band.");
    } else if (score >= 700) {
      setMessage("Close lock. Tighten the timing on the next round.");
    } else {
      setMessage("Safe lock, but far from target. Track the band more closely.");
    }
    setState("resolved");
  }

  function nextRound() {
    if (state !== "resolved") return;

    if (round >= SESSION_ROUNDS) {
      setState("finished");
      if (!recorded.current) {
        recordArcadeRunToStorage({
          gameId: "crash-lab",
          score: sessionScore,
          xp: Math.floor(sessionScore / 2),
          sparks: Math.floor(sessionScore / 250),
          combo: bestRound >= 900 ? 1 : 0,
        });
        recorded.current = true;
      }
      return;
    }

    setRound(value => value + 1);
    setMultiplier(1);
    setLockedAt(null);
    setRoundScore(0);
    setMessage("New target. Lock when the curve reaches the band.");
    setState("running");
  }

  const bandPosition = Math.min(100, (config.target / config.breakPoint) * 100);
  const cursorPosition = Math.min(
    100,
    (multiplier / config.breakPoint) * 100
  );
  const average =
    round > 0 ? Math.round(sessionScore / Math.max(1, round - (state === "running" ? 1 : 0))) : 0;

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-5xl space-y-7 px-4 py-8">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/gaming"
              className="mb-3 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-fuchsia-500/15 text-fuchsia-100">
                Reflex lab
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Score only · no wager · no cashout
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Multiplier Reflex Lab
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45">
              Track a deterministic rising curve and lock as close as possible
              to the highlighted target. The multiplier is only a visual timing
              scale; it has no financial or payout meaning.
            </p>
          </div>

          <Link href="/game-fi-quest-board">
            <Button
              variant="outline"
              className="border-white/15 bg-white/[0.03] text-white"
            >
              Arcade Passport
            </Button>
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-4">
          {[
            ["Round", state === "idle" ? "—" : round + "/" + SESSION_ROUNDS],
            ["Session score", sessionScore],
            ["Best round", bestRound],
            ["Average", average || "—"],
          ].map(([label, value]) => (
            <Card
              key={label}
              className="border-white/10 bg-white/[0.03] text-white"
            >
              <CardContent className="p-4">
                <p className="text-2xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        {state === "idle" ? (
          <Card className="border-fuchsia-300/20 bg-fuchsia-300/[0.04] text-white">
            <CardContent className="grid min-h-96 place-items-center p-8 text-center">
              <div>
                <Crosshair className="mx-auto h-12 w-12 text-fuchsia-200" />
                <h2 className="mt-4 text-3xl font-black">
                  Five rounds. Five targets.
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/45">
                  Each round has a deterministic target and break point. Lock
                  early enough to stay alive, but close enough to the target to
                  score well.
                </p>
                <Button size="lg" className="mt-6" onClick={startSession}>
                  <Zap className="mr-2 h-5 w-5" />
                  Start reflex session
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : state === "finished" ? (
          <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
            <CardContent className="grid min-h-96 place-items-center p-8 text-center">
              <div>
                <Trophy className="mx-auto h-12 w-12 text-amber-200" />
                <h2 className="mt-4 text-3xl font-black">Session complete</h2>
                <p className="mt-2 text-white/45">
                  {sessionScore} total timing points · {bestRound} best round.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={startSession}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Run again
                  </Button>
                  <Link href="/game-fi-quest-board">
                    <Button
                      variant="outline"
                      className="border-white/15 bg-white/[0.03] text-white"
                    >
                      View passport
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="overflow-hidden border-fuchsia-300/20 bg-gradient-to-br from-fuchsia-950/50 via-slate-950 to-violet-950/50 text-white">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription className="text-fuchsia-100/50">
                    Round {round} of {SESSION_ROUNDS}
                  </CardDescription>
                  <CardTitle className="mt-1 text-white">
                    Target {config.target.toFixed(2)}x
                  </CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="border-fuchsia-300/20 text-fuchsia-100"
                >
                  Break point hidden during play
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-7">
              <div className="rounded-3xl border border-white/10 bg-black/25 p-6">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-white/30">
                      Current scale
                    </p>
                    <p className="mt-1 text-6xl font-black tracking-tight">
                      {multiplier.toFixed(2)}x
                    </p>
                  </div>
                  <Target className="h-10 w-10 text-fuchsia-200" />
                </div>

                <div className="relative mt-8 h-8 overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                  <div
                    className="absolute inset-y-0 w-12 -translate-x-1/2 bg-emerald-300/25"
                    style={{ left: bandPosition + "%" }}
                  />
                  <div
                    className="absolute inset-y-0 w-1 bg-white shadow-[0_0_16px_rgba(255,255,255,.85)]"
                    style={{ left: cursorPosition + "%" }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-white/25">
                  <span>1.00x</span>
                  <span>target band</span>
                  <span>unknown break</span>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-semibold">{message}</p>
                {state === "resolved" ? (
                  <p className="mt-2 text-sm text-white/40">
                    Round score: {roundScore}
                    {lockedAt !== null
                      ? " · locked at " + lockedAt.toFixed(2) + "x"
                      : " · curve broke before lock"}
                    {" · hidden break point "}
                    {config.breakPoint.toFixed(2)}x
                  </p>
                ) : null}
              </div>

              {state === "running" ? (
                <Button size="lg" className="w-full" onClick={lock}>
                  <TimerReset className="mr-2 h-5 w-5" />
                  Lock timing
                </Button>
              ) : (
                <Button size="lg" className="w-full" onClick={nextRound}>
                  {round >= SESSION_ROUNDS
                    ? "Finish session"
                    : "Start next round"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          This route is a timing/reflex simulation. It has no bet, balance,
          cashout, payout, house edge, fake players, wallet, token transfer,
          wagering recommendation, or real-money execution. The rising
          multiplier is only a visual timing scale.
        </section>
      </div>
    </main>
  );
}
