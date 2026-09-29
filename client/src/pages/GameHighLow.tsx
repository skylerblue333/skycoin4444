import { useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowLeft, ArrowUp, Layers3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DemoBankroll,
  DemoBoundary,
  GameStage,
  GamingBackdrop,
  StakeSelector,
  StatusBadge,
} from "@/features/gaming/components/ArcadeSurface";
import { nextCardRank, resolveHighLow } from "@/lib/flagshipGameEngine";

const rankLabel = (rank: number) =>
  rank === 1 ? "A" : rank === 11 ? "J" : rank === 12 ? "Q" : rank === 13 ? "K" : String(rank);

export default function GameHighLow() {
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [seed, setSeed] = useState(4444);
  const [current, setCurrent] = useState(() => nextCardRank(4444));
  const [previous, setPrevious] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<"win" | "lose" | "push" | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [history, setHistory] = useState<Array<{ from: number; to: number; guess: "higher" | "lower"; outcome: "win" | "lose" | "push" }>>([]);
  const [message, setMessage] = useState("Predict whether the next seeded rank will be higher or lower.");

  function play(guess: "higher" | "lower") {
    if (!Number.isFinite(stake) || stake <= 0 || stake > credits) {
      setMessage("Choose a valid demo stake within the local credit balance.");
      return;
    }
    const nextSeed = seed + 1;
    const next = nextCardRank(nextSeed);
    const result = resolveHighLow(current, next, guess);
    const multiplier = result === "win" ? 2 : result === "push" ? 1 : 0;
    const returned = Number((stake * multiplier).toFixed(2));
    const nextStreak = result === "win" ? streak + 1 : result === "push" ? streak : 0;

    setCredits(value => Number((value - stake + returned).toFixed(2)));
    setSeed(nextSeed);
    setPrevious(current);
    setCurrent(next);
    setOutcome(result);
    setStreak(nextStreak);
    setBestStreak(value => Math.max(value, nextStreak));
    setHistory(value => [{ from: current, to: next, guess, outcome: result }, ...value].slice(0, 8));
    setMessage(
      result === "win"
        ? `${rankLabel(current)} → ${rankLabel(next)}. Correct: ${returned.toFixed(2)} demo credits returned.`
        : result === "push"
          ? `${rankLabel(current)} → ${rankLabel(next)}. Same rank: demo stake returned.`
          : `${rankLabel(current)} → ${rankLabel(next)}. Prediction missed.`,
    );
  }

  function reset() {
    setCredits(1000);
    setSeed(4444);
    setCurrent(nextCardRank(4444));
    setPrevious(null);
    setOutcome(null);
    setStreak(0);
    setBestStreak(0);
    setHistory([]);
    setMessage("Demo table reset. Predict higher or lower.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#090711] text-white">
      <GamingBackdrop />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-violet-400/15 text-violet-100">HIGH-LOW V2</Badge>
              <StatusBadge tone={outcome === "win" ? "win" : outcome === "lose" ? "loss" : "neutral"}>
                {outcome ? outcome.toUpperCase() : "READY"}
              </StatusBadge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">High-Low</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
              Fast deterministic rank prediction with push handling, streak tracking, reproducible seeds, and browser-local demo credits only.
            </p>
          </div>
          <DemoBankroll credits={credits} onReset={reset} />
        </header>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <GameStage
            eyebrow="SEE ONE RANK · CALL THE NEXT"
            title="Higher or lower?"
            description="Ranks are generated from the shared seeded demo engine. Ace is low; King is high; matching ranks push."
            accent="from-violet-500/14 via-transparent to-cyan-500/8"
          >
            <div className="relative min-h-[560px] overflow-hidden rounded-[2rem] border border-violet-300/15 bg-[radial-gradient(circle_at_50%_25%,rgba(139,92,246,.2),rgba(8,6,18,.96)_64%)] p-6">
              <div className="mx-auto flex max-w-2xl flex-col items-center">
                <Layers3 className="mt-4 h-8 w-8 text-violet-200/60" />
                <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-white/30">Current rank</p>
                <div className="mt-3 grid h-52 w-40 place-items-center rounded-[2rem] border border-white/25 bg-white text-slate-950 shadow-2xl">
                  <span className="text-8xl font-black tracking-[-0.06em]">{rankLabel(current)}</span>
                </div>
                {previous !== null ? (
                  <p className="mt-4 text-sm text-white/35">Previous card: {rankLabel(previous)} · Seed {seed}</p>
                ) : (
                  <p className="mt-4 text-sm text-white/35">Starting seed {seed}</p>
                )}

                <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
                  <Button size="lg" className="h-16 gap-2 text-lg" onClick={() => play("higher")}>
                    <ArrowUp className="h-5 w-5" />
                    Higher
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 gap-2 border-white/15 bg-white/[0.04] text-lg text-white" onClick={() => play("lower")}>
                    <ArrowDown className="h-5 w-5" />
                    Lower
                  </Button>
                </div>
                <div className="mt-5 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/58">
                  {message}
                </div>
              </div>
            </div>
          </GameStage>

          <div className="space-y-4">
            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-xl">Round setup</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <StakeSelector stake={stake} onChange={setStake} />
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Streak</p>
                    <p className="mt-1 text-2xl font-black">{streak}</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
                    <p className="text-[10px] uppercase tracking-wider text-white/30">Best</p>
                    <p className="mt-1 text-2xl font-black">{bestStreak}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-lg">Recent calls</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {history.length ? history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-xs">
                    <span className="text-white/45">{rankLabel(item.from)} → {rankLabel(item.to)} · {item.guess}</span>
                    <strong className={item.outcome === "win" ? "text-emerald-200" : item.outcome === "lose" ? "text-rose-200" : "text-white/70"}>
                      {item.outcome}
                    </strong>
                  </div>
                )) : <p className="text-sm text-white/28">Completed calls appear here.</p>}
              </CardContent>
            </Card>
            <DemoBoundary compact />
          </div>
        </div>
      </div>
    </main>
  );
}
