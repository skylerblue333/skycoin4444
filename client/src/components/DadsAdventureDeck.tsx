import { useState } from "react";
import {
  BookOpen,
  Compass,
  MessageCircleHeart,
  RotateCcw,
  Sparkles,
  Stars,
} from "lucide-react";

const storyPlaces = [
  "a library hidden under a lake",
  "a tiny town on the moon",
  "a castle built inside a giant tree",
  "a train that only appears at 4:44",
  "an arcade at the edge of the universe",
  "a kitchen where every recipe causes magic",
] as const;

const storyObjects = [
  "a coin that tells terrible jokes",
  "a key that opens exactly one impossible door",
  "a chess piece that refuses to follow the rules",
  "a notebook that writes one sentence ahead",
  "a flashlight that reveals invisible footprints",
  "a backpack that always contains the wrong snack",
] as const;

const storyTwists = [
  "The villain is actually trying to return something they borrowed.",
  "The map is upside down, and somehow that helps.",
  "The sisters can only solve it by each noticing something different.",
  "The scary noise is coming from something completely ridiculous.",
  "The obvious treasure is fake, but the friendship they build is real.",
  "Dad's advice is useful for once, which shocks everybody.",
] as const;

const askDad = [
  {
    prompt: "I'm nervous.",
    answer:
      "Good. That usually means you care. Get the facts, make the safest reasonable plan, and do the next small part instead of trying to live the whole future at once.",
  },
  {
    prompt: "I messed up.",
    answer:
      "Tell the truth, repair what you can, learn something specific, and then stop making the mistake your entire identity. You still get a next move.",
  },
  {
    prompt: "I'm bored.",
    answer:
      "Excellent. Boredom is where weird ideas live. Build something tiny, learn one useless fact, go outside, make food, draw badly, or challenge somebody to a game.",
  },
  {
    prompt: "I miss somebody.",
    answer:
      "Missing somebody means they mattered. Reach out if that is healthy and possible. If it is not, let the feeling exist without letting it decide your whole day.",
  },
  {
    prompt: "I did something hard.",
    answer:
      "Then stop for a minute and actually give yourself credit. You do not have to immediately turn every achievement into the next assignment.",
  },
  {
    prompt: "I need courage.",
    answer:
      "Courage usually looks less dramatic than movies. It can be one honest sentence, one phone call, one boundary, one apology, or one safe step forward.",
  },
] as const;

const missions = [
  "Make a snack together and give it a ridiculous restaurant name.",
  "Go outside and each find one thing the other two probably would not notice.",
  "Learn one new word in another language and try to use it naturally.",
  "Take one ordinary photo you think you will actually like ten years from now.",
  "Play any game and invent one harmless house rule halfway through.",
  "Each sister chooses one song. Play all three without arguing about the order.",
  "Build something with whatever is nearby. Useful is optional.",
  "Tell one family story you remember differently and compare versions.",
  "Find something that costs nothing but makes the day better.",
  "Do one small helpful thing for somebody without announcing it first.",
] as const;

const codebreakers = [
  {
    cipher: "MPWF ZPVSTFMG",
    answer: "LOVE YOURSELF",
    hint: "Every letter moved forward by one. Move each letter back by one.",
  },
  {
    cipher: "DBMM ZPVS TJTUFS",
    answer: "CALL YOUR SISTER",
    hint: "Same +1 letter shift. Dad reused the puzzle because efficiency.",
  },
  {
    cipher: "HP PVUTJEF",
    answer: "GO OUTSIDE",
    hint: "Shift each letter backward once. Yes, this is Dad telling you to touch grass.",
  },
] as const;

const sisterNames = ["Luna", "Summer", "Alexis"] as const;

export default function DadsAdventureDeck() {
  const [placeIndex, setPlaceIndex] = useState(0);
  const [objectIndex, setObjectIndex] = useState(0);
  const [twistIndex, setTwistIndex] = useState(0);
  const [dadReplyIndex, setDadReplyIndex] = useState<number | null>(null);
  const [missionIndex, setMissionIndex] = useState(0);
  const [codeIndex, setCodeIndex] = useState(0);
  const [codeOpen, setCodeOpen] = useState(false);
  const [sisters, setSisters] = useState([false, false, false]);

  const constellationComplete = sisters.every(Boolean);

  function cycle(
    setter: (value: number) => void,
    current: number,
    length: number
  ) {
    setter((current + 1) % length);
  }

  function lightSister(index: number) {
    setSisters(current =>
      current.map((lit, position) => (position === index ? true : lit))
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-cyan-300/15 bg-cyan-300/[0.02] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <Compass className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200/60" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-cyan-100/45">
            Open when you want Dad energy without a lecture
          </p>
          <h3 className="mt-2 text-xl font-black text-white/85">
            Dad's Adventure Deck
          </h3>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
            Make a story, solve something dumb, ask a prewritten Dad question,
            or take a mission into the real world. None of this is pretending
            to be a live version of me. It is just a box of things I would want
            to do with you.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-violet-300/12 bg-violet-300/[0.02] p-5">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-violet-200/60" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-100/45">
            Build a ridiculous story
          </p>
        </div>
        <p className="mt-3 text-sm leading-7 text-white/55">
          Three sisters arrive at <strong>{storyPlaces[placeIndex]}</strong>.
          They discover <strong>{storyObjects[objectIndex]}</strong>. Then:
          {" "}<strong>{storyTwists[twistIndex]}</strong>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              cycle(setPlaceIndex, placeIndex, storyPlaces.length)
            }
            className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
          >
            Change the place
          </button>
          <button
            type="button"
            onClick={() =>
              cycle(setObjectIndex, objectIndex, storyObjects.length)
            }
            className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
          >
            Change the weird object
          </button>
          <button
            type="button"
            onClick={() =>
              cycle(setTwistIndex, twistIndex, storyTwists.length)
            }
            className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
          >
            Change the twist
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-sky-300/12 bg-sky-300/[0.02] p-5">
        <div className="flex items-center gap-2">
          <MessageCircleHeart className="h-4 w-4 text-sky-200/60" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-sky-100/45">
            Ask Dad — prewritten edition
          </p>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/35">
          These are fixed notes I chose to leave in the code, not AI and not a
          live conversation.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {askDad.map((item, index) => (
            <button
              key={item.prompt}
              type="button"
              aria-pressed={dadReplyIndex === index}
              onClick={() =>
                setDadReplyIndex(current => (current === index ? null : index))
              }
              className="rounded-2xl border border-white/[0.07] bg-black/15 p-3 text-left text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
            >
              {item.prompt}
            </button>
          ))}
        </div>
        {dadReplyIndex !== null ? (
          <div
            className="mt-4 rounded-2xl border border-white/[0.07] bg-black/20 p-4"
            role="status"
            aria-live="polite"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
              Dad would probably say
            </p>
            <p className="mt-2 text-sm leading-7 text-white/55">
              {askDad[dadReplyIndex].answer}
            </p>
          </div>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2">
        <div className="rounded-3xl border border-emerald-300/12 bg-emerald-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-100/45">
            Real-world mission
          </p>
          <p className="mt-4 min-h-16 text-sm leading-7 text-white/55">
            {missions[missionIndex]}
          </p>
          <button
            type="button"
            onClick={() =>
              cycle(setMissionIndex, missionIndex, missions.length)
            }
            className="mt-3 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/50"
          >
            Deal another mission
          </button>
        </div>

        <div className="rounded-3xl border border-amber-300/12 bg-amber-300/[0.02] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-100/45">
            Dad's very advanced codebreaker
          </p>
          <p className="mt-4 font-mono text-lg font-black tracking-[0.12em] text-white/65">
            {codebreakers[codeIndex].cipher}
          </p>
          <p className="mt-2 text-xs leading-5 text-white/35">
            {codebreakers[codeIndex].hint}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              aria-expanded={codeOpen}
              onClick={() => setCodeOpen(value => !value)}
              className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
            >
              {codeOpen ? "Hide answer" : "Reveal answer"}
            </button>
            <button
              type="button"
              onClick={() => {
                cycle(setCodeIndex, codeIndex, codebreakers.length);
                setCodeOpen(false);
              }}
              className="rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-bold text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
            >
              Next code
            </button>
          </div>
          {codeOpen ? (
            <p
              className="mt-4 rounded-xl border border-white/[0.07] bg-black/20 p-3 text-sm font-black text-white/60"
              role="status"
              aria-live="polite"
            >
              {codebreakers[codeIndex].answer}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-fuchsia-300/12 bg-fuchsia-300/[0.02] p-5">
        <div className="flex items-center gap-2">
          <Stars className="h-4 w-4 text-fuchsia-200/60" />
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-fuchsia-100/45">
            Three-sister constellation relay
          </p>
        </div>
        <p className="mt-2 text-xs leading-5 text-white/35">
          Light all three. There is no fastest sister and no best sister. The
          only win condition is everybody being here.
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {sisterNames.map((name, index) => (
            <button
              key={name}
              type="button"
              aria-pressed={sisters[index]}
              onClick={() => lightSister(index)}
              className="rounded-2xl border border-white/[0.08] bg-black/15 p-4 text-sm font-black text-white/50 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/50"
            >
              <span className="block text-lg">{sisters[index] ? "★" : "☆"}</span>
              <span className="mt-1 block">{name}</span>
            </button>
          ))}
        </div>

        {constellationComplete ? (
          <div
            className="mt-4 rounded-2xl border border-fuchsia-300/12 bg-fuchsia-300/[0.025] p-4 text-center"
            role="status"
            aria-live="polite"
          >
            <p className="text-sm font-black text-white/65">
              Constellation complete. Three different lights, one sky.
            </p>
            <p className="mt-2 text-xs leading-5 text-white/35">
              Dad's bonus rule: somebody now has to suggest a snack.
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setSisters([false, false, false])}
          className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white/30 hover:text-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/50"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset the stars
        </button>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200/55" />
        <p className="text-xs leading-6 text-white/40">
          If any of these games become a family tradition, improve them. Add
          better jokes. Make harder codes. Invent house rules. The best version
          is the one that eventually stops needing this code because you are
          making your own fun together.
        </p>
      </div>

      <p className="mt-5 text-center text-[10px] leading-5 text-white/20">
        Dad's Adventure Deck uses local component state only. It does not save
        answers, missions, scores, selections, or activity and sends no data
        anywhere.
      </p>
    </section>
  );
}
