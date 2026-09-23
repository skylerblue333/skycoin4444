import { motion } from "framer-motion";
import { Link } from "wouter";
import {
  ArrowRight,
  CircleDot,
  Coins,
  Gamepad2,
  Gauge,
  Layers3,
  ShieldCheck,
  Sparkles,
  Spade,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DemoBoundary, GamingBackdrop, StatusBadge } from "@/features/gaming/components/ArcadeSurface";

const flagshipGames = [
  {
    name: "Crash",
    eyebrow: "MULTIPLIER",
    detail: "A fast animated curve with manual and auto cash-out, seeded round history, and a dedicated full-screen stage.",
    href: "/game-crash",
    icon: TrendingUp,
    tint: "from-fuchsia-500/28 via-violet-500/10 to-transparent",
    stat: "Timing",
    preview: "1.00x → ?",
  },
  {
    name: "Plinko",
    eyebrow: "PHYSICS-STYLE DROP",
    detail: "An animated ten-row board with a visible seeded path, eleven buckets, and risk-reward multipliers.",
    href: "/arcade#plinko",
    icon: Layers3,
    tint: "from-cyan-500/28 via-blue-500/10 to-transparent",
    stat: "10 rows",
    preview: "8x · 4.1x · 2x",
  },
  {
    name: "High-Low",
    eyebrow: "CARD RUN",
    detail: "Call the next card, build a streak, and play through rapid animated reveals with local demo scoring.",
    href: "/arcade#high-low",
    icon: Gauge,
    tint: "from-amber-500/28 via-orange-500/10 to-transparent",
    stat: "Streak",
    preview: "7 → ?",
  },
  {
    name: "Blackjack",
    eyebrow: "DEALER TABLE",
    detail: "A dedicated table with animated cards, Hit, Stand, Double, dealer draw logic, natural blackjack, and hand history.",
    href: "/game-blackjack",
    icon: Spade,
    tint: "from-emerald-500/28 via-green-500/10 to-transparent",
    stat: "Dealer 17",
    preview: "A♠  K♥",
  },
  {
    name: "Roulette",
    eyebrow: "EUROPEAN WHEEL",
    detail: "A 37-pocket wheel with European ordering, animated rotation, color/parity/straight bets, and round history.",
    href: "/arcade#roulette",
    icon: CircleDot,
    tint: "from-rose-500/28 via-red-500/10 to-transparent",
    stat: "0–36",
    preview: "32 · 15 · 19",
  },
] as const;

const cryptoGames = [
  {
    name: "Hash Hunt",
    detail: "Scan candidate hashes against a target nibble and build a clean-room crypto skill streak.",
  },
  {
    name: "Wallet Defense",
    detail: "Rapid safety decisions around recovery phrases, public addresses, signatures, and confirmations.",
  },
] as const;

export default function Gaming() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <GamingBackdrop />
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-7 sm:px-6 sm:py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#090b12]/95 shadow-2xl shadow-black/50">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(217,70,239,.18),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(34,211,238,.12),transparent_30%),radial-gradient(circle_at_70%_100%,rgba(16,185,129,.10),transparent_30%)]" />
          <div className="relative grid gap-10 p-6 sm:p-9 lg:grid-cols-[1.2fr_.8fr] lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-fuchsia-500/15 text-fuchsia-100">SKY ARCADE V2</Badge>
                <StatusBadge tone="live">Rebuilt game floor</StatusBadge>
                <Badge variant="outline" className="border-white/10 text-white/45">Demo credits only</Badge>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.055em] sm:text-6xl lg:text-7xl">
                Fewer games.
                <span className="block bg-gradient-to-r from-fuchsia-300 via-white to-cyan-200 bg-clip-text text-transparent">
                  Deeper gameplay.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/52 sm:text-lg">
                The old quantity-first gaming catalog is retired from the flagship Games Center.
                Five core games now get dedicated mechanics, animation, round state, history, and a consistent premium game shell.
                Crypto Ops remains a smaller skill arcade instead of pretending token wagering is live.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/game-crash">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90">
                    Enter Crash
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/arcade#plinko">
                  <Button size="lg" variant="outline" className="border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]">
                    Open arcade floor
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
                {[
                  ["05", "flagship games"],
                  ["02", "crypto skill modes"],
                  ["CHARITY", "only finance scope"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <p className="text-2xl font-black">{value}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid content-center gap-4">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl border border-fuchsia-300/15 bg-black/30 p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-fuchsia-100/45">Crash preview</p>
                    <p className="mt-2 text-6xl font-black tracking-[-0.07em]">2.84x</p>
                  </div>
                  <TrendingUp className="h-9 w-9 text-fuchsia-200/65" />
                </div>
                <div className="mt-5 h-28 overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(217,70,239,.08),rgba(0,0,0,.15))] p-3">
                  <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
                    <path d="M0 38 C30 37, 50 33, 66 24 S88 8, 100 2" fill="none" stroke="rgba(232,121,249,.85)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  </svg>
                </div>
              </motion.div>

              <DemoBoundary compact />

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-200/70" />
                  <p className="mt-3 text-xs leading-5 text-white/38">Deterministic seeds support repeatable engineering tests, not certified provably-fair claims.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                  <Coins className="h-5 w-5 text-amber-200/70" />
                  <p className="mt-3 text-xs leading-5 text-white/38">Browser-local demo game state has no cash or token value and resets locally.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-fuchsia-200/55">Flagship floor</p>
              <h2 className="mt-1 text-3xl font-black">Five core games</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/35">
              Every promoted game owns a real replay loop and visual stage instead of acting like another thin route in a giant catalog.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {flagshipGames.map((game, index) => {
              const Icon = game.icon;
              return (
                <Link key={game.name} href={game.href}>
                  <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.18 }} className="h-full">
                    <Card className="group h-full overflow-hidden border-white/10 bg-[#0a0c13]/92 text-white transition hover:border-white/20">
                      <div className={"relative h-36 bg-gradient-to-br " + game.tint}>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:22px_22px]" />
                        <div className="relative flex h-full flex-col justify-between p-5">
                          <div className="flex items-start justify-between">
                            <Icon className="h-8 w-8 text-white/85" />
                            <span className="text-[9px] font-black uppercase tracking-[0.18em] text-white/35">{game.eyebrow}</span>
                          </div>
                          <p className="font-mono text-xl font-black text-white/78">{game.preview}</p>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between gap-3">
                          <CardTitle className="text-2xl text-white">{game.name}</CardTitle>
                          <span className="text-[10px] font-bold uppercase tracking-[0.13em] text-white/28">{game.stat}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="min-h-28 text-sm leading-6 text-white/42">{game.detail}</p>
                        <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/80">
                          Play
                          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[.78fr_1.22fr]">
          <Card className="overflow-hidden border-cyan-300/15 bg-cyan-300/[0.035] text-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-cyan-200">
                <Gamepad2 className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100/45">Crypto Ops</span>
              </div>
              <CardTitle className="text-3xl text-white">Crypto mechanics without fake finance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-white/45">
                Hash recognition and wallet-safety decisions use crypto concepts as gameplay.
                They do not connect a wallet, move assets, mint rewards, or represent mining income.
              </p>
              <Link href="/arcade#crypto">
                <Button className="mt-5">
                  Open Crypto Ops
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            {cryptoGames.map(game => (
              <Link key={game.name} href="/arcade#crypto">
                <Card className="h-full border-white/10 bg-white/[0.03] text-white transition hover:border-cyan-300/20">
                  <CardContent className="p-6">
                    <Sparkles className="h-5 w-5 text-cyan-200/70" />
                    <h3 className="mt-5 text-2xl font-black">{game.name}</h3>
                    <p className="mt-3 text-sm leading-6 text-white/40">{game.detail}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-5 text-white/35">
          <strong className="text-white/60">Engineering beta:</strong> No deposits, withdrawals, wallet wagering, custody, or blockchain settlement are live today. Any future deposit, withdrawal, real-money wager, custody, token settlement, or redeemable crypto reward is restricted to the charity-only finance path and requires verified beneficiaries plus approved external providers. Credits, chips, multipliers, and payouts on the flagship floor remain browser-local demo game state with no cash or token value.
        </section>
      </div>
    </main>
  );
}
