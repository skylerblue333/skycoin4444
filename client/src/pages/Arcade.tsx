import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowLeft, ArrowUp, Binary, CircleDot, Hash, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DemoBankroll,
  DemoBoundary,
  GameStage,
  GamingBackdrop,
  StakeSelector,
  StatusBadge,
} from "@/features/gaming/components/ArcadeSurface";
import {
  cryptoChallenge,
  EUROPEAN_ROULETTE_ORDER,
  hashHuntRound,
  nextCardRank,
  PLINKO_MULTIPLIERS_10,
  resolveHighLow,
  rouletteColor,
  roulettePayoutMultiplier,
  simulatePlinko,
  spinRoulette,
  type RouletteBet,
} from "@/lib/flagshipGameEngine";

type ArcadeTab = "plinko" | "high-low" | "roulette" | "crypto";
const VALID_TABS = new Set<ArcadeTab>(["plinko", "high-low", "roulette", "crypto"]);

function tabFromHash(): ArcadeTab {
  if (typeof window === "undefined") return "plinko";
  const requested = window.location.hash.slice(1) as ArcadeTab;
  return VALID_TABS.has(requested) ? requested : "plinko";
}

function cardLabel(value: number): string {
  if (value === 1) return "A";
  if (value === 11) return "J";
  if (value === 12) return "Q";
  if (value === 13) return "K";
  return String(value);
}

function credit(value: number) {
  return Math.max(0, value).toFixed(2);
}

export default function Arcade() {
  const [activeTab, setActiveTab] = useState<ArcadeTab>(tabFromHash);
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [seed, setSeed] = useState(4444);
  const [status, setStatus] = useState("Choose a game. Every score and credit on this floor is local demo state.");

  const [plinkoResult, setPlinkoResult] = useState(() => simulatePlinko(seed));
  const [plinkoHistory, setPlinkoHistory] = useState<Array<{ bucket: number; multiplier: number }>>([]);

  const [highLowCard, setHighLowCard] = useState(7);
  const [highLowReveal, setHighLowReveal] = useState<number | null>(null);
  const [highLowStreak, setHighLowStreak] = useState(0);
  const [highLowHistory, setHighLowHistory] = useState<string[]>([]);

  const [rouletteBet, setRouletteBet] = useState<RouletteBet>({ kind: "red" });
  const [rouletteNumber, setRouletteNumber] = useState(7);
  const [rouletteResult, setRouletteResult] = useState(() => spinRoulette(seed));
  const [rouletteHistory, setRouletteHistory] = useState<Array<{ number: number; color: string }>>([]);

  const [cryptoSeed, setCryptoSeed] = useState(8080);
  const [challengeAnswer, setChallengeAnswer] = useState<number | null>(null);
  const [walletDefenseScore, setWalletDefenseScore] = useState(0);
  const [hashChoice, setHashChoice] = useState<number | null>(null);
  const [hashScore, setHashScore] = useState(0);

  const challenge = useMemo(() => cryptoChallenge(cryptoSeed), [cryptoSeed]);
  const hashRound = useMemo(() => hashHuntRound(cryptoSeed + 1000), [cryptoSeed]);

  useEffect(() => {
    const syncHash = () => setActiveTab(tabFromHash());
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  function changeTab(value: string) {
    const tab = VALID_TABS.has(value as ArcadeTab) ? (value as ArcadeTab) : "plinko";
    setActiveTab(tab);
    window.history.replaceState(null, "", window.location.pathname + "#" + tab);
  }

  function canPlay() {
    if (credits < stake) {
      setStatus("Not enough demo credits. Reset the local bankroll to keep testing.");
      return false;
    }
    return true;
  }

  function resetCredits() {
    setCredits(1000);
    setHighLowStreak(0);
    setStatus("Demo credits reset locally and cannot be purchased, redeemed, transferred, or withdrawn.");
  }

  function dropPlinko() {
    if (!canPlay()) return;
    const nextSeed = seed + 1;
    const result = simulatePlinko(nextSeed, 10);
    const payout = stake * result.multiplier;
    setSeed(nextSeed);
    setPlinkoResult(result);
    setCredits(value => Number((value - stake + payout).toFixed(2)));
    setPlinkoHistory(value => [{ bucket: result.bucket, multiplier: result.multiplier }, ...value].slice(0, 7));
    setStatus(
      result.multiplier >= 1
        ? "Plinko landed at " + result.multiplier.toFixed(2) + "x for " + payout.toFixed(2) + " demo credits."
        : "Plinko landed in a center bucket below the demo stake."
    );
  }

  function playHighLow(guess: "higher" | "lower") {
    if (highLowReveal !== null || !canPlay()) return;
    const nextSeed = seed + 1;
    const next = nextCardRank(nextSeed);
    const outcome = resolveHighLow(highLowCard, next, guess);
    const payout = outcome === "win" ? stake * 1.9 : outcome === "push" ? stake : 0;
    setSeed(nextSeed);
    setHighLowReveal(next);
    setCredits(value => Number((value - stake + payout).toFixed(2)));
    setHighLowStreak(value => outcome === "win" ? value + 1 : outcome === "push" ? value : 0);
    setHighLowHistory(value => [
      cardLabel(highLowCard) + " → " + cardLabel(next) + " · " + outcome.toUpperCase(),
      ...value,
    ].slice(0, 7));
    setStatus(outcome === "win" ? "Correct call. Streak extended." : outcome === "push" ? "Tie card. Demo stake returned." : "Wrong call. Streak reset.");
    window.setTimeout(() => {
      setHighLowCard(next);
      setHighLowReveal(null);
    }, 600);
  }

  function chooseRouletteBet(kind: RouletteBet["kind"]) {
    setRouletteBet(kind === "number" ? { kind: "number", number: rouletteNumber } : { kind });
  }

  function spinWheel() {
    if (!canPlay()) return;
    const nextSeed = seed + 1;
    const bet = rouletteBet.kind === "number" ? { kind: "number" as const, number: rouletteNumber } : rouletteBet;
    const result = spinRoulette(nextSeed);
    const multiplier = roulettePayoutMultiplier(result.number, bet);
    const payout = stake * multiplier;
    setSeed(nextSeed);
    setRouletteBet(bet);
    setRouletteResult(result);
    setCredits(value => Number((value - stake + payout).toFixed(2)));
    setRouletteHistory(value => [{ number: result.number, color: result.color }, ...value].slice(0, 10));
    setStatus(multiplier > 0 ? "Roulette hit for " + payout.toFixed(2) + " demo credits." : "Roulette missed the selected demo bet.");
  }

  function answerWalletDefense(index: number) {
    if (challengeAnswer !== null) return;
    setChallengeAnswer(index);
    if (index === challenge.correctIndex) setWalletDefenseScore(value => value + 1);
  }

  function chooseHash(index: number) {
    if (hashChoice !== null) return;
    setHashChoice(index);
    if (index === hashRound.answerIndex) setHashScore(value => value + 1);
  }

  function nextCryptoRound() {
    setCryptoSeed(value => value + 1);
    setChallengeAnswer(null);
    setHashChoice(null);
  }

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
              <Badge className="bg-cyan-500/15 text-cyan-100">ARCADE FLOOR V2</Badge>
              <StatusBadge>No cash or token value</StatusBadge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Plinko · High-Low · Roulette · Crypto Ops
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/42">
              Animated replayable games using a shared deterministic engineering-beta engine.
              Crash and Blackjack keep their own dedicated full-screen tables.
            </p>
          </div>
          <DemoBankroll credits={credits} onReset={resetCredits} />
        </header>

        <section className="grid gap-3 md:grid-cols-[auto_1fr] md:items-end">
          <StakeSelector stake={stake} onChange={setStake} values={[5, 10, 25, 50]} />
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white/44">
            {status}
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={changeTab}>
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-4">
            <TabsTrigger value="plinko" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">Plinko</TabsTrigger>
            <TabsTrigger value="high-low" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">High-Low</TabsTrigger>
            <TabsTrigger value="roulette" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">Roulette</TabsTrigger>
            <TabsTrigger value="crypto" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">Crypto Ops</TabsTrigger>
          </TabsList>

          <TabsContent value="plinko" className="mt-5">
            <GameStage
              eyebrow="ANIMATED SEEDED DROP"
              title="Plinko Lab"
              description="Ten rows, eleven buckets, visible path animation, and a deterministic demo multiplier map."
              accent="from-cyan-500/12 via-transparent to-blue-500/8"
            >
              <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
                <div className="relative min-h-[530px] overflow-hidden rounded-3xl border border-cyan-300/15 bg-[radial-gradient(circle_at_50%_15%,rgba(34,211,238,.13),rgba(2,6,23,.78)_62%)] p-4">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: row + 2 }, (_, peg) => {
                        const count = row + 2;
                        const spacing = 76 / Math.max(1, count - 1);
                        const x = 12 + peg * spacing;
                        const y = 12 + row * 7.2;
                        return <circle key={row + "-" + peg} cx={x} cy={y} r="0.9" fill="rgba(255,255,255,.46)" />;
                      })
                    )}
                    <motion.circle
                      key={seed}
                      r="2.2"
                      fill="#67e8f9"
                      stroke="white"
                      strokeWidth="0.5"
                      initial={{ cx: 50, cy: 3 }}
                      animate={{
                        cx: plinkoResult.points.map(point => point.x),
                        cy: plinkoResult.points.map(point => point.y),
                      }}
                      transition={{ duration: 1.1, times: plinkoResult.points.map((_, index) => index / Math.max(1, plinkoResult.points.length - 1)), ease: "easeInOut" }}
                    />
                  </svg>

                  <div className="absolute inset-x-4 bottom-4 grid grid-cols-11 gap-1">
                    {PLINKO_MULTIPLIERS_10.map((multiplier, bucket) => (
                      <div
                        key={bucket}
                        className={
                          "rounded-md border px-1 py-2 text-center text-[9px] font-black sm:text-[10px] " +
                          (plinkoResult.bucket === bucket
                            ? "border-cyan-100 bg-cyan-300 text-black shadow-lg shadow-cyan-500/25"
                            : "border-white/10 bg-black/45 text-white/55")
                        }
                      >
                        {multiplier}x
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Last landing</p>
                    <p className="mt-2 text-5xl font-black">{plinkoResult.multiplier.toFixed(2)}x</p>
                    <p className="mt-2 text-sm text-white/35">Bucket {plinkoResult.bucket + 1} of 11</p>
                    <Button size="lg" className="mt-5 w-full" onClick={dropPlinko}>Drop chip · {stake}</Button>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Recent drops</p>
                    <div className="mt-3 space-y-2">
                      {plinkoHistory.length ? plinkoHistory.map((item, index) => (
                        <div key={index} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm">
                          <span className="text-white/40">Bucket {item.bucket + 1}</span>
                          <strong>{item.multiplier.toFixed(2)}x</strong>
                        </div>
                      )) : <p className="text-sm text-white/28">Drop history appears here.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </GameStage>
          </TabsContent>

          <TabsContent value="high-low" className="mt-5">
            <GameStage
              eyebrow="FAST CARD RUN"
              title="High-Low"
              description="Predict the next seeded card. Wins return 1.9× demo stake, ties return the stake, and misses reset the streak."
              accent="from-amber-500/12 via-transparent to-orange-500/8"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="grid min-h-[460px] place-items-center rounded-3xl border border-amber-300/15 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,.12),rgba(0,0,0,.22)_65%)] p-6">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Current card</p>
                    <motion.div
                      key={highLowReveal ?? highLowCard}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      className="mx-auto mt-4 grid h-56 w-40 place-items-center rounded-[2rem] border border-white/20 bg-white text-slate-950 shadow-2xl shadow-black/40"
                    >
                      <span className="text-8xl font-black">{cardLabel(highLowReveal ?? highLowCard)}</span>
                    </motion.div>
                    <div className="mt-6 flex justify-center gap-3">
                      <Button size="lg" disabled={highLowReveal !== null} onClick={() => playHighLow("lower")}><ArrowDown className="mr-2 h-5 w-5" />Lower</Button>
                      <Button size="lg" variant="outline" className="border-white/15 bg-white/[0.04] text-white" disabled={highLowReveal !== null} onClick={() => playHighLow("higher")}><ArrowUp className="mr-2 h-5 w-5" />Higher</Button>
                    </div>
                    <p className="mt-5 text-2xl font-black">Streak {highLowStreak}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Run history</p>
                    <div className="mt-3 space-y-2">
                      {highLowHistory.length ? highLowHistory.map((item, index) => (
                        <div key={item + index} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/48">{item}</div>
                      )) : <p className="text-sm text-white/28">Cards appear after the first call.</p>}
                    </div>
                  </div>
                  <DemoBoundary compact />
                </div>
              </div>
            </GameStage>
          </TabsContent>

          <TabsContent value="roulette" className="mt-5">
            <GameStage
              eyebrow="EUROPEAN 37-POCKET WHEEL"
              title="Roulette"
              description="European wheel ordering with animated seeded rotation. Bet red, black, odd, even, or one straight number."
              accent="from-rose-500/12 via-transparent to-red-500/8"
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div className="grid place-items-center rounded-3xl border border-rose-300/15 bg-[radial-gradient(circle,rgba(244,63,94,.10),rgba(0,0,0,.28)_64%)] p-7">
                  <div className="relative aspect-square w-full max-w-[480px]">
                    <div className="absolute left-1/2 top-[-8px] z-20 h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[18px] border-x-transparent border-t-white" />
                    <motion.div
                      key={seed}
                      initial={{ rotate: 0 }}
                      animate={{ rotate: rouletteResult.rotation }}
                      transition={{ duration: 2.2, ease: [0.12, 0.65, 0.2, 1] }}
                      className="absolute inset-0 rounded-full border-[12px] border-[#241a15] shadow-2xl shadow-black/50"
                      style={{
                        background: "conic-gradient(" + EUROPEAN_ROULETTE_ORDER.map((number, index) => {
                          const start = index * (360 / 37);
                          const end = (index + 1) * (360 / 37);
                          const color = number === 0 ? "#059669" : rouletteColor(number) === "red" ? "#dc2626" : "#111827";
                          return color + " " + start + "deg " + end + "deg";
                        }).join(",") + ")",
                      }}
                    >
                      <div className="absolute inset-[20%] rounded-full border border-white/15 bg-[#080a0f] shadow-inner" />
                      <div className="absolute inset-[38%] rounded-full border border-amber-300/20 bg-[#16100b]" />
                    </motion.div>
                    <div className="pointer-events-none absolute inset-0 grid place-items-center">
                      <div className="rounded-full border border-white/10 bg-black/75 px-6 py-4 text-center backdrop-blur">
                        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Result</p>
                        <p className="mt-1 text-5xl font-black">{rouletteResult.number}</p>
                        <p className="text-xs uppercase tracking-[0.14em] text-white/40">{rouletteResult.color}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Select bet</p>
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {(["red", "black", "even", "odd"] as const).map(kind => (
                        <Button key={kind} variant={rouletteBet.kind === kind ? "default" : "outline"} className={rouletteBet.kind === kind ? "" : "border-white/10 bg-white/[0.025] text-white"} onClick={() => chooseRouletteBet(kind)}>
                          {kind.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="36"
                        value={rouletteNumber}
                        onChange={event => setRouletteNumber(Math.min(36, Math.max(0, Number(event.target.value) || 0)))}
                        className="border-white/10 bg-black/25 text-white"
                      />
                      <Button variant={rouletteBet.kind === "number" ? "default" : "outline"} className={rouletteBet.kind === "number" ? "" : "border-white/10 bg-white/[0.025] text-white"} onClick={() => chooseRouletteBet("number")}>Straight</Button>
                    </div>
                    <Button size="lg" className="mt-4 w-full" onClick={spinWheel}>Spin wheel · {stake}</Button>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/30">Last spins</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {rouletteHistory.length ? rouletteHistory.map((item, index) => (
                        <span key={item.number + "-" + index} className={"grid h-9 w-9 place-items-center rounded-full text-xs font-black " + (item.color === "red" ? "bg-red-600" : item.color === "green" ? "bg-emerald-600" : "bg-slate-900 ring-1 ring-white/10")}>{item.number}</span>
                      )) : <p className="text-sm text-white/28">Spin history appears here.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </GameStage>
          </TabsContent>

          <TabsContent value="crypto" className="mt-5">
            <GameStage
              eyebrow="CRYPTO SKILL ARCADE"
              title="Crypto Ops"
              description="Two crypto-themed skill modes. No mining income, wallet connection, token reward, or blockchain transaction is performed."
              accent="from-violet-500/12 via-transparent to-cyan-500/8"
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-cyan-300/15 bg-black/25 p-5">
                  <div className="flex items-center gap-3">
                    <Hash className="h-6 w-6 text-cyan-200" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-100/45">Pattern scan</p>
                      <h3 className="text-2xl font-black">Hash Hunt</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-white/42">Find the candidate beginning with target nibble <strong className="text-white">{hashRound.target}</strong>.</p>
                  <div className="mt-4 grid gap-2">
                    {hashRound.candidates.map((candidate, index) => {
                      const answered = hashChoice !== null;
                      const correct = index === hashRound.answerIndex;
                      return (
                        <Button
                          key={candidate}
                          variant="outline"
                          className={
                            "justify-start border-white/10 bg-white/[0.025] font-mono text-xs text-white " +
                            (answered && correct ? "border-emerald-300/35 bg-emerald-300/[0.08]" : "")
                          }
                          onClick={() => chooseHash(index)}
                          disabled={answered}
                        >
                          {candidate}
                        </Button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-sm font-bold">Score {hashScore}</p>
                </div>

                <div className="rounded-3xl border border-violet-300/15 bg-black/25 p-5">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-6 w-6 text-violet-200" />
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-violet-100/45">Security decisions</p>
                      <h3 className="text-2xl font-black">Wallet Defense</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-white/48">{challenge.prompt}</p>
                  <div className="mt-4 grid gap-2">
                    {challenge.choices.map((choice, index) => {
                      const answered = challengeAnswer !== null;
                      const correct = index === challenge.correctIndex;
                      return (
                        <Button
                          key={choice}
                          variant="outline"
                          className={
                            "h-auto justify-start whitespace-normal border-white/10 bg-white/[0.025] py-3 text-left text-white " +
                            (answered && correct ? "border-emerald-300/35 bg-emerald-300/[0.08]" : "")
                          }
                          onClick={() => answerWalletDefense(index)}
                          disabled={answered}
                        >
                          {choice}
                        </Button>
                      );
                    })}
                  </div>
                  {challengeAnswer !== null && (
                    <p className="mt-4 text-xs leading-5 text-white/40">{challenge.explanation}</p>
                  )}
                  <p className="mt-4 text-sm font-bold">Score {walletDefenseScore}</p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-white/30">
                  <Binary className="h-4 w-4" />
                  Engineering seed {cryptoSeed}
                </div>
                <Button onClick={nextCryptoRound}>Next crypto round</Button>
              </div>
            </GameStage>
          </TabsContent>
        </Tabs>

        <DemoBoundary />
        <p className="text-center text-[11px] leading-5 text-white/25">
          Demo credits reset locally and cannot be purchased, redeemed, transferred, or withdrawn.
        </p>
      </div>
    </main>
  );
}
