import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ShieldCheck, Spade } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DemoBankroll,
  GameStage,
  GamingBackdrop,
  StakeSelector,
  StatusBadge,
} from "@/features/gaming/components/ArcadeSurface";
import { createDeck, handValue, isBlackjack, type PlayingCard } from "@/lib/flagshipGameEngine";

type Phase = "idle" | "player" | "resolved";

function CardFace({
  card,
  hidden = false,
  index = 0,
}: {
  card: PlayingCard;
  hidden?: boolean;
  index?: number;
}) {
  const red = card.suit === "♥" || card.suit === "♦";
  return (
    <motion.div
      initial={{ opacity: 0, y: -34, rotate: index % 2 ? 4 : -4, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, rotate: index * 1.5 - 2, scale: 1 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.06, 0.24) }}
      className={
        "relative grid h-32 w-24 place-items-center rounded-2xl border shadow-2xl sm:h-36 sm:w-28 " +
        (hidden
          ? "border-emerald-300/15 bg-[linear-gradient(135deg,#052e2b,#111827)] text-emerald-200"
          : "border-white/30 bg-white text-slate-950")
      }
    >
      {hidden ? (
        <div className="grid h-20 w-14 place-items-center rounded-xl border border-emerald-300/20 bg-[radial-gradient(circle,rgba(16,185,129,.15),transparent_60%)]">
          <Spade className="h-7 w-7" />
        </div>
      ) : (
        <>
          <div className={"absolute left-3 top-2 text-left " + (red ? "text-rose-600" : "text-slate-950")}>
            <p className="text-xl font-black leading-none">{card.rank}</p>
            <p className="text-lg leading-none">{card.suit}</p>
          </div>
          <div className={red ? "text-rose-600" : "text-slate-950"}>
            <p className="text-5xl leading-none">{card.suit}</p>
          </div>
          <div className={"absolute bottom-2 right-3 rotate-180 text-left " + (red ? "text-rose-600" : "text-slate-950")}>
            <p className="text-xl font-black leading-none">{card.rank}</p>
            <p className="text-lg leading-none">{card.suit}</p>
          </div>
        </>
      )}
    </motion.div>
  );
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
  const [history, setHistory] = useState<Array<{ label: string; player: number; dealer: number }>>([]);

  const playerValue = handValue(player);
  const dealerValue = handValue(dealer);
  const dealerVisibleValue = phase === "resolved" ? dealerValue : dealer[0] ? handValue([dealer[0]]) : 0;
  const canDouble = phase === "player" && player.length === 2 && credits >= roundStake;

  const tone = useMemo<"neutral" | "win" | "loss">(() => {
    if (phase !== "resolved") return "neutral";
    if (/Blackjack|player wins|Win/.test(message)) return "win";
    if (/Push/.test(message)) return "neutral";
    return "loss";
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
    setMessage(isBlackjack(playerHand) ? "Blackjack. Stand to reveal the dealer and settle the hand." : "Your move: Hit, Stand, or Double.");
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
    if (returned > 0) setCredits(value => Number((value + returned).toFixed(2)));
    setPlayer(finalPlayer);
    setDealer(finalDealer);
    setDeckIndex(nextIndex);
    setPhase("resolved");
    setMessage(label + " · " + playerTotal + " vs " + dealerTotal + (returned > 0 ? " · " + returned.toFixed(2) + " demo chips returned" : ""));
    setHistory(value => [{ label, player: playerTotal, dealer: dealerTotal }, ...value].slice(0, 8));
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
    <main className="min-h-screen overflow-hidden bg-[#04100c] text-white">
      <GamingBackdrop />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link href="/gaming" className="mb-3 inline-flex items-center gap-2 text-sm text-white/40 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500/15 text-emerald-100">BLACKJACK V2</Badge>
              <StatusBadge tone={tone}>{phase === "player" ? "PLAYER TURN" : phase === "resolved" ? "HAND COMPLETE" : "TABLE READY"}</StatusBadge>
            </div>
            <h1 className="mt-4 text-5xl font-black tracking-[-0.055em] sm:text-6xl">Blackjack table</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
              Animated deal, Hit, Stand, Double, natural-blackjack payout, hand history, and deterministic deck math. The dealer stands on 17.
            </p>
          </div>
          <DemoBankroll credits={credits} onReset={resetCredits} disabled={phase === "player"} />
        </header>

        <div className="grid gap-5 xl:grid-cols-[1fr_320px]">
          <GameStage
            eyebrow="CLASSIC DEALER TABLE"
            title="Play the hand"
            description="Cards are shuffled from the shared seeded demo engine so the same seed reproduces the same deck for testing."
            accent="from-emerald-500/14 via-transparent to-green-500/7"
          >
            <div className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-emerald-300/15 bg-[radial-gradient(ellipse_at_50%_35%,rgba(16,185,129,.16),rgba(2,20,13,.92)_64%)] p-5 sm:p-8">
              <div className="absolute inset-5 rounded-[50%] border border-emerald-100/10 sm:inset-10" />
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Dealer</p>
                    <p className="mt-1 text-sm text-white/38">{dealer.length ? "Visible total " + dealerVisibleValue : "Waiting for deal"}</p>
                  </div>
                  <Spade className="h-7 w-7 text-emerald-200/55" />
                </div>

                <div className="mt-5 flex min-h-36 flex-wrap justify-center gap-2 sm:justify-start">
                  {dealer.map((card, index) => <CardFace key={card.rank + card.suit + index} card={card} hidden={index === 1 && phase !== "resolved"} index={index} />)}
                </div>

                <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/30">Player</p>
                  <p className="mt-1 text-sm text-white/38">{player.length ? "Total " + playerValue : "Choose a demo stake and deal"}</p>
                </div>

                <div className="mt-5 flex min-h-36 flex-wrap justify-center gap-2 sm:justify-start">
                  {player.map((card, index) => <CardFace key={card.rank + card.suit + index} card={card} index={index} />)}
                </div>

                <div className="mt-7 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/58 backdrop-blur">{message}</div>

                <div className="mt-4 flex flex-wrap gap-3">
                  {phase === "player" ? (
                    <>
                      <Button size="lg" onClick={hit}>Hit</Button>
                      <Button size="lg" variant="outline" className="border-white/15 bg-white/[0.04] text-white" onClick={stand}>Stand</Button>
                      <Button size="lg" variant="outline" className="border-amber-300/20 bg-amber-300/[0.04] text-amber-100" onClick={doubleDown} disabled={!canDouble}>
                        Double · {roundStake}
                      </Button>
                    </>
                  ) : (
                    <Button size="lg" onClick={startRound}>Deal hand · {stake}</Button>
                  )}
                </div>
              </div>
            </div>
          </GameStage>

          <div className="space-y-4">
            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-xl">Table setup</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <StakeSelector stake={stake} onChange={setStake} disabled={phase === "player"} />
                <div className="space-y-2 text-xs leading-5 text-white/36">
                  <p>Blackjack returns 2.5× the demo stake.</p>
                  <p>Regular win returns 2×. Push returns 1×.</p>
                  <p>Double is available on the first two cards when enough Demo chips remain.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-black/25 text-white">
              <CardHeader><CardTitle className="text-lg">Hand history</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {history.length ? history.map((item, index) => (
                  <div key={item.label + index} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-sm">
                    <span className="text-white/48">{item.label}</span>
                    <strong>{item.player}:{item.dealer}</strong>
                  </div>
                )) : <p className="text-sm text-white/28">Completed hands appear here.</p>}
              </CardContent>
            </Card>

            <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-5 text-white/36">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-200/70" />
              <p>No real-money wager, payment, wallet connection, custody, token settlement, withdrawal, or redeemable reward is implemented.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
