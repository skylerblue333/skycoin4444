import { useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Trophy,
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

type Suit = "♠" | "♥" | "♦" | "♣";
type Rank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";
type PlayingCard = Readonly<{ suit: Suit; rank: Rank }>;
type Decision = "hit" | "stand";
type SessionState = "idle" | "playing" | "finished";

const suits: readonly Suit[] = ["♠", "♥", "♦", "♣"];
const ranks: readonly Rank[] = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];
const SESSION_ROUNDS = 5;

function seededUnit(seed: number): number {
  const x = Math.sin(seed * 12_989.42 + 78.233) * 43_758.5453;
  return x - Math.floor(x);
}

function cardAt(seed: number, offset: number): PlayingCard {
  const rankIndex = Math.floor(seededUnit(seed + offset * 17) * ranks.length);
  const suitIndex = Math.floor(seededUnit(seed + offset * 31) * suits.length);
  return {
    rank: ranks[rankIndex] ?? "A",
    suit: suits[suitIndex] ?? "♠",
  };
}

function cardValue(rank: Rank): number {
  if (rank === "A") return 11;
  if (rank === "K" || rank === "Q" || rank === "J") return 10;
  return Number(rank);
}

function handValue(hand: readonly PlayingCard[]): number {
  let total = hand.reduce((sum, card) => sum + cardValue(card.rank), 0);
  let aces = hand.filter(card => card.rank === "A").length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return total;
}

function hasSoftAce(hand: readonly PlayingCard[]): boolean {
  const raw = hand.reduce((sum, card) => sum + cardValue(card.rank), 0);
  return hand.some(card => card.rank === "A") && raw !== handValue(hand);
}

function recommendedDecision(
  player: readonly PlayingCard[],
  dealerUp: PlayingCard
): Decision {
  const playerValue = handValue(player);
  const dealerValue = Math.min(10, cardValue(dealerUp.rank));
  const soft = hasSoftAce(player);

  if (playerValue <= 11) return "hit";
  if (playerValue >= 17 && !soft) return "stand";

  if (soft) {
    if (playerValue <= 17) return "hit";
    if (playerValue === 18) {
      return dealerValue >= 9 || dealerUp.rank === "A" ? "hit" : "stand";
    }
    return "stand";
  }

  if (playerValue >= 12 && playerValue <= 16) {
    return dealerValue >= 2 && dealerValue <= 6 ? "stand" : "hit";
  }

  return "stand";
}

function resultLabel(
  player: readonly PlayingCard[],
  dealer: readonly PlayingCard[]
): string {
  const playerValue = handValue(player);
  const dealerValue = handValue(dealer);
  if (playerValue > 21) return "Player bust";
  if (dealerValue > 21) return "Dealer bust";
  if (playerValue > dealerValue) return "Player hand wins";
  if (playerValue < dealerValue) return "Dealer hand wins";
  return "Push";
}

function CardFace({ card, hidden = false }: { card: PlayingCard; hidden?: boolean }) {
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className={
        "grid h-24 w-16 place-items-center rounded-xl border text-center shadow-lg " +
        (hidden
          ? "border-violet-300/20 bg-violet-950 text-violet-200"
          : "border-white/15 bg-white text-slate-950")
      }
    >
      {hidden ? (
        <span className="text-2xl">✦</span>
      ) : (
        <div className={red ? "text-rose-600" : "text-slate-950"}>
          <p className="text-lg font-black">{card.rank}</p>
          <p className="text-2xl">{card.suit}</p>
        </div>
      )}
    </div>
  );
}

export default function GameBlackjack() {
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [round, setRound] = useState(0);
  const [seed, setSeed] = useState(4401);
  const [player, setPlayer] = useState<PlayingCard[]>([]);
  const [dealer, setDealer] = useState<PlayingCard[]>([]);
  const [deckOffset, setDeckOffset] = useState(4);
  const [roundResolved, setRoundResolved] = useState(false);
  const [decisionScore, setDecisionScore] = useState(0);
  const [correctDecisions, setCorrectDecisions] = useState(0);
  const [totalDecisions, setTotalDecisions] = useState(0);
  const [message, setMessage] = useState(
    "Practice hit/stand decisions across five deterministic hands."
  );
  const recorded = useRef(false);

  const dealerUp = dealer[0];
  const recommendation = useMemo(
    () =>
      player.length && dealerUp
        ? recommendedDecision(player, dealerUp)
        : null,
    [dealerUp, player]
  );
  const accuracy =
    totalDecisions > 0
      ? Math.round((correctDecisions / totalDecisions) * 100)
      : 0;

  function dealRound(nextRound: number, nextSeed = seed) {
    const base = nextSeed + nextRound * 97;
    setPlayer([cardAt(base, 0), cardAt(base, 1)]);
    setDealer([cardAt(base, 2), cardAt(base, 3)]);
    setDeckOffset(4);
    setRoundResolved(false);
    setMessage("Choose the decision you think best fits the visible cards.");
  }

  function startSession() {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    setRound(1);
    setDecisionScore(0);
    setCorrectDecisions(0);
    setTotalDecisions(0);
    setSessionState("playing");
    recorded.current = false;
    dealRound(1, nextSeed);
  }

  function drawDealer(start: PlayingCard[], baseSeed: number, offset: number) {
    const next = [...start];
    let nextOffset = offset;
    while (handValue(next) < 17) {
      next.push(cardAt(baseSeed, nextOffset));
      nextOffset += 1;
    }
    return { hand: next, offset: nextOffset };
  }

  function finishRound(finalPlayer: PlayingCard[], nextOffset: number) {
    const base = seed + round * 97;
    const dealerResult = drawDealer(dealer, base, nextOffset);
    setDealer(dealerResult.hand);
    setDeckOffset(dealerResult.offset);
    setRoundResolved(true);
    setMessage(resultLabel(finalPlayer, dealerResult.hand));
  }

  function choose(decision: Decision) {
    if (
      sessionState !== "playing" ||
      roundResolved ||
      !recommendation ||
      !dealerUp
    ) {
      return;
    }

    const correct = decision === recommendation;
    setTotalDecisions(value => value + 1);
    if (correct) {
      setCorrectDecisions(value => value + 1);
      setDecisionScore(value => value + 100);
    } else {
      setDecisionScore(value => Math.max(0, value - 20));
    }

    const base = seed + round * 97;

    if (decision === "hit") {
      const nextPlayer = [...player, cardAt(base, deckOffset)];
      setPlayer(nextPlayer);
      setDeckOffset(value => value + 1);

      if (handValue(nextPlayer) >= 21) {
        finishRound(nextPlayer, deckOffset + 1);
      } else {
        setMessage(
          correct
            ? "Good decision. Re-evaluate after the new card."
            : "That move differs from this lab's basic-strategy rule. Re-evaluate the new total."
        );
      }
      return;
    }

    finishRound(player, deckOffset);
  }

  function nextRound() {
    if (!roundResolved) return;
    if (round >= SESSION_ROUNDS) {
      setSessionState("finished");
      if (!recorded.current) {
        recordArcadeRunToStorage({
          gameId: "blackjack-lab",
          score: decisionScore,
          xp: decisionScore,
          sparks: Math.floor(correctDecisions * 2),
          combo: correctDecisions,
        });
        recorded.current = true;
      }
      return;
    }

    const next = round + 1;
    setRound(next);
    dealRound(next);
  }

  const playerValue = handValue(player);
  const dealerValue = handValue(dealer);

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
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
              <Badge className="bg-emerald-500/15 text-emerald-100">
                Strategy lab
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                No wagers · no balance · no payout
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black">Blackjack Strategy Lab</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/45">
              Practice hit/stand decisions against a deterministic card stream.
              The score measures how often your choices match this lab's
              simplified basic-strategy rules—not money won or lost.
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
            ["Round", sessionState === "idle" ? "—" : round + "/" + SESSION_ROUNDS],
            ["Strategy score", decisionScore],
            ["Decision accuracy", totalDecisions ? accuracy + "%" : "—"],
            ["Correct choices", correctDecisions],
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

        {sessionState === "idle" ? (
          <Card className="border-emerald-300/20 bg-emerald-300/[0.04] text-white">
            <CardContent className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <Brain className="mx-auto h-12 w-12 text-emerald-200" />
                <h2 className="mt-4 text-2xl font-black">Five-hand practice</h2>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/45">
                  You see both player cards and one dealer card. Choose Hit or
                  Stand, then compare your choice with the lab rule. The session
                  is deterministic software practice only.
                </p>
                <Button size="lg" className="mt-6" onClick={startSession}>
                  Start strategy session
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : sessionState === "finished" ? (
          <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
            <CardContent className="grid min-h-80 place-items-center p-8 text-center">
              <div>
                <Trophy className="mx-auto h-12 w-12 text-amber-200" />
                <h2 className="mt-4 text-3xl font-black">Session complete</h2>
                <p className="mt-2 text-white/50">
                  {correctDecisions}/{totalDecisions} decisions matched the lab
                  rule · {accuracy}% accuracy · {decisionScore} strategy points.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Button onClick={startSession}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Practice again
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
          <Card className="overflow-hidden border-emerald-300/20 bg-gradient-to-b from-emerald-950/65 to-slate-950 text-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardDescription className="text-emerald-100/50">
                    Round {round} of {SESSION_ROUNDS}
                  </CardDescription>
                  <CardTitle className="text-white">Decision table</CardTitle>
                </div>
                <Badge
                  variant="outline"
                  className="border-emerald-300/20 text-emerald-100"
                >
                  {roundResolved ? "Resolved" : "Your move"}
                </Badge>
              </div>
              <Progress
                value={(round / SESSION_ROUNDS) * 100}
                className="mt-3 h-1.5"
              />
            </CardHeader>

            <CardContent className="space-y-7">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                  Dealer
                </p>
                <div className="flex gap-3">
                  {dealer.map((card, index) => (
                    <CardFace
                      key={index}
                      card={card}
                      hidden={!roundResolved && index > 0}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-white/40">
                  {roundResolved
                    ? "Dealer total: " + dealerValue
                    : "Visible dealer card: " + (dealerUp?.rank ?? "—")}
                </p>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white/30">
                  Player · total {playerValue}
                </p>
                <div className="flex flex-wrap gap-3">
                  {player.map((card, index) => (
                    <CardFace key={index} card={card} />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm font-semibold text-white">{message}</p>
                {roundResolved && recommendation ? (
                  <p className="mt-2 text-xs text-emerald-100/60">
                    Initial recommended decision: {recommendation.toUpperCase()}
                  </p>
                ) : null}
              </div>

              {!roundResolved ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button size="lg" onClick={() => choose("hit")}>
                    Hit
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => choose("stand")}
                    className="border-white/15 bg-white/[0.03] text-white"
                  >
                    Stand
                  </Button>
                </div>
              ) : (
                <Button className="w-full" size="lg" onClick={nextRound}>
                  {round >= SESSION_ROUNDS
                    ? "Finish session"
                    : "Deal next practice hand"}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          This route is a local card-strategy practice tool. It has no wager,
          chip balance, payout, wallet, token, real-money settlement, house edge,
          gambling advice, or claim that the simplified rule set is optimal for
          every blackjack variation.
        </section>
      </div>
    </main>
  );
}
