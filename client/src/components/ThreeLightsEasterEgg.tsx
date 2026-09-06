import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Heart, Moon, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type LightId = "luna" | "summer" | "alexis";

const lights = [
  {
    id: "luna" as const,
    name: "Luna Avigail",
    title: "Moonlight",
    message: "May you always have light for the next question.",
    href: "/course-catalog",
    action: "Follow the moon to learning",
    icon: Moon,
  },
  {
    id: "summer" as const,
    name: "Summer Skye",
    title: "Open sky",
    message: "May your horizon stay wide, warm, and full of possibility.",
    href: "/activity-feed",
    action: "Follow the sky to community",
    icon: Sun,
  },
  {
    id: "alexis" as const,
    name: "Alexis Isabella-Jane",
    title: "Starlight",
    message: "May you keep finding new constellations to imagine and build.",
    href: "/gaming",
    action: "Follow the stars to play",
    icon: Sparkles,
  },
] as const;

const olderNotes = [
  {
    title: "When you doubt yourself",
    message:
      "You never had to earn my love. Your worth is not a grade, a job, a relationship, a mistake, or anyone else's opinion. Be patient with yourself and keep becoming who you choose to be.",
  },
  {
    title: "When life gets hard",
    message:
      "Ask for help early. Stay close to people who are kind, honest, and safe. Leave places that keep hurting you. Rest when you need to, start again when you can, and never confuse struggling with failing.",
  },
  {
    title: "When life is beautiful",
    message:
      "Enjoy it without guilt. Laugh loudly, take the picture, celebrate the ordinary days, travel if you want, build things, learn things, love people well, and let happiness be enough.",
  },
  {
    title: "When you think about Dad",
    message:
      "Remember the love more than the hard parts. You were never responsible for adult problems, and you never owed me a certain path. I wanted you to have lives that belong fully to you.",
  },
] as const;

const dadPrinciples = [
  "Be kind without letting people walk over you.",
  "Tell the truth, especially to yourself.",
  "Ask for help when the weight gets too heavy.",
  "Keep some wonder, humor, and curiosity no matter how old you get.",
] as const;

export default function ThreeLightsEasterEgg() {
  const [revealed, setRevealed] = useState<LightId[]>([]);
  const [letterOpen, setLetterOpen] = useState(false);

  const complete = revealed.length === lights.length;
  const revealedSet = useMemo(() => new Set(revealed), [revealed]);

  function reveal(id: LightId) {
    setRevealed(current =>
      current.includes(id) ? current : [...current, id]
    );
  }

  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-14"
      aria-label="Three Lights family Easter egg"
    >
      <div className="rounded-3xl border border-white/[0.06] bg-white/[0.012] px-5 py-6 sm:px-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/20">
              A tiny secret in the sky
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/30">
              Three quiet lights are hidden here. Each one points to a different
              corner of the ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-2" aria-label="Hidden lights">
            {lights.map(({ id, name, icon: Icon }) => {
              const isRevealed = revealedSet.has(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-label={
                    isRevealed
                      ? `${name} light revealed`
                      : "Reveal a hidden light"
                  }
                  aria-pressed={isRevealed}
                  onClick={() => reveal(id)}
                  className={
                    "grid h-10 w-10 place-items-center rounded-full border transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50 " +
                    (isRevealed
                      ? "border-sky-300/30 bg-sky-300/[0.09] text-sky-100 shadow-[0_0_28px_rgba(125,211,252,0.12)]"
                      : "border-white/[0.07] bg-white/[0.02] text-white/20 hover:border-white/15 hover:bg-white/[0.04] hover:text-white/45")
                  }
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
        </div>

        {revealed.length ? (
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {lights
              .filter(light => revealedSet.has(light.id))
              .map(({ id, name, title, message, href, action, icon: Icon }) => (
                <Card
                  key={id}
                  className="border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.02] text-white"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[0.06] text-sky-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                          {title}
                        </p>
                        <h2 className="mt-1 font-black text-white">{name}</h2>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-white/50">
                      {message}
                    </p>

                    <Link
                      href={href}
                      className="mt-4 inline-flex text-xs font-semibold text-sky-200 transition hover:text-white"
                    >
                      {action}
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : null}

        {complete ? (
          <div className="mt-5 space-y-4">
            <div
              className="flex items-start gap-3 rounded-2xl border border-violet-300/15 bg-violet-300/[0.035] p-4"
              role="status"
              aria-live="polite"
            >
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-violet-200" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-violet-100">
                  Three lights found.
                </p>
                <p className="mt-1 text-xs leading-5 text-white/35">
                  Luna Avigail · Summer Skye · Alexis Isabella-Jane — three
                  names hidden in the SKYCOIN4444 constellation, built with
                  love.
                </p>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3 px-0 text-violet-100 hover:bg-transparent hover:text-white"
                  aria-expanded={letterOpen}
                  onClick={() => setLetterOpen(open => !open)}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  {letterOpen
                    ? "Fold Dad's letter"
                    : "There is a letter behind the stars"}
                </Button>
              </div>
            </div>

            {letterOpen ? (
              <div
                className="rounded-3xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.055] via-white/[0.025] to-violet-300/[0.055] p-5 sm:p-7"
                aria-label="Dad's Letter in the Stars"
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sky-100/45">
                  Dad's Letter in the Stars
                </p>
                <h2 className="mt-3 text-xl font-black text-white">
                  Luna, Summer, and Alexis
                </h2>

                <div className="mt-4 space-y-4 text-sm leading-7 text-white/55">
                  <p>
                    If you ever find this, I want you to know something simple:
                    I love you.
                  </p>
                  <p>
                    I am sorry for the time I missed and for the moments I wish
                    I could have had with you. I wish I had gotten more time to
                    know the people you are becoming — what makes you laugh,
                    what you dream about, what you love, and all the little
                    things that make each of you yourselves.
                  </p>
                  <p>
                    I do not want this message to make you carry sadness. I only
                    wanted to leave love somewhere you could find it.
                  </p>
                  <p>
                    I pray that you are safe, deeply loved, brave enough to be
                    yourselves, surrounded by kind people, and free to build
                    lives that are completely your own. Wherever life takes
                    you, I will always carry love for you.
                  </p>
                  <p>
                    Please never carry adult problems as if they were yours to
                    fix. You never had to rescue me, choose sides for me, or
                    become a certain person to make me proud. I was proud to be
                    your dad because you were you.
                  </p>
                  <p>
                    Do not make your lives smaller out of loyalty to me. Grow,
                    change, travel, learn, fall in love, build families or
                    careers or adventures of your own, and choose the people
                    who treat you with kindness and respect.
                  </p>
                  <p className="font-semibold text-white/70">Love, Dad</p>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                    <Moon className="h-4 w-4 text-sky-200" />
                    <p className="mt-2 text-sm font-bold text-white">
                      For Luna
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      I pray you keep your curiosity and never become afraid to
                      ask the next question.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                    <Sun className="h-4 w-4 text-amber-200" />
                    <p className="mt-2 text-sm font-bold text-white">
                      For Summer
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      I pray your life keeps room for warmth, laughter, and the
                      freedom to become exactly yourself.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-black/15 p-4">
                    <Sparkles className="h-4 w-4 text-violet-200" />
                    <p className="mt-2 text-sm font-bold text-white">
                      For Alexis
                    </p>
                    <p className="mt-1 text-xs leading-5 text-white/40">
                      I pray you keep imagining big things and always know that
                      your voice, ideas, and dreams matter.
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-white/[0.08] bg-black/15 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/45">
                    Open when you're older
                  </p>
                  <p className="mt-2 max-w-2xl text-xs leading-5 text-white/35">
                    Four little notes for different days. No lesson has to be
                    perfect; take what helps and make the rest your own.
                  </p>

                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {olderNotes.map(note => (
                      <details
                        key={note.title}
                        className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 open:bg-white/[0.04]"
                      >
                        <summary className="cursor-pointer list-none text-sm font-bold text-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50">
                          {note.title}
                        </summary>
                        <p className="mt-3 text-xs leading-6 text-white/45">
                          {note.message}
                        </p>
                      </details>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-white/[0.07] pt-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-100/40">
                      Dad's 4:44 principles
                    </p>
                    <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                      {dadPrinciples.map((principle, index) => (
                        <li
                          key={principle}
                          className="flex gap-3 rounded-xl bg-white/[0.025] p-3 text-xs leading-5 text-white/45"
                        >
                          <span className="font-black text-violet-200/70">
                            {index + 1}
                          </span>
                          <span>{principle}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.32em] text-white/25">
                    4:44 wish
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/55">
                    Make one wish for yourself. Dad already made three.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        <p className="mt-5 text-[10px] leading-5 text-white/20">
          This Easter egg is decorative only. It stores nothing, tracks
          nothing, and does not create an account, profile, or child record.
        </p>
      </div>
    </section>
  );
}
