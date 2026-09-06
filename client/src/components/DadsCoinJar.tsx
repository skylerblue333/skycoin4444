import { useState } from "react";
import { CircleDollarSign, Sparkles } from "lucide-react";

const coins = [
  {
    name: "Courage Coin",
    face: "C",
    message:
      "Courage does not mean you were not scared. It means you chose the next good step while scared.",
  },
  {
    name: "Kindness Coin",
    face: "K",
    message:
      "Be kind, but do not confuse kindness with letting people repeatedly hurt you.",
  },
  {
    name: "Curiosity Coin",
    face: "?",
    message:
      "Ask one more question. Learn one more thing. The world gets bigger when you stay curious.",
  },
  {
    name: "Try-Again Coin",
    face: "↻",
    message:
      "You are allowed another attempt. Failure is information before it becomes identity.",
  },
  {
    name: "Sister Coin",
    face: "3",
    message:
      "Three different people, three different lives, one bond worth protecting without controlling each other.",
  },
  {
    name: "Ordinary-Day Coin",
    face: "☀",
    message:
      "Not every good day has to become a memory people post about. Some days are allowed to just feel nice.",
  },
] as const;

export default function DadsCoinJar() {
  const [openCoin, setOpenCoin] = useState<number | null>(null);

  return (
    <section className="mt-6 rounded-3xl border border-amber-300/15 bg-amber-300/[0.02] p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <CircleDollarSign className="mt-0.5 h-5 w-5 shrink-0 text-amber-200/60" />
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.24em] text-amber-100/45">
            Extremely questionable family currency
          </p>
          <h3 className="mt-2 text-xl font-black text-white/85">
            Dad's No-Value Coin Jar
          </h3>
          <p className="mt-2 max-w-3xl text-xs leading-6 text-white/40">
            Tap a coin and collect exactly zero dollars. These are jokes,
            reminders, and tiny Dad notes—not cryptocurrency, rewards, assets,
            inheritance, prizes, or anything with financial value.
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {coins.map((coin, index) => (
          <button
            key={coin.name}
            type="button"
            aria-pressed={openCoin === index}
            onClick={() =>
              setOpenCoin(current => (current === index ? null : index))
            }
            className="group rounded-3xl border border-white/[0.08] bg-black/15 p-4 text-center transition hover:-translate-y-0.5 hover:bg-white/[0.035] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/50"
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-amber-200/20 bg-amber-200/[0.04] text-xl font-black text-amber-100/60 transition group-hover:rotate-6">
              {coin.face}
            </span>
            <span className="mt-3 block text-xs font-bold text-white/50">
              {coin.name}
            </span>
          </button>
        ))}
      </div>

      {openCoin !== null ? (
        <div
          className="mt-4 rounded-2xl border border-amber-300/10 bg-black/20 p-4"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-200/55" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-100/40">
              {coins[openCoin].name}
            </p>
          </div>
          <p className="mt-2 text-sm leading-7 text-white/55">
            {coins[openCoin].message}
          </p>
        </div>
      ) : null}

      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-4 text-center">
        <p className="text-sm font-semibold text-white/55">
          Dad's exchange rate: one eye-roll = one premium coin.
        </p>
        <p className="mt-2 text-xs leading-5 text-white/30">
          Supply: unlimited. Market cap: nonsense. Utility: maybe making you
          smile for eight seconds.
        </p>
      </div>

      <p className="mt-5 text-center text-[10px] leading-5 text-white/20">
        The coin jar uses local component state only. It creates no wallet,
        balance, token, payment, reward, profile, storage record, or network
        request.
      </p>
    </section>
  );
}
