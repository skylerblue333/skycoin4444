import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Gauge,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
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
import { crashPoint, demoProof } from "@/lib/flagshipGameEngine";

type RoundState = "idle" | "running" | "cashed" | "crashed";
const STAKES = [5, 10, 25, 50, 100] as const;

function formatCredits(value: number) {
  return Math.max(0, value).toFixed(2);
}

export default function GameCrash() {
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [roundStake, setRoundStake] = useState(25);
  const [autoCashout, setAutoCashout] = useState(0);
  const [seed, setSeed] = useState(4444);
  const [crashAt, setCrashAt] = useState(() => crashPoint(seed));
  const [multiplier, setMultiplier] = useState(1);
  const [state, setState] = useState<RoundState>("idle");
  const [message, setMessage] = useState("Set a demo stake, start the round, then cash out before the curve breaks.");
  const [history, setHistory] = useState<number[]>([]);
  const [trail, setTrail] = useState<number[]>([1]);

  const proof = useMemo(() => demoProof(seed, "crash"), [seed]);

  useEffect(() => {
    if (state !== "running") return;

    const timer = window.setTimeout(() => {
      const next = Number((multiplier + 0.025 + multiplier * 0.012).toFixed(2));

      if (autoCashout > 1 && autoCashout < crashAt && next >= autoCashout) {
        const locked = Number(autoCashout.toFixed(2));
        setMultiplier(locked);
        setTrail(values => [...values, locked].slice(-90));
        setCredits(value => Number((value + roundStake * locked).toFixed(2)));
        setHistory(values => [crashAt, ...values].slice(0, 8));
        setMessage("Auto cash-out locked at " + locked.toFixed(2) + "x.");
        setState("cashed");
        return;
      }

      if (next >= crashAt) {
        setMultiplier(crashAt);
        setTrail(values => [...values, crashAt].slice(-90));
        setHistory(values => [crashAt, ...values].slice(0, 8));
        setMessage("Crashed at " + crashAt.toFixed(2) + "x. The demo stake was consumed.");
        setState("crashed");
        return;
      }

      setMultiplier(next);
      setTrail(values => [...values, next].slice(-90));
    }, 42);

    return () => window.clearTimeout(timer);
  }, [autoCashout, crashAt, multiplier, roundStake, state]);

  function startRound() {
    if (state === "running") return;
    if (!Number.isFinite(stake) || stake <= 0 || stake > credits) {
      setMessage("Choose a valid demo stake within the local credit balance.");
      return;
    }

    const nextSeed = seed + 1;
    const nextCrash = crashPoint(nextSeed);
    setSeed(nextSeed);
    setCrashAt(nextCrash);
    setRoundStake(stake);
    setCredits(value => Number((value - stake).toFixed(2)));
    setMultiplier(1);
    setTrail([1]);
    setMessage("Round live. Cash out before the curve reaches its hidden break point.");
    setState("running");
  }

  function cashOut() {
    if (state !== "running") return;
    const locked = multiplier;
    setCredits(value => Number((value + roundStake * locked).toFixed(2)));
    setHistory(values => [crashAt, ...values].slice(0, 8));
    setMessage("Cashed out at " + locked.toFixed(2) + "x for " + (roundStake * locked).toFixed(2) + " demo credits.");
    setState("cashed");
  }

  function resetCredits() {
    if (state === "running") return;
    setCredits(1000);
    setMessage("Demo credits reset to 1,000. No money or token balance is involved.");
  }

  const chartPoints = trail
    .map((value, index) => {
      const x = trail.length <= 1 ? 0 : (index / (trail.length - 1)) * 100;
      const y = 94 - Math.min(84, Math.log(Math.max(1, value)) * 35);
      return x.toFixed(1) + "," + y.toFixed(1);
    })
    .join(" ");

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-fuchsia-500/15 text-fuchsia-100">CRASH</Badge>
              <Badge variant="outline" className="border-white/10 text-white/40">
                Deterministic demo round
              </Badge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] sm:text-6xl">Ride the curve.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              Lock the multiplier before the hidden seeded crash point. Demo credits are local game state with no cash or token value.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Demo credits</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-3xl font-black">{formatCredits(credits)}</span>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
                onClick={resetCredits}
                disabled={state === "running"}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <Card className="overflow-hidden border-fuchsia-300/15 bg-[radial-gradient(circle_at_50%_30%,rgba(192,38,211,.16),rgba(5,6,10,.95)_60%)] text-white">
            <CardContent className="p-0">
              <div className="relative min-h-[470px] overflow-hidden p-6 sm:p-8">
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-fuchsia-500/10 to-transparent" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                      {state === "running" ? "LIVE ROUND" : state === "crashed" ? "ROUND CRASHED" : state === "cashed" ? "CASHED OUT" : "READY"}
                    </p>
                    <p
                      className={
                        "mt-2 text-7xl font-black tracking-[-0.07em] sm:text-8xl " +
                        (state === "crashed" ? "text-rose-300" : state === "cashed" ? "text-emerald-300" : "text-white")
                      }
                    >
                      {multiplier.toFixed(2)}x
                    </p>
                  </div>
                  <Gauge className="h-8 w-8 text-fuchsia-200/60" />
                </div>

                <div className="absolute inset-x-5 bottom-28 top-32 rounded-2xl border border-white/10 bg-black/20 p-3">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                    <defs>
                      <linearGradient id="crashLine" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    {[25, 50, 75].map(line => (
                      <line key={line} x1="0" x2="100" y1={line} y2={line} stroke="rgba(255,255,255,.07)" strokeWidth="0.5" />
                    ))}
                    <polyline
                      points={chartPoints}
                      fill="none"
                      stroke="url(#crashLine)"
                      strokeWidth="2.2"
                      vectorEffect="non-scaling-stroke"
                      className="text-fuchsia-300"
                    />
                  </svg>
                </div>

                <div className="absolute inset-x-6 bottom-6 sm:inset-x-8">
                  <div className="mb-3 rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white/45">
                    {message}
                  </div>
                  {state === "running" ? (
                    <Button size="lg" className="w-full bg-emerald-500 text-black hover:bg-emerald-400" onClick={cashOut}>
                      <Zap className="mr-2 h-5 w-5" />
                      CASH OUT · {(roundStake * multiplier).toFixed(2)}
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full" onClick={startRound}>
                      <TrendingUp className="mr-2 h-5 w-5" />
                      START ROUND · {stake}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardDescription className="text-white/35">Round setup</CardDescription>
                <CardTitle className="text-xl text-white">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-white/30">Demo stake</p>
                  <div className="flex flex-wrap gap-2">
                    {STAKES.map(value => (
                      <Button
                        key={value}
                        size="sm"
                        variant={stake === value ? "default" : "outline"}
                        className={stake === value ? "" : "border-white/10 bg-white/[0.025] text-white"}
                        onClick={() => setStake(value)}
                        disabled={state === "running"}
                      >
                        {value}
                      </Button>
                    ))}
                  </div>
                </div>

                <label className="block text-xs font-bold uppercase tracking-[0.14em] text-white/30">
                  Auto cash-out
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={autoCashout}
                    onChange={event => setAutoCashout(Math.max(0, Number(event.target.value) || 0))}
                    disabled={state === "running"}
                    className="mt-2 border-white/10 bg-black/20 text-white"
                  />
                  <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-white/25">
                    Set 0 to disable.
                  </span>
                </label>

                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">Demo proof</p>
                  <p className="mt-1 break-all font-mono text-xs text-white/40">{proof}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardDescription className="text-white/35">Recent seeded rounds</CardDescription>
                <CardTitle className="text-lg text-white">Crash history</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {history.length ? history.map((value, index) => (
                    <Badge
                      key={value + "-" + index}
                      variant="outline"
                      className={
                        value >= 3
                          ? "border-emerald-300/20 text-emerald-100"
                          : value < 1.5
                            ? "border-rose-300/20 text-rose-100"
                            : "border-white/10 text-white/50"
                      }
                    >
                      {value.toFixed(2)}x
                    </Badge>
                  )) : (
                    <p className="text-sm text-white/30">Round history appears after you play.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-white/35">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/70" />
              <p>
                No deposit, wallet, purchase, token reward, payout, or withdrawal is connected to this game. Seed strings support repeatable beta testing only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
