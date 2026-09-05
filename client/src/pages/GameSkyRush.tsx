import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  Bolt,
  CirclePause,
  CirclePlay,
  Gamepad2,
  Heart,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  emptyRushScore,
  resolveRushTick,
  rushFrame,
  rushRank,
  type RushLane,
  type RushScore,
} from "@/lib/skyRush";

type GameState = "idle" | "playing" | "paused" | "finished";
type RushMode = "sprint" | "rush" | "endurance";

const MODES: Record<
  RushMode,
  { label: string; gates: number; shields: number; detail: string }
> = {
  sprint: {
    label: "Sprint",
    gates: 30,
    shields: 2,
    detail: "Fast 30-gate run",
  },
  rush: {
    label: "Rush",
    gates: 45,
    shields: 3,
    detail: "Balanced score chase",
  },
  endurance: {
    label: "Endurance",
    gates: 60,
    shields: 4,
    detail: "Long escalating run",
  },
};

const laneLabels = ["Left", "Center", "Right"] as const;

function dailySeed() {
  const today = new Date();
  return (
    today.getUTCFullYear() * 10000 +
    (today.getUTCMonth() + 1) * 100 +
    today.getUTCDate()
  );
}

function bestScoreKey(mode: RushMode) {
  return `sky-rush-best:${mode}`;
}

export default function GameSkyRush() {
  const [mode, setMode] = useState<RushMode>("rush");
  const [gameState, setGameState] = useState<GameState>("idle");
  const [lane, setLane] = useState<RushLane>(1);
  const [tick, setTick] = useState(0);
  const [score, setScore] = useState<RushScore>(() => emptyRushScore());
  const [shields, setShields] = useState(MODES.rush.shields);
  const [seed, setSeed] = useState(dailySeed());
  const [message, setMessage] = useState(
    "Choose a mode, then dodge red gates and collect Sparks."
  );
  const [bestScore, setBestScore] = useState(0);

  const config = MODES[mode];
  const frame = useMemo(() => rushFrame(seed, tick), [seed, tick]);
  const progress = Math.min(100, (tick / config.gates) * 100);
  const gatesLeft = Math.max(0, config.gates - tick);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = Number.parseInt(
      window.localStorage.getItem(bestScoreKey(mode)) ?? "0",
      10
    );
    setBestScore(Number.isFinite(stored) && stored > 0 ? stored : 0);
  }, [mode]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const delay = Math.max(430, 980 - (frame.speedTier - 1) * 115);
    const timer = window.setTimeout(() => {
      const result = resolveRushTick({
        lane,
        frame,
        previous: score,
      });

      setScore(result.next);

      if (result.crashed) {
        setMessage("Impact! Shield lost — combo reset.");
        setShields(current => {
          const next = Math.max(0, current - 1);
          if (next === 0) {
            setGameState("finished");
          }
          return next;
        });
      } else if (result.collectedBonus) {
        setMessage("Power Spark! +3 Sparks and a combo boost.");
      } else if (result.collectedSpark) {
        setMessage("Spark collected — keep the chain alive.");
      } else {
        setMessage("Clean gate. Shift lanes for the next pattern.");
      }

      setTick(current => {
        const next = current + 1;
        if (next >= config.gates) {
          setGameState("finished");
        }
        return next;
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [config.gates, frame, gameState, lane, score]);

  useEffect(() => {
    if (gameState !== "finished") return;
    if (typeof window === "undefined") return;
    if (score.score > bestScore) {
      window.localStorage.setItem(
        bestScoreKey(mode),
        String(score.score)
      );
      setBestScore(score.score);
    }
  }, [bestScore, gameState, mode, score.score]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
        event.preventDefault();
        setLane(current => Math.max(0, current - 1) as RushLane);
      }
      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
        event.preventDefault();
        setLane(current => Math.min(2, current + 1) as RushLane);
      }
      if (event.key === " " && gameState === "playing") {
        event.preventDefault();
        setGameState("paused");
      } else if (event.key === " " && gameState === "paused") {
        event.preventDefault();
        setGameState("playing");
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameState]);

  function start(nextMode = mode) {
    const selected = MODES[nextMode];
    setMode(nextMode);
    setSeed(dailySeed());
    setLane(1);
    setTick(0);
    setScore(emptyRushScore());
    setShields(selected.shields);
    setMessage("Run started — dodge red, collect cyan.");
    setGameState("playing");
  }

  const rank = rushRank(score.score);
  const laneGradient = [
    "from-fuchsia-500/25 to-violet-500/5",
    "from-sky-500/25 to-blue-500/5",
    "from-emerald-500/25 to-teal-500/5",
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-12 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-[-10rem] top-72 h-96 w-96 rounded-full bg-sky-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl space-y-6 px-4 py-8">
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
              <Badge className="bg-violet-500/15 text-violet-100">
                New arcade beta
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                No wager · no cash value
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              SKY RUSH
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Shift across three lanes, dodge red gates, collect cyan Sparks,
              and chain clean moves as the run accelerates. Sparks and score are
              game-only session values.
            </p>
          </div>

          <div className="flex gap-2">
            <Link href="/sky-school">
              <Button
                variant="outline"
                className="border-white/15 bg-white/[0.03] text-white"
              >
                <BookLinkIcon />
                Learn first
              </Button>
            </Link>
            <Link href="/arcade">
              <Button
                variant="outline"
                className="border-white/15 bg-white/[0.03] text-white"
              >
                <Gamepad2 className="mr-2 h-4 w-4" />
                Arcade Lab
              </Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-4">
          {[
            ["Score", score.score.toLocaleString(), Trophy],
            ["Sparks", score.sparks.toString(), Sparkles],
            ["Combo", `${score.combo}x`, Zap],
            ["Best", bestScore.toLocaleString(), Bolt],
          ].map(([label, value, Icon]) => (
            <div
              key={label as string}
              className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
            >
              <Icon className="h-4 w-4 text-sky-200" />
              <p className="mt-3 text-2xl font-black">{value}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-white/30">
                {label}
              </p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[2rem] border border-white/10 bg-black/35 p-4 shadow-2xl shadow-violet-950/30 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                  {gameState === "finished"
                    ? "Run complete"
                    : `${gatesLeft} gates remaining`}
                </p>
                <p
                  className="mt-1 text-sm text-white/55"
                  role="status"
                  aria-live="polite"
                >
                  {message}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: config.shields }).map((_, index) => (
                  <Heart
                    key={index}
                    className={
                      "h-5 w-5 " +
                      (index < shields
                        ? "fill-rose-400 text-rose-300"
                        : "text-white/15")
                    }
                  />
                ))}
              </div>
            </div>

            <Progress value={progress} className="mb-5 h-2" />

            <div className="grid min-h-[420px] grid-cols-3 gap-2 sm:gap-4">
              {[0, 1, 2].map(index => {
                const thisLane = index as RushLane;
                const occupied = frame.obstacleLane === thisLane;
                const spark = frame.sparkLane === thisLane;
                const bonus = frame.bonusLane === thisLane;
                const active = lane === thisLane;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setLane(thisLane)}
                    aria-label={`Move to ${laneLabels[index]} lane`}
                    aria-pressed={active}
                    disabled={gameState === "idle" || gameState === "finished"}
                    className={
                      "relative overflow-hidden rounded-[1.6rem] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 " +
                      (active
                        ? "border-white/45 bg-white/[0.08] shadow-[0_0_35px_rgba(56,189,248,0.18)]"
                        : "border-white/[0.08] bg-white/[0.025]")
                    }
                  >
                    <div
                      className={
                        "absolute inset-0 bg-gradient-to-b opacity-80 " +
                        laneGradient[index]
                      }
                    />
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/[0.05] to-transparent" />

                    <div className="relative flex h-full flex-col items-center justify-between px-2 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
                        {laneLabels[index]}
                      </span>

                      <div className="space-y-4 text-center">
                        {occupied ? (
                          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl border border-rose-300/40 bg-rose-500/20 shadow-[0_0_28px_rgba(244,63,94,0.22)]">
                            <Shield className="h-8 w-8 rotate-45 text-rose-200" />
                          </div>
                        ) : spark ? (
                          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-cyan-300/35 bg-cyan-400/15 shadow-[0_0_35px_rgba(34,211,238,0.25)]">
                            <Sparkles className="h-9 w-9 text-cyan-100" />
                          </div>
                        ) : bonus ? (
                          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-amber-300/35 bg-amber-400/15 shadow-[0_0_35px_rgba(251,191,36,0.22)]">
                            <Bolt className="h-9 w-9 text-amber-100" />
                          </div>
                        ) : (
                          <div className="mx-auto h-20 w-20 rounded-full border border-white/[0.05] bg-white/[0.015]" />
                        )}
                      </div>

                      <div
                        className={
                          "grid h-14 w-14 place-items-center rounded-2xl border transition-all " +
                          (active
                            ? "scale-110 border-sky-200/60 bg-sky-300/20 shadow-[0_0_28px_rgba(125,211,252,0.25)]"
                            : "border-white/10 bg-black/30")
                        }
                      >
                        <span className="text-xl">🚀</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <Button
                type="button"
                size="lg"
                variant="outline"
                disabled={gameState === "idle" || gameState === "finished"}
                onClick={() =>
                  setLane(current => Math.max(0, current - 1) as RushLane)
                }
                className="border-white/15 bg-white/[0.03] text-white"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Left
              </Button>

              {gameState === "playing" ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setGameState("paused")}
                >
                  <CirclePause className="mr-2 h-5 w-5" />
                  Pause
                </Button>
              ) : gameState === "paused" ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setGameState("playing")}
                >
                  <CirclePlay className="mr-2 h-5 w-5" />
                  Resume
                </Button>
              ) : (
                <Button type="button" size="lg" onClick={() => start()}>
                  <CirclePlay className="mr-2 h-5 w-5" />
                  {gameState === "finished" ? "Run again" : "Start run"}
                </Button>
              )}

              <Button
                type="button"
                size="lg"
                variant="outline"
                disabled={gameState === "idle" || gameState === "finished"}
                onClick={() =>
                  setLane(current => Math.min(2, current + 1) as RushLane)
                }
                className="border-white/15 bg-white/[0.03] text-white"
              >
                Right
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                Mode
              </p>
              <div className="mt-3 grid gap-2">
                {(Object.entries(MODES) as Array<
                  [RushMode, (typeof MODES)[RushMode]]
                >).map(([id, item]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      if (gameState === "playing") return;
                      setMode(id);
                      setShields(item.shields);
                    }}
                    className={
                      "rounded-2xl border p-3 text-left transition " +
                      (mode === id
                        ? "border-violet-300/35 bg-violet-300/[0.08]"
                        : "border-white/[0.08] bg-black/20 hover:border-white/20")
                    }
                  >
                    <div className="flex items-center justify-between">
                      <strong>{item.label}</strong>
                      <span className="text-xs text-white/35">
                        {item.gates} gates
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-white/35">{item.detail}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-sky-300/20 bg-sky-300/[0.045] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-100/60">
                Session rank
              </p>
              <p className="mt-2 text-3xl font-black text-sky-100">{rank}</p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Best combo {score.bestCombo}x · distance {score.distance}. This
                rank exists only for the game session/device.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-sm font-bold">Controls</p>
              <p className="mt-2 text-xs leading-5 text-white/40">
                Tap a lane, use the Left/Right buttons, or press A/D or the
                arrow keys. Space pauses and resumes.
              </p>
              <p className="mt-3 text-xs leading-5 text-white/30">
                The daily seed makes today's obstacle pattern repeatable for
                testing. Local best score uses browser storage only and is not
                an account leaderboard.
              </p>
            </div>

            {gameState === "finished" ? (
              <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.05] p-5">
                <Trophy className="h-6 w-6 text-emerald-200" />
                <p className="mt-3 text-lg font-bold">Run finished</p>
                <p className="mt-1 text-sm text-white/45">
                  {score.score.toLocaleString()} points · {score.sparks} Sparks
                  · {score.bestCombo}x best combo.
                </p>
                <Button
                  type="button"
                  className="mt-4 w-full"
                  onClick={() => start()}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Replay same daily pattern
                </Button>
              </div>
            ) : null}
          </aside>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <Shield className="mr-2 inline h-4 w-4 text-emerald-200" />
          Sky Rush is deterministic arcade software. Sparks, score, ranks, and
          device-local bests have no monetary value and do not represent
          cryptocurrency, donations, wagering, custody, settlement, or
          blockchain transactions.
        </section>
      </div>
    </main>
  );
}

function BookLinkIcon() {
  return <span className="mr-2" aria-hidden="true">📚</span>;
}
