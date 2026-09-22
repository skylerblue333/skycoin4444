import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Binary,
  CircleDot,
  Coins,
  Hash,
  Layers3,
  ShieldCheck,
  TrendingUp,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  cryptoChallenge,
  hashHuntRound,
  nextCardRank,
  resolveHighLow,
  roulettePayoutMultiplier,
  simulatePlinko,
  spinRoulette,
  type RouletteBet,
} from "@/lib/flagshipGameEngine";

type ArcadeTab = "plinko" | "high-low" | "roulette" | "crypto";

const VALID_TABS = new Set<ArcadeTab>(["plinko", "high-low", "roulette", "crypto"]);
const STAKES = [5, 10, 25, 50] as const;

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

function formatCredits(value: number): string {
  return Math.max(0, value).toFixed(2);
}

function GameShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-white/10 bg-[#0b0d14] text-white">
      <CardHeader className="border-b border-white/10 bg-white/[0.025]">
        <CardDescription className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-100/45">
          {eyebrow}
        </CardDescription>
        <CardTitle className="text-3xl text-white">{title}</CardTitle>
        <p className="max-w-3xl text-sm leading-6 text-white/40">{description}</p>
      </CardHeader>
      <CardContent className="p-5 sm:p-7">{children}</CardContent>
    </Card>
  );
}

function StakePicker({
  stake,
  setStake,
}: {
  stake: number;
  setStake: (value: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {STAKES.map(value => (
        <Button
          key={value}
          type="button"
          size="sm"
          variant={stake === value ? "default" : "outline"}
          className={stake === value ? "" : "border-white/10 bg-white/[0.025] text-white"}
          onClick={() => setStake(value)}
        >
          {value}
        </Button>
      ))}
    </div>
  );
}

export default function Arcade() {
  const [activeTab, setActiveTab] = useState<ArcadeTab>(tabFromHash);
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [seed, setSeed] = useState(4444);
  const [status, setStatus] = useState("Choose a game and play with demo credits.");

  const [plinkoResult, setPlinkoResult] = useState(() => simulatePlinko(seed));
  const [plinkoHistory, setPlinkoHistory] = useState<string[]>([]);

  const [highLowCard, setHighLowCard] = useState(7);
  const [highLowStreak, setHighLowStreak] = useState(0);
  const [highLowReveal, setHighLowReveal] = useState<number | null>(null);
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
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname + "#" + tab);
    }
  }

  function canPlay(): boolean {
    if (credits < stake) {
      setStatus("Not enough demo credits. Reset the local bankroll to continue.");
      return false;
    }
    return true;
  }

  function resetCredits() {
    setCredits(1000);
    setHighLowStreak(0);
    setStatus("Demo credits reset to 1,000. Nothing of value was deposited or withdrawn.");
  }

  function dropPlinko() {
    if (!canPlay()) return;
    const nextSeed = seed + 1;
    const result = simulatePlinko(nextSeed);
    const payout = stake * result.multiplier;
    setSeed(nextSeed);
    setPlinkoResult(result);
    setCredits(value => Number((value - stake + payout).toFixed(2)));
    setPlinkoHistory(value => [
      "Bucket " + (result.bucket + 1) + " · " + result.multiplier.toFixed(2) + "x",
      ...value,
    ].slice(0, 6));
    setStatus(
      result.multiplier >= 1
        ? "Plinko returned " + payout.toFixed(2) + " demo credits."
        : "Plinko resolved below the demo stake. Try another seeded drop."
    );
  }

  function playHighLow(guess: "higher" | "lower") {
    if (!canPlay()) return;
    const nextSeed = seed + 1;
    const next = nextCardRank(nextSeed);
    const outcome = resolveHighLow(highLowCard, next, guess);
    const payout = outcome === "win" ? stake * 1.9 : outcome === "push" ? stake : 0;
    setSeed(nextSeed);
    setHighLowReveal(next);
    setCredits(value => Number((value - stake + payout).toFixed(2)));
    setHighLowStreak(value => (outcome === "win" ? value + 1 : outcome === "push" ? value : 0));
    setHighLowHistory(value => [
      cardLabel(highLowCard) + " → " + cardLabel(next) + " · " + outcome.toUpperCase(),
      ...value,
    ].slice(0, 6));
    setStatus(
      outcome === "win"
        ? "Correct call. Streak extended."
        : outcome === "push"
          ? "Tie card. Demo stake returned."
          : "Wrong side of the card. Streak reset."
    );
    window.setTimeout(() => {
      setHighLowCard(next);
      setHighLowReveal(null);
    }, 550);
  }

  function chooseRouletteBet(kind: RouletteBet["kind"]) {
    if (kind === "number") {
      setRouletteBet({ kind: "number", number: rouletteNumber });
    } else {
      setRouletteBet({ kind });
    }
  }

  function spinWheel() {
    if (!canPlay()) return;
    const nextSeed = seed + 1;
    const bet = rouletteBet.kind === "number"
      ? { kind: "number" as const, number: rouletteNumber }
      : rouletteBet;
    const result = spinRoulette(nextSeed);
    const multiplier = roulettePayoutMultiplier(result.number, bet);
    const payout = stake * multiplier;
    setSeed(nextSeed);
    setRouletteBet(bet);
    setRouletteResult(result);
    setCredits(value => Number((value - stake + payout).toFixed(2)));
    setRouletteHistory(value => [
      { number: result.number, color: result.color },
      ...value,
    ].slice(0, 8));
    setStatus(
      multiplier > 0
        ? "Wheel hit. " + payout.toFixed(2) + " demo credits returned."
        : "Wheel missed the selected demo bet."
    );
  }

  function answerWalletDefense(index: number) {
    if (challengeAnswer !== null) return;
    setChallengeAnswer(index);
    if (index === challenge.correctIndex) setWalletDefenseScore(value => value + 1);
  }

  function nextCryptoRound() {
    setCryptoSeed(value => value + 1);
    setChallengeAnswer(null);
    setHashChoice(null);
  }

  function chooseHash(index: number) {
    if (hashChoice !== null) return;
    setHashChoice(index);
    if (index === hashRound.answerIndex) setHashScore(value => value + 1);
  }

  return (
    <main className="min-h-screen bg-[#05060a] text-white">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-cyan-500/15 text-cyan-100">Flagship floor</Badge>
              <Badge variant="outline" className="border-white/10 text-white/40">
                No cash or token value
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Plinko · High-Low · Roulette · Crypto Ops
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/40">
              One focused game floor using the shared deterministic beta engine.
              Crash and Blackjack keep their own dedicated tables.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <div className="px-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Demo credits</p>
              <p className="text-2xl font-black">{formatCredits(credits)}</p>
            </div>
            <Button variant="outline" className="border-white/10 bg-white/[0.03] text-white" onClick={resetCredits}>
              Reset
            </Button>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Demo stake</p>
            <StakePicker stake={stake} setStake={setStake} />
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-sm text-white/40">
            {status}
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={changeTab}>
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 sm:grid-cols-4">
            <TabsTrigger value="plinko" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">
              Plinko
            </TabsTrigger>
            <TabsTrigger value="high-low" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">
              High-Low
            </TabsTrigger>
            <TabsTrigger value="roulette" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">
              Roulette
            </TabsTrigger>
            <TabsTrigger value="crypto" className="border border-white/10 bg-white/[0.025] py-3 data-[state=active]:bg-white data-[state=active]:text-black">
              Crypto Ops
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plinko" className="mt-5">
            <GameShell
              eyebrow="Seeded drop"
              title="Plinko Lab"
              description="Ten rows, eleven landing buckets, and a repeatable demo path. The multiplier controls local demo-credit scoring only."
            >
              <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
                <div className="rounded-3xl border border-cyan-300/15 bg-gradient-to-b from-cyan-950/35 to-black/20 p-5 sm:p-7">
                  <div className="space-y-2">
                    {Array.from({ length: 10 }, (_, row) => (
                      <div key={row} className="flex justify-center gap-3" style={{ paddingLeft: row % 2 ? 14 : 0 }}>
                        {Array.from({ length: row + 2 }, (_, peg) => (
                          <span key={peg} className="h-2.5 w-2.5 rounded-full bg-white/45 shadow-[0_0_12px_rgba(255,255,255,.22)]" />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-11 gap-1">
                    {Array.from({ length: 11 }, (_, bucket) => {
                      const selected = plinkoResult.bucket === bucket;
                      const distance = Math.abs(bucket - 5) / 5;
                      const multiplier = 0.45 + Math.pow(distance, 2.15) * 7.55;
                      return (
                        <div
                          key={bucket}
                          className={
                            "rounded-md border px-1 py-2 text-center text-[9px] font-bold " +
                            (selected
                              ? "border-cyan-200 bg-cyan-300 text-black"
                              : "border-white/10 bg-white/[0.03] text-white/40")
                          }
                        >
                          {multiplier.toFixed(1)}x
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-white/45">
                      Last path: <span className="font-mono text-white/70">{plinkoResult.path.join(" ")}</span>
                    </div>
                    <Button onClick={dropPlinko}>
                      <Layers3 className="mr-2 h-4 w-4" />
                      Drop {stake}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="border-white/10 bg-white/[0.025] text-white">
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/30">Last result</p>
                      <p className="mt-2 text-4xl font-black">{plinkoResult.multiplier.toFixed(2)}x</p>
                      <p className="mt-2 break-all font-mono text-[11px] text-white/25">{plinkoResult.proof}</p>
                    </CardContent>
                  </Card>
                  <div className="space-y-2">
                    {plinkoHistory.length ? plinkoHistory.map((item, index) => (
                      <div key={item + index} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/45">
                        {item}
                      </div>
                    )) : (
                      <p className="text-sm text-white/30">Drop history appears here.</p>
                    )}
                  </div>
                </div>
              </div>
            </GameShell>
          </TabsContent>

          <TabsContent value="high-low" className="mt-5">
            <GameShell
              eyebrow="Card streak"
              title="High-Low"
              description="Predict whether the next rank lands above or below the current card. Equal ranks push the demo stake."
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_.8fr]">
                <div className="grid min-h-[360px] place-items-center rounded-3xl border border-amber-300/15 bg-gradient-to-br from-amber-950/25 to-black/25 p-6 text-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">Current card</p>
                    <div className="mx-auto mt-4 grid h-40 w-28 place-items-center rounded-2xl border border-white/20 bg-white text-slate-950 shadow-2xl">
                      <span className="text-5xl font-black">{cardLabel(highLowReveal ?? highLowCard)}</span>
                    </div>
                    <p className="mt-4 text-sm text-white/40">
                      Streak <strong className="text-white">{highLowStreak}</strong>
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                      <Button size="lg" onClick={() => playHighLow("higher")} disabled={highLowReveal !== null}>
                        Higher
                      </Button>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white/15 bg-white/[0.03] text-white"
                        onClick={() => playHighLow("lower")}
                        disabled={highLowReveal !== null}
                      >
                        Lower
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-white/30">Rules</p>
                    <p className="mt-2 text-sm leading-6 text-white/45">
                      Correct calls return 1.9× the demo stake. Ties return the stake. A wrong call resets the streak.
                    </p>
                  </div>
                  {highLowHistory.map((item, index) => (
                    <div key={item + index} className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/45">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </GameShell>
          </TabsContent>

          <TabsContent value="roulette" className="mt-5">
            <GameShell
              eyebrow="Seeded wheel"
              title="Roulette"
              description="Choose red, black, even, odd, or one straight number. Zero is green and loses even/odd/color demo bets."
            >
              <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
                <div>
                  <div className="grid grid-cols-6 gap-2 sm:grid-cols-10">
                    {Array.from({ length: 37 }, (_, number) => {
                      const color = number === 0
                        ? "bg-emerald-600/80"
                        : (number === rouletteResult.number ? "bg-white text-black" : "");
                      const selected = rouletteResult.number === number;
                      return (
                        <div
                          key={number}
                          className={
                            "grid h-11 place-items-center rounded-lg border text-sm font-bold " +
                            (selected
                              ? "border-white bg-white text-black"
                              : number === 0
                                ? "border-emerald-300/20 bg-emerald-500/20 text-emerald-100"
                                : "border-white/10 bg-white/[0.025] text-white/55")
                          }
                          aria-label={color}
                        >
                          {number}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(["red", "black", "even", "odd"] as const).map(kind => (
                      <Button
                        key={kind}
                        size="sm"
                        variant={rouletteBet.kind === kind ? "default" : "outline"}
                        className={rouletteBet.kind === kind ? "" : "border-white/10 bg-white/[0.025] text-white"}
                        onClick={() => chooseRouletteBet(kind)}
                      >
                        {kind.toUpperCase()}
                      </Button>
                    ))}
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={36}
                        value={rouletteNumber}
                        onChange={event => setRouletteNumber(Math.min(36, Math.max(0, Number(event.target.value) || 0)))}
                        className="w-20 border-white/10 bg-white/[0.03] text-white"
                      />
                      <Button
                        size="sm"
                        variant={rouletteBet.kind === "number" ? "default" : "outline"}
                        className={rouletteBet.kind === "number" ? "" : "border-white/10 bg-white/[0.025] text-white"}
                        onClick={() => chooseRouletteBet("number")}
                      >
                        Straight
                      </Button>
                    </div>
                  </div>
                  <Button size="lg" className="mt-5" onClick={spinWheel}>
                    <CircleDot className="mr-2 h-5 w-5" />
                    Spin {stake}
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card className="border-white/10 bg-white/[0.025] text-white">
                    <CardContent className="p-5">
                      <p className="text-xs uppercase tracking-[0.14em] text-white/30">Last spin</p>
                      <div className="mt-3 flex items-end gap-3">
                        <span className="text-6xl font-black">{rouletteResult.number}</span>
                        <Badge
                          className={
                            rouletteResult.color === "red"
                              ? "bg-rose-500/20 text-rose-100"
                              : rouletteResult.color === "black"
                                ? "bg-slate-500/20 text-slate-100"
                                : "bg-emerald-500/20 text-emerald-100"
                          }
                        >
                          {rouletteResult.color}
                        </Badge>
                      </div>
                      <p className="mt-3 break-all font-mono text-[11px] text-white/25">{rouletteResult.proof}</p>
                    </CardContent>
                  </Card>
                  <div className="flex flex-wrap gap-2">
                    {rouletteHistory.map((item, index) => (
                      <span
                        key={item.number + "-" + index}
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-sm font-bold"
                      >
                        {item.number}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GameShell>
          </TabsContent>

          <TabsContent value="crypto" className="mt-5">
            <GameShell
              eyebrow="Crypto skill arcade"
              title="Crypto Ops"
              description="Two crypto-themed skill loops with score only: Hash Hunt and Wallet Defense. Neither touches a wallet or chain."
            >
              <div className="grid gap-5 lg:grid-cols-2">
                <Card className="border-cyan-300/15 bg-cyan-300/[0.035] text-white">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-cyan-200">
                      <Hash className="h-5 w-5" />
                      <CardDescription className="text-cyan-100/45">Pattern recognition</CardDescription>
                    </div>
                    <CardTitle className="text-2xl text-white">Hash Hunt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-white/45">
                      Find the candidate beginning with <strong className="font-mono text-cyan-100">{hashRound.target}</strong>.
                    </p>
                    <div className="mt-4 grid gap-2">
                      {hashRound.candidates.map((candidate, index) => {
                        const chosen = hashChoice === index;
                        const correct = index === hashRound.answerIndex;
                        return (
                          <Button
                            key={candidate}
                            variant="outline"
                            className={
                              "justify-start border-white/10 bg-black/20 font-mono text-white " +
                              (hashChoice !== null && correct ? "border-emerald-300/40 bg-emerald-500/10" : "") +
                              (chosen && !correct ? " border-rose-300/40 bg-rose-500/10" : "")
                            }
                            onClick={() => chooseHash(index)}
                          >
                            {candidate}
                          </Button>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm text-white/40">
                      <span>Score {hashScore}</span>
                      <span className="font-mono text-[10px]">{hashRound.proof}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-violet-300/15 bg-violet-300/[0.035] text-white">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-violet-200">
                      <ShieldCheck className="h-5 w-5" />
                      <CardDescription className="text-violet-100/45">Security decisions</CardDescription>
                    </div>
                    <CardTitle className="text-2xl text-white">Wallet Defense</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-white/65">{challenge.prompt}</p>
                    <div className="mt-4 grid gap-2">
                      {challenge.choices.map((choice, index) => {
                        const chosen = challengeAnswer === index;
                        const correct = index === challenge.correctIndex;
                        return (
                          <Button
                            key={choice}
                            variant="outline"
                            className={
                              "h-auto min-h-11 justify-start whitespace-normal border-white/10 bg-black/20 py-3 text-left text-white " +
                              (challengeAnswer !== null && correct ? "border-emerald-300/40 bg-emerald-500/10" : "") +
                              (chosen && !correct ? " border-rose-300/40 bg-rose-500/10" : "")
                            }
                            onClick={() => answerWalletDefense(index)}
                          >
                            {choice}
                          </Button>
                        );
                      })}
                    </div>
                    {challengeAnswer !== null && (
                      <p className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-sm leading-6 text-white/45">
                        {challenge.explanation}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-white/40">Score {walletDefenseScore}</span>
                      <Button size="sm" onClick={nextCryptoRound} disabled={challengeAnswer === null && hashChoice === null}>
                        Next round
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-sm leading-6 text-white/35">
                <Binary className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200/70" />
                <p>
                  These mechanics teach recognition and wallet-safety concepts. They do not mine cryptocurrency, sign transactions, generate private keys, or connect to a live blockchain.
                </p>
              </div>
            </GameShell>
          </TabsContent>
        </Tabs>

        <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-white/35">
          <span className="inline-flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Demo credits reset locally and cannot be purchased, redeemed, transferred, or withdrawn.
          </span>
          <div className="flex gap-2">
            <Link href="/game-crash">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/[0.03] text-white">
                <TrendingUp className="mr-2 h-4 w-4" />
                Crash
              </Button>
            </Link>
            <Link href="/game-blackjack">
              <Button size="sm" variant="outline" className="border-white/10 bg-white/[0.03] text-white">
                Blackjack
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
