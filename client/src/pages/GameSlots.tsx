import { useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { useArcadeRunRecorder } from "@/hooks/useArcadePassportSync";
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

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "🚀", "🌙"] as const;
const SESSION_ROUNDS = 10;

type PatternRound = Readonly<{
  rows: readonly (readonly string[])[];
  targetRow: number;
  startColumn: number;
}>;

function seededUnit(seed: number): number {
  const x = Math.sin(seed * 77.31 + 14.19) * 20_000;
  return x - Math.floor(x);
}

function symbolAt(seed: number): string {
  return SYMBOLS[
    Math.floor(seededUnit(seed) * SYMBOLS.length)
  ] ?? "🍒";
}

function safeRow(seed: number): string[] {
  const row: string[] = [];
  for (let index = 0; index < 5; index += 1) {
    let symbol = symbolAt(seed + index * 17);
    if (index > 0 && symbol === row[index - 1]) {
      const current = SYMBOLS.indexOf(symbol as (typeof SYMBOLS)[number]);
      symbol = SYMBOLS[(current + 1) % SYMBOLS.length] ?? "🍋";
    }
    row.push(symbol);
  }
  return row;
}

function createPatternRound(seed: number, round: number): PatternRound {
  const base = seed + round * 131;
  const targetRow = Math.floor(seededUnit(base + 3) * 3);
  const startColumn = Math.floor(seededUnit(base + 7) * 3);
  const rows = [safeRow(base + 11), safeRow(base + 29), safeRow(base + 47)];
  const patternSymbol = symbolAt(base + 83);

  rows[targetRow][startColumn] = patternSymbol;
  rows[targetRow][startColumn + 1] = patternSymbol;
  rows[targetRow][startColumn + 2] = patternSymbol;

  return {
    rows,
    targetRow,
    startColumn,
  };
}

export default function GameSlots() {
  const { recordRun } = useArcadeRunRecorder();
  const [seed, setSeed] = useState(501);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(1);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [sparks, setSparks] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const recorded = useRef(false);

  const pattern = createPatternRound(seed, round);
  const answered = selectedRow !== null;
  const correct = selectedRow === pattern.targetRow;

  function startSession() {
    setSeed(value => value + 1);
    setSessionStarted(true);
    setFinished(false);
    setRound(1);
    setSelectedRow(null);
    setScore(0);
    setSparks(0);
    setXp(0);
    setStreak(0);
    setBestStreak(0);
    recorded.current = false;
  }

  function chooseRow(index: number) {
    if (!sessionStarted || finished || answered) return;
    setSelectedRow(index);

    if (index === pattern.targetRow) {
      const nextStreak = streak + 1;
      const bonus = nextStreak >= 5 ? 50 : nextStreak >= 3 ? 25 : 0;
      setScore(value => value + 100 + bonus);
      setSparks(value => value + 2 + (bonus > 0 ? 1 : 0));
      setXp(value => value + 75 + bonus);
      setStreak(nextStreak);
      setBestStreak(value => Math.max(value, nextStreak));
    } else {
      setStreak(0);
    }
  }

  function nextRound() {
    if (!answered) return;

    if (round >= SESSION_ROUNDS) {
      setFinished(true);
      if (!recorded.current) {
        recordRun({
          gameId: "pattern-lab",
          score,
          sparks,
          xp,
          combo: bestStreak,
        });
        recorded.current = true;
      }
      return;
    }

    setRound(value => value + 1);
    setSelectedRow(null);
  }

  const progress = sessionStarted
    ? (round / SESSION_ROUNDS) * 100
    : 0;

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
              <Badge className="bg-amber-500/15 text-amber-100">
                Pattern lab
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                Manual rounds · no auto-spin · no betting
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black sm:text-5xl">
              Pattern Match Lab
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/45">
              Each round contains one row with a three-symbol adjacent pattern.
              Scan the board, choose the matching row, and build an accuracy
              streak. The reel-like presentation is visual only.
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
            ["Round", sessionStarted ? round + "/" + SESSION_ROUNDS : "—"],
            ["Score", score],
            ["Streak", streak],
            ["Best streak", bestStreak],
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

        {!sessionStarted ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="grid min-h-96 place-items-center p-8 text-center">
              <div>
                <Eye className="mx-auto h-12 w-12 text-amber-200" />
                <h2 className="mt-4 text-3xl font-black">
                  Ten pattern rounds
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/45">
                  Find the row containing three identical adjacent symbols.
                  Correct answers build a combo and add device-local Study XP
                  and Sparks to the Arcade Passport.
                </p>
                <Button size="lg" className="mt-6" onClick={startSession}>
                  <Target className="mr-2 h-5 w-5" />
                  Start pattern session
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : finished ? (
          <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
            <CardContent className="grid min-h-96 place-items-center p-8 text-center">
              <div>
                <Trophy className="mx-auto h-12 w-12 text-amber-200" />
                <h2 className="mt-4 text-3xl font-black">Session complete</h2>
                <p className="mt-2 text-white/45">
                  {score} points · {xp} Study XP · {sparks} Sparks ·{" "}
                  {bestStreak} best streak.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={startSession}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play again
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
          <Card className="overflow-hidden border-amber-300/20 bg-gradient-to-br from-amber-950/45 via-slate-950 to-violet-950/45 text-white">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardDescription className="text-amber-100/50">
                    Round {round} of {SESSION_ROUNDS}
                  </CardDescription>
                  <CardTitle className="mt-1 text-white">
                    Which row contains the triple?
                  </CardTitle>
                </div>
                {streak >= 3 ? (
                  <Badge className="bg-orange-500/15 text-orange-100">
                    {streak} streak
                  </Badge>
                ) : null}
              </div>
              <Progress value={progress} className="mt-3 h-1.5" />
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-3xl border border-white/10 bg-black/30 p-4 sm:p-6">
                <div className="space-y-3">
                  {pattern.rows.map((row, rowIndex) => {
                    const selected = selectedRow === rowIndex;
                    const target = pattern.targetRow === rowIndex;
                    return (
                      <button
                        key={rowIndex}
                        type="button"
                        disabled={answered}
                        onClick={() => chooseRow(rowIndex)}
                        className={
                          "flex w-full items-center justify-between gap-3 rounded-2xl border p-3 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50 " +
                          (answered && target
                            ? "border-emerald-300/35 bg-emerald-300/[0.07]"
                            : answered && selected && !target
                              ? "border-rose-300/35 bg-rose-300/[0.06]"
                              : "border-white/10 bg-white/[0.025] hover:border-amber-300/25")
                        }
                      >
                        <span className="w-10 text-left text-xs font-bold uppercase tracking-[0.12em] text-white/30">
                          Row {rowIndex + 1}
                        </span>
                        <span className="flex flex-1 justify-center gap-2 sm:gap-4">
                          {row.map((symbol, column) => (
                            <span
                              key={column}
                              className="grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-white text-2xl shadow-lg sm:h-14 sm:w-14 sm:text-3xl"
                            >
                              {symbol}
                            </span>
                          ))}
                        </span>
                        <span className="w-6">
                          {answered && target ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                          ) : answered && selected ? (
                            <XCircle className="h-5 w-5 text-rose-200" />
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {answered ? (
                <div
                  className={
                    "rounded-2xl border p-4 text-sm " +
                    (correct
                      ? "border-emerald-300/20 bg-emerald-300/[0.05] text-emerald-100"
                      : "border-amber-300/20 bg-amber-300/[0.05] text-amber-100")
                  }
                  role="status"
                >
                  {correct
                    ? "Pattern found. Nice scan."
                    : "Not this time—the highlighted row contains the three-symbol pattern."}
                </div>
              ) : (
                <p className="text-center text-sm text-white/35">
                  Look for exactly three identical adjacent symbols.
                </p>
              )}

              {answered ? (
                <Button className="w-full" size="lg" onClick={nextRound}>
                  {round >= SESSION_ROUNDS
                    ? "Finish session"
                    : "Next pattern"}
                </Button>
              ) : null}
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 sm:grid-cols-2">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <Sparkles className="h-5 w-5 text-cyan-200" />
              <CardTitle className="mt-2 text-base text-white">
                Local progression
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-white/40">
              Correct scans add device-local Study XP and Sparks. They are
              scoring labels only and have no transferable or monetary value.
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <Star className="h-5 w-5 text-amber-200" />
              <CardTitle className="mt-2 text-base text-white">
                Manual play only
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-white/40">
              Every round requires an explicit choice. There is no auto-spin,
              wager sizing, balance depletion, payout animation, jackpot, or RTP
              model.
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          This route is a local pattern-recognition game. It has no wager,
          betting balance, payout, prize, jackpot, auto-spin, RTP, house edge,
          wallet, token transfer, or real-money execution.
        </section>
      </div>
    </main>
  );
}
