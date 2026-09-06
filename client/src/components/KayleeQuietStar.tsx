import { useState } from "react";
import { Heart, Sparkles, Star } from "lucide-react";

const littleThings = [
  {
    label: "One truth",
    text: "You mattered to me. The good parts of what we shared mattered too, and I am grateful they happened.",
  },
  {
    label: "One wish",
    text: "I hope your life is safe, peaceful, interesting, full of laughter, and surrounded by people who treat you with kindness.",
  },
  {
    label: "One dumb joke",
    text: "Why did the programmer hide a note in the stars? Because the README was way too obvious.",
  },
] as const;

export default function KayleeQuietStar() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [, setStarTaps] = useState(0);
  const [fourFortyFourOpen, setFourFortyFourOpen] = useState(false);

  function recordStarTap() {
    setStarTaps(current => {
      const next = current + 1;
      if (next >= 4) {
        setFourFortyFourOpen(true);
        return 0;
      }
      return next;
    });
  }

  return (
    <section
      className="mx-auto max-w-7xl px-4 pb-14"
      aria-label="A quiet personal Easter egg"
    >
      <div className="rounded-3xl border border-white/[0.05] bg-white/[0.01] p-5 sm:p-6">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="kaylee-quiet-star"
          onClick={() => {
            setOpen(value => !value);
            recordStarTap();
          }}
          className="group flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/18">
              One more quiet star
            </p>
            <p className="mt-2 text-xs leading-5 text-white/24">
              Not part of the family constellation. Just a small note for one
              person who mattered.
            </p>
          </div>
          <Star className="h-4 w-4 shrink-0 text-violet-200/25 transition group-hover:text-violet-200/50" />
        </button>

        {open ? (
          <div
            id="kaylee-quiet-star"
            className="mt-5 rounded-3xl border border-violet-300/12 bg-gradient-to-br from-violet-300/[0.035] via-black/10 to-rose-300/[0.025] p-5 sm:p-7"
          >
            <div className="flex items-start gap-3">
              <Heart className="mt-0.5 h-4 w-4 shrink-0 text-rose-200/55" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-violet-100/40">
                  A note for Kaylee Alexis Harris
                </p>
                <h2 className="mt-2 text-xl font-black text-white/80">
                  Thank you for being part of my story.
                </h2>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm leading-7 text-white/50">
              <p>
                If you ever find this, I wanted to leave something kind instead
                of complicated. You were important to me, and the chapter we
                shared mattered to me.
              </p>
              <p>
                I am grateful for the good memories, the ordinary moments, the
                laughs, and the parts of life we got to share. I am also sorry
                for the ways I hurt you, disappointed you, or fell short. I
                cannot rewrite those parts, but I can be honest that I wish I
                had handled some things better.
              </p>
              <p>
                This is not asking you to come back, answer me, forgive me, take
                care of me, or carry anything for me. You do not owe me a place
                in your life.
              </p>
              <p>
                I hope life is kind to you. I hope you feel safe, loved well,
                respected, free to become whoever you want to become, and still
                able to laugh at ridiculous things.
              </p>
              <p>
                If our paths cross again, I hope we can meet each other with
                kindness. And if I am around and you ever actually want to say
                hi, I would rather hear from you than hide behind code.
              </p>
              <p className="font-semibold text-white/65">— Skyler</p>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {littleThings.map((item, index) => (
                <button
                  key={item.label}
                  type="button"
                  aria-pressed={selected === index}
                  onClick={() =>
                    setSelected(current => (current === index ? null : index))
                  }
                  className="rounded-2xl border border-white/[0.07] bg-black/15 p-3 text-xs font-bold text-white/45 transition hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/50"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {selected !== null ? (
              <div
                className="mt-3 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-sm leading-6 text-white/50"
                role="status"
                aria-live="polite"
              >
                {littleThings[selected].text}
              </div>
            ) : null}

            {fourFortyFourOpen ? (
              <div
                className="mt-5 rounded-2xl border border-amber-300/12 bg-amber-300/[0.025] p-4"
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-200/55" />
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-100/40">
                    4:44 pocket
                  </p>
                </div>
                <p className="mt-2 text-xs leading-6 text-white/42">
                  Four taps found the extra pocket. No prophecy, no secret
                  message, no request—just one weird little Skyler thing:
                  wherever life went after us, I hope some of it turned out
                  genuinely beautiful for you.
                </p>
              </div>
            ) : null}

            <p className="mt-5 text-[10px] leading-5 text-white/18">
              This Easter egg is static and local. It does not track opens,
              taps, responses, location, accounts, or send anything anywhere.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
