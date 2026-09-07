import { useState } from "react";
import { Sparkles } from "lucide-react";

type SkyMarkEasterEggProps = Readonly<{
  index: 1 | 2 | 3 | 4;
  word: string;
  message: string;
}>;

export default function SkyMarkEasterEgg({
  index,
  word,
  message,
}: SkyMarkEasterEggProps) {
  const [open, setOpen] = useState(false);

  return (
    <aside className="flex justify-end" aria-label={`Sky Mark ${index} of 4`}>
      <div className="max-w-md text-right">
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? `Hide Sky Mark ${index}` : `Reveal Sky Mark ${index}`}
          onClick={() => setOpen(current => !current)}
          className="ml-auto grid h-8 w-8 place-items-center rounded-full border border-white/[0.06] bg-white/[0.015] text-white/15 transition hover:border-sky-300/20 hover:bg-sky-300/[0.04] hover:text-sky-100/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300/50"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>

        {open ? (
          <div
            className="mt-3 rounded-2xl border border-sky-300/10 bg-sky-300/[0.025] p-4"
            role="status"
            aria-live="polite"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/35">
              Sky Mark {index}/4 · {word}
            </p>
            <p className="mt-2 text-xs leading-6 text-white/40">{message}</p>
            <p className="mt-2 text-[10px] leading-5 text-white/20">
              A decorative in-memory Easter egg. Nothing is saved or tracked.
            </p>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
