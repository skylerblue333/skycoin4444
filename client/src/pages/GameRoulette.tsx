import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CircleDotDashed, Dices } from "lucide-react";
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
import {
  EUROPEAN_ROULETTE_ORDER,
  roulettePayoutMultiplier,
  spinRoulette,
  type RouletteBet,
} from "@/lib/flagshipGameEngine";

type SimpleBet = "red" | "black" | "even" | "odd" | "number";

export default function GameRoulette() {
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [seed, setSeed] = useState(4444);
  const [betKind, setBetKind] = useState<SimpleBet>("red");
  const [number, setNumber] = useState(7);
  const [result, setResult] = useState<ReturnType<typeof spinRoulette> | null>(null);
  const [won, setWon] = useState<boolean | null>(null);
  const [history, setHistory] = useState<Array<{ number: number; color: string; multiplier: number }>>([]);
  const [message, setMessage] = useState("Choose a European roulette demo bet and spin the seeded wheel.");

  function selectedBet(): RouletteBet {
    if (betKind === "number") return { kind: "number", number };
    return { kind: betKind };
  }

  function spin() {
    if (!Number.isFinite(stake) || stake <= 0 || stake > credits) {
      setMessage("Choose a valid demo stake within the local credit balance.");
      return;
    }
    if (betKind === "number" && (!Number.isInteger(number) || number < 0 || number > 36)) {
      setMessage("Straight-up number must be an integer from 0 through 36.");
      return;
    }

    const nextSeed = seed + 1;
    const next = spinRoulette(nextSeed);
    const multiplier = roulettePayoutMultiplier(next.number, selectedBet());
    const returned = Number((stake * multiplier).toFixed(2));
    setCredits(value => Number((value - stake + returned).toFixed(2)));
    setSeed(nextSeed);
    setResult(next);
    setWon(multiplier > 0);
    setHistory(value => [{ number: next.number, color: next.color, multiplier }, ...value].slice(0, 8));
    setMessage(
      multiplier > 0
        ? `Result ${next.number} ${next.color}. ${multiplier}x returned ${returned.toFixed(2)} demo credits.`
        : `Result ${next.number} ${next.color}. The local demo stake was consumed.`,
    );
  }

  function reset() {
    setCredits(1000);
    setSeed(4444);
    setResult(null);
    setWon(null);
    setHistory([]);
    setMessage("Demo wheel reset. No financial transaction occurred.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080909] text-white">
      <GamingBackdrop />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-rose-400/15 text-rose-100">EUROPEAN ROULETTE V2</Badge>
              <StatusBadge tone={won === true ? "win" : won === false ? "loss" : "neutral"}>
                {result ? result.number + " " + result.color.toUpperCase() : "WHEEL READY"}
              </StatusBadge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">Roulette lab</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
              One-zero European wheel, deterministic seeded outcomes, outside and straight-up demo bets, and transparent local payout math.
            </p>
          </div>
          <DemoBankroll credits={credits} onReset={reset} />
        </header>

        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">
          <GameStage
            eyebrow="37 POCKET EUROPEAN WHEEL"
            title="Spin the seeded wheel"
            description="Every result is reproduced from the local demo seed. This is not cryptographic randomness, a regulated gaming product, or a real-money wagering service."
            accent="from-rose-500/14 via-transparent to-emerald-500/8"
          >
            <div className="relative min-h-[590px] overflow-hidden rounded-[2rem] border border-rose-300/15 bg-[radial-gradient(circle_at_50%_45%,rgba(244,63,94,.13),rgba(7,10,9,.96)_60%)] p-6">
              <div className="mx-auto flex max-w-3xl flex-col items-center">
                <div className="relative grid h-72 w-72 place-items-center rounded-full border-[14px] border-amber-700/50 bg-[conic-gradient(from_0deg,#111_0deg_9.7deg,#9f1239_9.7deg_19.4deg,#111_19.4deg_29.1deg,#9f1239_29.1deg_38.8deg,#111_38.8deg_48.5deg,#9f1239_48.5deg_58.2deg,#111_58.2deg_67.9deg,#9f1239_67.9deg_77.6deg,#111_77.6deg_87.3deg,#9f1239_87.3deg_97deg,#111_97deg_106.7deg,#9f1239_106.7deg_116.4deg,#111_116.4deg_126.1deg,#9f1239_126.1deg_135.8deg,#111_135.8deg_145.5deg,#9f1239_145.5deg_155.2deg,#111_155.2deg_164.9deg,#9f1239_164.9deg_174.6deg,#111_174.6deg_184.3deg,#9f1239_184.3deg_194deg,#111_194deg_203.7deg,#9f1239_203.7deg_213.4deg,#111_213.4deg_223.1deg,#9f1239_223.1deg_232.8deg,#111_232.8deg_242.5deg,#9f1239_242.5deg_252.2deg,#111_252.2deg_261.9deg,#9f1239_261.9deg_271.6deg,#111_271.6deg_281.3deg,#9f1239_281.3deg_291deg,#111_291deg_300.7deg,#9f1239_300.7deg_310.4deg,#111_310.4deg_320.1deg,#9f1239_320.1deg_329.8deg,#111_329.8deg_339.5deg,#9f1239_339.5deg_349.2deg,#166534_349.2deg_360deg)] shadow-2xl">
                  <div className="grid h-36 w-36 place-items-center rounded-full border border-white/20 bg-[#101511] shadow-inner">
                    <div className="text-center">
                      <CircleDotDashed className="mx-auto h-8 w-8 text-amber-200/60" />
                      <p className="mt-2 text-6xl font-black">{result?.number ?? "?"}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-white/35">{result?.color ?? "ready"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
                  {(["red", "black", "even", "odd", "number"] as SimpleBet[]).map(kind => (
                    <Button
                      key={kind}
                      type="button"
                      variant={betKind === kind ? "default" : "outline"}
                      className={betKind === kind ? "" : "border-white/10 bg-white/[0.025] text-white"}
                      onClick={() => setBetKind(kind)}
                    >
                      {kind === "number" ? "Straight" : kind[0].toUpperCase() + kind.slice(1)}
                    </Button>
                  ))}
                </div>

                {betKind === "number" ? (
                  <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                    {Array.from({ length: 37 }, (_, value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setNumber(value)}
                        className={
                          "grid h-9 w-9 place-items-center rounded-lg border text-xs font-bold " +
                          (number === value ? "border-amber-200/50 bg-amber-200/15 text-amber-50" : "border-white/10 bg-black/20 text-white/45")
                        }
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                ) : null}

                <div className="mt-5 w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/58">{message}</div>
                <Button size="lg" className="mt-4 gap-2" onClick={spin}>
                  <Dices className="h-4 w-4" />
                  Spin · {stake} demo credits
                </Button>
              </div>
            </div>
          </GameStage>

          <div className="space-y-4">
            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-xl">Table setup</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <StakeSelector stake={stake} onChange={setStake} />
                <div className="space-y-1 text-xs leading-5 text-white/38">
                  <p>Outside match: 2x total return.</p>
                  <p>Straight-up match: 36x total return.</p>
                  <p>Zero loses even/odd and red/black.</p>
                  <p>Wheel pockets: {EUROPEAN_ROULETTE_ORDER.length}.</p>
                  <p>Current seed: {seed}.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-lg">Spin history</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {history.length ? history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-sm">
                    <span className="text-white/45">{item.number} · {item.color}</span>
                    <strong>{item.multiplier}x</strong>
                  </div>
                )) : <p className="text-sm text-white/28">Completed spins appear here.</p>}
              </CardContent>
            </Card>
            <DemoBoundary compact />
          </div>
        </div>
      </div>
    </main>
  );
}
