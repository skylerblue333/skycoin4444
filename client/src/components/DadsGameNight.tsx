import { useMemo, useState } from "react";
import { Gamepad2, Laugh, RotateCcw, Sparkles } from "lucide-react";

const jokes = [
  "Why do programmers prefer dark mode? Because light attracts bugs.",
  "Why did the coin bring snacks to the moon? Because Dad said never travel on an empty wallet.",
  "I tried to make a belt out of watches. Total waist of time.",
  "Why was the computer cold? It left its Windows open.",
  "What do you call a fake noodle? An impasta.",
  "Why did the developer go broke? Because he used up all his cache.",
  "What did one wall say to the other wall? I'll meet you at the corner.",
  "Why did the bicycle fall over? It was two tired.",
  "What does a cloud wear under its raincoat? Thunderwear.",
  "Why can't a nose be twelve inches long? Because then it would be a foot.",
  "Why did Dad put a joke in the source code? Because comments were getting too serious.",
  "The official value of a Dad joke is one eye-roll. Two eye-rolls means premium.",
] as const;

const challenges = [
  "You have 30 seconds to sell a spoon like it is the greatest invention in history.",
  "Draw Dad with your non-dominant hand. Accuracy is absolutely not required.",
  "Find something blue, something tiny, and something that makes you laugh.",
  "Build the tallest tower you can using only five nearby objects.",
  "Make one of your sisters laugh without touching her.",
  "Invent a new holiday and explain its three most important rules.",
  "Do your best dramatic reading of the nearest boring sentence.",
  "Name five things you are grateful for before somebody can count backward from ten.",
] as const;

const wouldYouRather = [
  "Would you rather have a pet dragon the size of a cat or a cat the size of a dragon?",
  "Would you rather be able to pause time for ten seconds or rewind it for ten seconds?",
  "Would you rather only communicate in song lyrics for a day or dance everywhere you go?",
  "Would you rather explore the deepest ocean or the farthest planet?",
  "Would you rather always know when someone needs a hug or always know exactly what snack they want?",
  "Would you rather build a secret treehouse city or a hidden underground library?",
  "Would you rather have unlimited books or unlimited games?",
  "Would you rather win every argument or never need to have one?",
] as const;

const dadSays = [
  "Dad says: unclench your jaw and drop your shoulders.",
  "Dad says: drink some water before declaring the day ruined.",
  "Dad says: text somebody you love something stupid and funny.",
  "Dad says: go outside for sixty seconds and look at the actual sky.",
  "Dad says: if you made a mistake, fix the next part instead of hating yourself.",
  "Dad says: tell your sister one thing you genuinely like about her.",
  "Dad says: snack break. This is legally binding Dad law.",
  "Dad says: you are allowed to enjoy today before earning tomorrow.",
] as const;

const pockets = [
  {
    label: "Pocket 1",
    reveal: "Emergency invisible high-five. ✋ Redeem immediately.",
  },
  {
    label: "Pocket 2",
    reveal: "Snack tax exemption. Dad officially owes you one snack.",
  },
  {
    label: "Pocket 3",
    reveal: "You found absolutely nothing useful. Classic Dad pocket.",
  },
  {
    label: "Pocket 4",
    reveal: "4:44 bonus: make a wish for your own future, not mine.",
  },
] as const;

const rpsMoves = ["rock", "paper", "scissors"] as const;
type Move = (typeof rpsMoves)[number];

function outcome(child: Move, dad: Move) {
  if (child === dad) return "tie";
  if (
    (child === "rock" && dad === "scissors") ||
    (child === "paper" && dad === "rock") ||
    (child === "scissors" && dad === "paper")
  ) {
    return "child";
  }
  return "dad";
}

export default function DadsGameNight() {
  const [jokeIndex, setJokeIndex] = useState(0);
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [wouldIndex, setWouldIndex] = useState(0);
  const [saysIndex, setSaysIndex] = useState(0);
  const [openPocket, setOpenPocket] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [childWins, setChildWins] = useState(0);
  const [dadWins, setDadWins] = useState(0);
  const [ties, setTies] = useState(0);
  const [lastRound, setLastRound] = useState<{
    child: Move;
    dad: Move;
    result: "child" | "dad" | "tie";
  } | null>(null);

  const dadMove = useMemo(() => rpsMoves[round % rpsMoves.length], [round]);

  function cycle(setter: (value: number) => void, current: number, length: number) {
    setter((current + 1) % length);
  }

  function play(child: Move) {
    const result = outcome(child, dadMove);
    if (result === "child") setChildWins(value => value + 1);
    if (result === "dad") setDadWins(value => value + 1);
    if (result === "tie") setTies(value => value + 1);
    setLastRound({ child, dad: dadMove, result });
    setRound(value => value + 1);
  }

  function resetGame() {
    setRound(0);
    setChildWins(0);
    setDadWins(0);
    setTies(0);
    setLastRound(null);
  }

  return (
    <section className="mt-6 rounded-3xl border border-fuchsia-300/15 bg-fuchsia-300/[0.02] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Gamepad2 className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-200/60" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-fuchsia-100/45">
            For when advice is boring
          </p>
          <h3 className="mt-2 text-xl font-black text-white/85">
            Dad's Game Night
          </h3>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
            Push buttons, roll your eyes at the jokes, beat Dad at something,
            and make your own ridiculous memories. If I am around, this page
            does not count as hanging out with me. Come bother me in person.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-5">
          <div className="flex items-center gap-2">
            <Laugh className="h-4 w-4 text-amber-200/60" />
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-100/45">
              Dad joke dispenser
            </p>
          </div>
          <p className="mt-4 min-h-16 text-sm leading-6 text-white/60">
            {jokes[jokeIndex]}
          </p>
          <button
            type="button"
            onClick={() => cycle(setJokeIndex, jokeIndex, jokes.length)}
            className="mt-4 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
          >
            Give me another terrible joke
          </button>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-100/45">
            Dad says
          </p>
          <p className="mt-4 min-h-16 text-sm leading-6 text-white/60">
            {dadSays[saysIndex]}
          </p>
          <button
            type="button"
            onClick={() => cycle(setSaysIndex, saysIndex, dadSays.length)}
            className="mt-4 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
          >
            What else, Dad?
          </button>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-100/45">
            Ridiculous challenge
          </p>
          <p className="mt-4 min-h-16 text-sm leading-6 text-white/60">
            {challenges[challengeIndex]}
          </p>
          <button
            type="button"
            onClick={() =>
              cycle(setChallengeIndex, challengeIndex, challenges.length)
            }
            className="mt-4 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
          >
            New challenge
          </button>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-black/15 p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/45">
            Would you rather?
          </p>
          <p className="mt-4 min-h-16 text-sm leading-6 text-white/60">
            {wouldYouRather[wouldIndex]}
          </p>
          <button
            type="button"
            onClick={() => cycle(setWouldIndex, wouldIndex, wouldYouRather.length)}
            className="mt-4 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
          >
            Next impossible choice
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-sky-300/12 bg-sky-300/[0.02] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-100/45">
              Dad vs. Kids
            </p>
            <h4 className="mt-1 text-base font-black text-white/75">
              Rock · Paper · Scissors
            </h4>
          </div>
          <div className="text-xs text-white/35">
            Kids {childWins} · Dad {dadWins} · Ties {ties}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {rpsMoves.map(move => (
            <button
              key={move}
              type="button"
              onClick={() => play(move)}
              className="rounded-2xl border border-white/[0.08] bg-black/15 p-4 text-sm font-black capitalize text-white/60 transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
            >
              {move}
            </button>
          ))}
        </div>

        {lastRound ? (
          <div
            className="mt-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-xs text-white/40">
              You picked <strong>{lastRound.child}</strong>. Dad picked{" "}
              <strong>{lastRound.dad}</strong>.
            </p>
            <p className="mt-2 text-sm font-bold text-white/65">
              {lastRound.result === "child"
                ? "You got me. Do not get too confident. 😂"
                : lastRound.result === "dad"
                  ? "Dad wins this one. Extremely suspicious, I know."
                  : "Tie. Clearly we share excellent judgment."}
            </p>
            {round > 0 && round % 4 === 0 ? (
              <p className="mt-2 text-xs font-semibold text-violet-200/60">
                4:44 round bonus: winner owes the other person a ridiculous
                victory dance.
              </p>
            ) : null}
          </div>
        ) : null}

        <button
          type="button"
          onClick={resetGame}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white/35 hover:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset scoreboard
        </button>
      </div>

      <div className="mt-6 rounded-3xl border border-amber-300/12 bg-amber-300/[0.02] p-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-200/60" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-100/45">
            Check Dad's pockets
          </p>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/35">
          One of the oldest Dad traditions: carrying completely random stuff.
        </p>

        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {pockets.map((pocket, index) => (
            <button
              key={pocket.label}
              type="button"
              aria-expanded={openPocket === index}
              onClick={() =>
                setOpenPocket(current => (current === index ? null : index))
              }
              className="rounded-2xl border border-white/[0.07] bg-black/15 p-3 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
            >
              {pocket.label}
            </button>
          ))}
        </div>

        {openPocket !== null ? (
          <p
            className="mt-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-sm leading-6 text-white/55"
            role="status"
            aria-live="polite"
          >
            {pockets[openPocket].reveal}
          </p>
        ) : null}
      </div>

      <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-center">
        <p className="text-sm font-semibold text-white/55">
          House rule: nobody has to win to have a good night.
        </p>
        <p className="mt-2 text-xs leading-5 text-white/30">
          Laugh, cheat at charades, change the rules, make snacks, and invent
          better games than these. The point was always spending time together.
        </p>
      </div>

      <p className="mt-5 text-center text-[10px] leading-5 text-white/20">
        Dad's Game Night runs in local component memory only. Scores, choices,
        pockets, and button presses are not saved, tracked, or sent anywhere.
      </p>
    </section>
  );
}
