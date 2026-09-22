import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Coins,
  RotateCcw,
  ShieldCheck,
  Spade,
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
import {
  createDeck,
  handValue,
  isBlackjack,
  type PlayingCard,
} from "@/lib/flagshipGameEngine";

type Phase = "idle" | "player" | "resolved";
const STAKES = [5, 10, 25, 50, 100] as const;

function CardFace({ card, hidden = false }: { card: PlayingCard; hidden?: boolean }) {
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <div
      className={
        "grid h-28 w-20 place-items-center rounded-2xl border shadow-xl sm:h-32 sm:w-24 " +
        (hidden
          ? "border-emerald-300/15 bg-[linear-gradient(135deg,#052e2b,#111827)] text-emerald-200"
          : "border-white/20 bg-white text-slate-950")
      }
    >
      {hidden ? (
        <div className="grid h-16 w-12 place-items-center rounded-lg border border-emerald-300/20">
          <Spade className="h-6 w-6" />
        </div>
      ) : (
        <div className={red ? "text-rose-600" : "text-slate-950"}>
          <p className="text-2xl font-black">{card.rank}</p>
          <p className="text-4xl leading-none">{card.suit}</p>
        </div>
      )}
    </div>
  );
}

function formatCredits(value: number) {
  return Math.max(0, value).toFixed(2);
}

export default function GameBlackjack() {
  const [credits, setCredits] = useState(1000);
  const [stake, setStake] = useState(25);
  const [roundStake, setRoundStake] = useState(25);
  const [seed, setSeed] = useState(4444);
  const [deck, setDeck] = useState<PlayingCard[]>(() => createDeck(seed));
  const [deckIndex, setDeckIndex] = useState(4);
  const [player, setPlayer] = useState<PlayingCard[]>([]);
  const [dealer, setDealer] = useState<PlayingCard[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("Deal a hand to start. Demo chips have no cash or token value.");
  const [history, setHistory] = useState<string[]>([]);

  const playerValue = handValue(player);
  const dealerValue = handValue(dealer);
  const dealerVisibleValue = phase === "resolved" ? dealerValue : dealer[0] ? handValue([dealer[0]]) : 0;
  const canDouble = phase === "player" && player.length === 2 && credits >= roundStake;

  const statusTone = useMemo(() => {
    if (phase !== "resolved") return "text-white";
    if (message.startsWith("Win") || message.startsWith("Blackjack") || message.startsWith("Dealer bust")) return "text-emerald-300";
    if (message.startsWith("Push")) return "text-amber-200";
    return "text-rose-300";
  }, [message, phase]);

  function startRound() {
    if (phase === "player") return;
    if (stake <= 0 || stake > credits) {
      setMessage("Choose a valid demo-chip stake within the local balance.");
      return;
    }

    const nextSeed = seed + 1;
    const nextDeck = createDeck(nextSeed);
    const playerHand = [nextDeck[0], nextDeck[2]];
    const dealerHand = [nextDeck[1], nextDeck[3]];

    setSeed(nextSeed);
    setDeck(nextDeck);
    setDeckIndex(4);
    setPlayer(playerHand);
    setDealer(dealerHand);
    setRoundStake(stake);
    setCredits(value => Number((value - stake).toFixed(2)));
    setPhase("player");

    if (isBlackjack(playerHand)) {
      setMessage("Blackjack. Stand to reveal the dealer and settle the demo hand.");
    } else {
      setMessage("Your move: Hit, Stand, or Double.");
    }
  }

  function settle(finalPlayer: PlayingCard[], finalDealer: PlayingCard[], finalStake: number, nextIndex: number) {
    const playerTotal = handValue(finalPlayer);
    const dealerTotal = handValue(finalDealer);
    const playerNatural = isBlackjack(finalPlayer);
    const dealerNatural = isBlackjack(finalDealer);

    let multiplier = 0;
    let label = "Dealer wins";

    if (playerTotal > 21) {
      label = "Player bust";
    } else if (playerNatural && !dealerNatural) {
      multiplier = 2.5;
      label = "Blackjack";
    } else if (dealerTotal > 21) {
      multiplier = 2;
      label = "Dealer bust · player wins";
    } else if (playerTotal > dealerTotal) {
      multiplier = 2;
      label = "Win";
    } else if (playerTotal === dealerTotal) {
      multiplier = 1;
      label = "Push";
    }

    const returned = finalStake * multiplier;
    if (returned > 0) {
      setCredits(value => Number((value + returned).toFixed(2)));
    }
    setPlayer(finalPlayer);
    setDealer(finalDealer);
    setDeckIndex(nextIndex);
    setPhase("resolved");
    setMessage(
      label + " · " + playerTotal + " vs " + dealerTotal +
      (returned > 0 ? " · " + returned.toFixed(2) + " demo chips returned" : "")
    );
    setHistory(value => [
      label + " · " + playerTotal + ":" + dealerTotal,
      ...value,
    ].slice(0, 7));
  }

  function dealerPlay(finalPlayer: PlayingCard[], finalStake: number, startIndex: number) {
    const dealerHand = [...dealer];
    let index = startIndex;

    while (handValue(dealerHand) < 17 && index < deck.length) {
      dealerHand.push(deck[index]);
      index += 1;
    }

    settle(finalPlayer, dealerHand, finalStake, index);
  }

  function hit() {
    if (phase !== "player" || deckIndex >= deck.length) return;
    const nextPlayer = [...player, deck[deckIndex]];
    const nextIndex = deckIndex + 1;
    setPlayer(nextPlayer);
    setDeckIndex(nextIndex);

    if (handValue(nextPlayer) > 21) {
      settle(nextPlayer, dealer, roundStake, nextIndex);
    } else if (handValue(nextPlayer) === 21) {
      setMessage("21. Stand to reveal the dealer.");
    } else {
      setMessage("Card dealt. Hit again or stand.");
    }
  }

  function stand() {
    if (phase !== "player") return;
    dealerPlay(player, roundStake, deckIndex);
  }

  function doubleDown() {
    if (!canDouble || deckIndex >= deck.length) return;
    const doubledStake = roundStake * 2;
    const nextPlayer = [...player, deck[deckIndex]];
    const nextIndex = deckIndex + 1;
    setCredits(value => Number((value - roundStake).toFixed(2)));
    setRoundStake(doubledStake);

    if (handValue(nextPlayer) > 21) {
      settle(nextPlayer, dealer, doubledStake, nextIndex);
      return;
    }

    dealerPlay(nextPlayer, doubledStake, nextIndex);
  }

  function resetCredits() {
    if (phase === "player") return;
    setCredits(1000);
    setMessage("Demo chips reset to 1,000. No deposit or withdrawal occurred.");
  }

  return (
    <main className="min-h-screen bg-[#04100c] text-white">
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">BLACKJACK</Badge>
              <Badge variant="outline" className="border-white/10 text-white/40">
                Dealer stands on 17
              </Badge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.04em] sm:text-6xl">Blackjack table</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
              A full local dealer game with Hit, Stand, Double, natural-blackjack payout, and demo chips only.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">Demo chips</p>
            <div className="mt-1 flex items-center gap-3">
              <span className="text-3xl font-black">{formatCredits(credits)}</span>
              <Button
                size="sm"
                variant="outline"
                className="border-white/10 bg-white/[0.03] text-white"
                onClick={resetCredits}
                disabled={phase === "player"}
              >
                <RotateCcw className="mr-2 h-3.5 w-3.5" />
                Reset
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <Card className="overflow-hidden border-emerald-300/15 bg-[radial-gradient(circle_at_50%_35%,rgba(16,185,129,.13),rgba(3,17,12,.97)_60%)] text-white">
            <CardContent className="min-h-[560px] p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">Dealer</p>
                  <p className="mt-1 text-sm text-white/35">
                    {dealer.length ? "Visible total " + dealerVisibleValue : "Waiting for deal"}
                  </p>
                </div>
                <Spade className="h-7 w-7 text-emerald-200/60" />
              </div>

              <div className="mt-5 flex min-h-32 flex-wrap gap-2">
                {dealer.map((card, index) => (
                  <CardFace key={card.rank + card.suit + index} card={card} hidden={index === 1 && phase !== "resolved"} />
                ))}
              </div>

              <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">Player</p>
                <p className="mt-1 text-sm text-white/35">
                  {player.length ? "Total " + playerValue : "Choose a demo stake and deal"}
                </p>
              </div>

              <div className="mt-5 flex min-h-32 flex-wrap gap-2">
                {player.map((card, index) => (
                  <CardFace key={card.rank + card.suit + index} card={card} />
                ))}
              </div>

              <div className={"mt-7 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm " + statusTone}>
                {message}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {phase === "player" ? (
                  <>
                    <Button size="lg" onClick={hit}>Hit</Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/15 bg-white/[0.03] text-white"
                      onClick={stand}
                    >
                      Stand
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-amber-300/20 bg-amber-300/[0.04] text-amber-100"
                      onClick={doubleDown}
                      disabled={!canDouble}
                    >
                      Double · {roundStake}
                    </Button>
                  </>
                ) : (
                  <Button size="lg" onClick={startRound}>
                    Deal hand · {stake}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardDescription className="text-white/35">Table setup</CardDescription>
                <CardTitle className="text-xl text-white">Demo stake</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {STAKES.map(value => (
                    <Button
                      key={value}
                      size="sm"
                      variant={stake === value ? "default" : "outline"}
                      className={stake === value ? "" : "border-white/10 bg-white/[0.025] text-white"}
                      onClick={() => setStake(value)}
                      disabled={phase === "player"}
                    >
                      {value}
                    </Button>
                  ))}
                </div>
                <div className="mt-5 space-y-2 text-xs leading-5 text-white/35">
                  <p>Blackjack returns 2.5× the demo stake.</p>
                  <p>Regular win returns 2×. Push returns 1×.</p>
                  <p>Double is available on the initial two-card hand when enough demo chips remain.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardDescription className="text-white/35">Recent hands</CardDescription>
                <CardTitle className="text-lg text-white">Table history</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.length ? history.map((item, index) => (
                  <div key={item + index} className="rounded-xl border border-white/10 bg-black/15 px-3 py-2 text-sm text-white/45">
                    {item}
                  </div>
                )) : (
                  <p className="text-sm text-white/30">Completed hands appear here.</p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-white/35">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/70" />
              <p>
                No real-money wager, payment, wallet connection, custody, token settlement, withdrawal, or redeemable reward is implemented.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-white/25">
              <Coins className="h-4 w-4" />
              Local demo bankroll · seed {seed}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
