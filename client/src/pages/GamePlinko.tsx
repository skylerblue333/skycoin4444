import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CircleDot, RefreshCw } from "lucide-react";
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
import { PLINKO_MULTIPLIERS_10, simulatePlinko } from "@/lib/flagshipGameEngine";

export default function GamePlinko() {
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [seed, setSeed] = useState(4444);
  const [lastSeed, setLastSeed] = useState(4444);
  const [bucket, setBucket] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<number | null>(null);
  const [path, setPath] = useState<readonly { x: number; y: number }[]>([]);
  const [history, setHistory] = useState<Array<{ bucket: number; multiplier: number }>>([]);
  const [message, setMessage] = useState("Choose a demo stake and drop a deterministic test ball.");

  const polyline = useMemo(
    () => path.map(point => `${point.x},${point.y}`).join(" "),
    [path],
  );

  function dropBall() {
    if (!Number.isFinite(stake) || stake <= 0 || stake > credits) {
      setMessage("Choose a valid demo stake within the local credit balance.");
      return;
    }
    const nextSeed = seed + 1;
    const result = simulatePlinko(nextSeed, 10);
    const returned = Number((stake * result.multiplier).toFixed(2));
    setCredits(value => Number((value - stake + returned).toFixed(2)));
    setSeed(nextSeed);
    setLastSeed(nextSeed);
    setBucket(result.bucket);
    setMultiplier(result.multiplier);
    setPath(result.points);
    setHistory(value => [
      { bucket: result.bucket, multiplier: result.multiplier },
      ...value,
    ].slice(0, 8));
    setMessage(
      `Bucket ${result.bucket} returned ${returned.toFixed(2)} demo credits at ${result.multiplier.toFixed(2)}x.`,
    );
  }

  function reset() {
    setCredits(1000);
    setSeed(4444);
    setLastSeed(4444);
    setBucket(null);
    setMultiplier(null);
    setPath([]);
    setHistory([]);
    setMessage("Demo credits reset. No deposit, withdrawal, or transfer occurred.");
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070914] text-white">
      <GamingBackdrop />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-cyan-400/15 text-cyan-100">PLINKO LAB V2</Badge>
              <StatusBadge tone={multiplier !== null && multiplier >= 1 ? "win" : multiplier !== null ? "loss" : "neutral"}>
                {multiplier === null ? "BOARD READY" : multiplier.toFixed(2) + "x"}
              </StatusBadge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">Plinko lab</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
              A ten-row deterministic physics-style board driven by the shared seeded game engine. Every completed drop exposes its local seed and bucket.
            </p>
          </div>
          <DemoBankroll credits={credits} onReset={reset} />
        </header>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <GameStage
            eyebrow="DETERMINISTIC TEN-ROW BOARD"
            title="Drop the ball"
            description="The path is generated locally from a reproducible seed. It is a game simulation, not a random-number certification or gambling system."
            accent="from-cyan-500/14 via-transparent to-fuchsia-500/8"
          >
            <div className="relative min-h-[590px] overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[radial-gradient(circle_at_50%_10%,rgba(34,211,238,.14),rgba(5,8,20,.96)_65%)] p-5">
              <div className="mx-auto max-w-3xl">
                <div className="relative aspect-[4/5] max-h-[500px] w-full">
                  <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Ten row Plinko demo board">
                    {Array.from({ length: 10 }, (_, row) =>
                      Array.from({ length: row + 1 }, (_, peg) => {
                        const x = 50 + (peg - row / 2) * (78 / 10);
                        const y = 12 + row * 7.2;
                        return <circle key={row + "-" + peg} cx={x} cy={y} r="0.9" fill="rgba(255,255,255,.58)" />;
                      }),
                    )}
                    {polyline ? (
                      <polyline
                        points={polyline}
                        fill="none"
                        stroke="rgba(103,232,249,.8)"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    ) : null}
                    {path.length ? (
                      <circle
                        cx={path[path.length - 1]?.x ?? 50}
                        cy={path[path.length - 1]?.y ?? 3}
                        r="2.1"
                        fill="white"
                      />
                    ) : (
                      <circle cx="50" cy="3" r="2.1" fill="white" />
                    )}
                  </svg>
                </div>
                <div className="grid grid-cols-11 gap-1">
                  {PLINKO_MULTIPLIERS_10.map((value, index) => (
                    <div
                      key={index}
                      className={
                        "rounded-lg border px-1 py-2 text-center text-[10px] font-black " +
                        (bucket === index
                          ? "border-cyan-200/50 bg-cyan-300/15 text-cyan-50"
                          : "border-white/10 bg-black/20 text-white/35")
                      }
                    >
                      {value}x
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/58">
                  {message}
                </div>
                <Button size="lg" className="mt-4 gap-2" onClick={dropBall}>
                  <CircleDot className="h-4 w-4" />
                  Drop · {stake} demo credits
                </Button>
              </div>
            </div>
          </GameStage>

          <div className="space-y-4">
            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-xl">Drop setup</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <StakeSelector stake={stake} onChange={setStake} />
                <div className="rounded-xl border border-white/10 bg-white/[0.025] p-3 text-xs leading-5 text-white/40">
                  <p>Last seed: <strong className="text-white/70">{lastSeed}</strong></p>
                  <p>Rows: <strong className="text-white/70">10</strong></p>
                  <p>Bucket: <strong className="text-white/70">{bucket ?? "—"}</strong></p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-lg">Recent drops</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {history.length ? history.map((item, index) => (
                  <div key={index} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-sm">
                    <span className="text-white/45">Bucket {item.bucket}</span>
                    <strong>{item.multiplier.toFixed(2)}x</strong>
                  </div>
                )) : <p className="text-sm text-white/28">Completed drops appear here.</p>}
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full gap-2 border-white/10 bg-white/[0.025]" onClick={reset}>
              <RefreshCw className="h-4 w-4" />
              Reset demo table
            </Button>
            <DemoBoundary compact />
          </div>
        </div>
      </div>
    </main>
  );
}
