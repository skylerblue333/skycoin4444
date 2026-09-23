import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Gauge, Rocket, ShieldCheck, TrendingUp, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DemoBankroll,
  GameStage,
  GamingBackdrop,
  StakeSelector,
  StatusBadge,
} from "@/features/gaming/components/ArcadeSurface";
import { crashCurveMultiplier, crashPoint, demoProof } from "@/lib/flagshipGameEngine";

type RoundState = "idle" | "running" | "cashed" | "crashed";

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
  const [history, setHistory] = useState<Array<{ point: number; outcome: "cash" | "crash" }>>([]);
  const [trail, setTrail] = useState<number[]>([1]);
  const startedAtRef = useRef(0);

  const proof = useMemo(() => demoProof(seed, "crash"), [seed]);

  useEffect(() => {
    if (state !== "running") return;

    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAtRef.current;
      const next = crashCurveMultiplier(elapsed);

      if (autoCashout > 1 && autoCashout < crashAt && next >= autoCashout) {
        const locked = Number(autoCashout.toFixed(2));
        setMultiplier(locked);
        setTrail(values => [...values, locked].slice(-120));
        setCredits(value => Number((value + roundStake * locked).toFixed(2)));
        setHistory(values => [{ point: crashAt, outcome: "cash" }, ...values].slice(0, 10));
        setMessage("Auto cash-out locked at " + locked.toFixed(2) + "x.");
        setState("cashed");
        return;
      }

      if (next >= crashAt) {
        setMultiplier(crashAt);
        setTrail(values => [...values, crashAt].slice(-120));
        setHistory(values => [{ point: crashAt, outcome: "crash" }, ...values].slice(0, 10));
        setMessage("Crashed at " + crashAt.toFixed(2) + "x. The local demo stake was consumed.");
        setState("crashed");
        return;
      }

      setMultiplier(next);
      setTrail(values => [...values, next].slice(-120));
    }, 32);

    return () => window.clearInterval(timer);
  }, [autoCashout, crashAt, roundStake, state]);

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
    startedAtRef.current = performance.now();
    setMessage("Round live. Cash out before the hidden seeded crash point.");
    setState("running");
  }

  function cashOut() {
    if (state !== "running") return;
    const locked = multiplier;
    setCredits(value => Number((value + roundStake * locked).toFixed(2)));
    setHistory(values => [{ point: crashAt, outcome: "cash" }, ...values].slice(0, 10));
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
      const y = 92 - Math.min(82, Math.log(Math.max(1, value)) * 34);
      return x.toFixed(2) + "," + y.toFixed(2);
    })
    .join(" ");

  const rocketX = Math.min(92, Math.max(4, trail.length * 0.9));
  const rocketY = Math.max(10, 91 - Math.min(79, Math.log(Math.max(1, multiplier)) * 34));

  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <GamingBackdrop />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-fuchsia-500/15 text-fuchsia-100">CRASH V2</Badge>
              <StatusBadge tone={state === "running" ? "live" : state === "cashed" ? "win" : state === "crashed" ? "loss" : "neutral"}>
                {state === "running" ? "LIVE ROUND" : state === "cashed" ? "CASHED" : state === "crashed" ? "CRASHED" : "READY"}
              </StatusBadge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">Ride the curve.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
              A smoother timed multiplier run with manual cash-out, autoCashout, seeded crash history, and a dedicated animated stage.
              Demo credits are browser-local and have no cash or token value.
            </p>
          </div>
          <DemoBankroll credits={credits} onReset={resetCredits} disabled={state === "running"} />
        </header>

        <div className="grid gap-5 xl:grid-cols-[1fr_330px]">
          <GameStage
            eyebrow="TIMED MULTIPLIER"
            title={state === "running" ? "Round in motion" : "Crash runway"}
            description="The visible curve is calculated from elapsed time. The seeded break point remains hidden until the round ends."
            accent="from-fuchsia-500/16 via-transparent to-violet-500/8"
          >
            <div className="relative min-h-[560px] overflow-hidden rounded-3xl border border-fuchsia-300/15 bg-[radial-gradient(circle_at_50%_25%,rgba(217,70,239,.14),rgba(2,4,10,.72)_62%)] p-5 sm:p-7">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Multiplier</p>
                  <motion.p
                    key={multiplier.toFixed(2)}
                    initial={{ opacity: 0.82, scale: 0.995 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={
                      "mt-1 text-7xl font-black tracking-[-0.075em] sm:text-8xl " +
                      (state === "crashed" ? "text-rose-300" : state === "cashed" ? "text-emerald-300" : "text-white")
                    }
                  >
                    {multiplier.toFixed(2)}x
                  </motion.p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <Gauge className="h-7 w-7 text-fuchsia-200/70" />
                </div>
              </div>

              <div className="absolute inset-x-5 bottom-28 top-32 overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-3 sm:inset-x-7">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.045)_1px,transparent_1px)] bg-[size:42px_42px]" />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="relative z-10 h-full w-full overflow-visible">
                  <defs>
                    <linearGradient id="crashV2Line" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#f0abfc" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <polyline points={chartPoints} fill="none" stroke="url(#crashV2Line)" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
                  {state === "running" && (
                    <foreignObject x={rocketX - 3} y={rocketY - 5} width="8" height="8">
                      <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="grid h-full w-full place-items-center rounded-full bg-fuchsia-300/15">
                        <Rocket className="h-5 w-5 -rotate-12 text-fuchsia-100" />
                      </motion.div>
                    </foreignObject>
                  )}
                </svg>
              </div>

              <div className="absolute inset-x-5 bottom-5 sm:inset-x-7">
                <div className="mb-3 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-sm text-white/48 backdrop-blur">
                  {message}
                </div>
                {state === "running" ? (
                  <Button size="lg" className="w-full bg-emerald-400 text-black hover:bg-emerald-300" onClick={cashOut}>
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
          </GameStage>

          <div className="space-y-4">
            <Card className="border-white/10 bg-[#090b12]/95 text-white">
              <CardHeader><CardTitle className="text-xl">Round controls</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <StakeSelector stake={stake} onChange={setStake} disabled={state === "running"} />
                <label className="block text-[10px] font-black uppercase tracking-[0.16em] text-white/30">
                  Auto cash-out
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={autoCashout}
                    onChange={event => setAutoCashout(Math.max(0, Number(event.target.value) || 0))}
                    disabled={state === "running"}
                    className="mt-2 border-white/10 bg-black/25 text-white"
                  />
                  <span className="mt-1 block text-[11px] font-normal normal-case tracking-normal text-white/25">Set 0 to disable.</span>
                </label>
                <div className="rounded-2xl border border-white/10 bg-black/25 p-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/25">Demo proof</p>
                  <p className="mt-1 break-all font-mono text-xs text-white/42">{proof}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-[#090b12]/95 text-white">
              <CardHeader><CardTitle className="text-lg">Crash history</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {history.length ? history.map((item, index) => (
                    <div
                      key={item.point + "-" + index}
                      className={
                        "rounded-xl border px-3 py-2 text-center text-sm font-black " +
                        (item.outcome === "cash"
                          ? "border-emerald-300/15 bg-emerald-300/[0.04] text-emerald-100"
                          : "border-rose-300/15 bg-rose-300/[0.04] text-rose-100")
                      }
                    >
                      {item.point.toFixed(2)}x
                    </div>
                  )) : <p className="col-span-2 text-sm text-white/28">Round history appears after you play.</p>}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-white/36">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/70" />
              <p>No deposit, wallet, purchase, token reward, payout, or withdrawal is connected to this game. Seed strings support repeatable beta testing only.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
