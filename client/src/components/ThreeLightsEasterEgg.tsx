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

export default function ThreeLightsEasterEgg() {
  const [revealed, setRevealed] = useState<LightId[]>([]);

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
          <div
            className="mt-5 flex items-start gap-3 rounded-2xl border border-violet-300/15 bg-violet-300/[0.035] p-4"
            role="status"
            aria-live="polite"
          >
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-violet-200" />
            <div>
              <p className="text-sm font-bold text-violet-100">
                Three lights found.
              </p>
              <p className="mt-1 text-xs leading-5 text-white/35">
                Luna Avigail · Summer Skye · Alexis Isabella-Jane — three names
                hidden in the SKYCOIN4444 constellation, built with love.
              </p>
            </div>
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
