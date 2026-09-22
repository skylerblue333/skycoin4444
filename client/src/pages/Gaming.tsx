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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const flagshipGames = [
  {
    name: "Crash",
    eyebrow: "MULTIPLIER",
    detail: "Ride a rising multiplier and lock before the deterministic demo crash point.",
    href: "/game-crash",
    icon: TrendingUp,
    accent: "from-fuchsia-500/25 via-violet-500/10 to-transparent",
    metric: "Live timing",
  },
  {
    name: "Plinko",
    eyebrow: "DROP",
    detail: "Drop a demo chip through a 10-row board and watch the seeded path resolve.",
    href: "/arcade#plinko",
    icon: Layers3,
    accent: "from-cyan-500/25 via-blue-500/10 to-transparent",
    metric: "10 rows",
  },
  {
    name: "High-Low",
    eyebrow: "CARDS",
    detail: "Call higher or lower against the next seeded card and build a streak.",
    href: "/arcade#high-low",
    icon: Gauge,
    accent: "from-amber-500/25 via-orange-500/10 to-transparent",
    metric: "Streak play",
  },
  {
    name: "Blackjack",
    eyebrow: "TABLE",
    detail: "Play full dealer hands with Hit, Stand, and Double using demo chips only.",
    href: "/game-blackjack",
    icon: Spade,
    accent: "from-emerald-500/25 via-green-500/10 to-transparent",
    metric: "Dealer rules",
  },
  {
    name: "Roulette",
    eyebrow: "WHEEL",
    detail: "Pick color, parity, or a straight number and spin the seeded demo wheel.",
    href: "/arcade#roulette",
    icon: CircleDot,
    accent: "from-rose-500/25 via-red-500/10 to-transparent",
    metric: "0–36 wheel",
  },
] as const;

const cryptoGames = [
  {
    name: "Hash Hunt",
    detail: "Spot the candidate hash that matches the requested leading nibble.",
    href: "/arcade#crypto",
  },
  {
    name: "Wallet Defense",
    detail: "Fast security decisions around seed phrases, addresses, signatures, and confirmations.",
    href: "/arcade#crypto",
  },
] as const;

export default function Gaming() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#05060a] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-12rem] top-[-10rem] h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/15 blur-3xl" />
        <div className="absolute right-[-10rem] top-20 h-[32rem] w-[32rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-[-16rem] left-1/3 h-[30rem] w-[30rem] rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 sm:py-12">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(24,24,38,.96),rgba(7,9,16,.96))] shadow-2xl shadow-black/40">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.25fr_.75fr] lg:p-12">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-fuchsia-500/15 text-fuchsia-100">SKY ARCADE</Badge>
                <Badge variant="outline" className="border-cyan-300/20 text-cyan-100">
                  Rebuilt flagship beta
                </Badge>
                <Badge variant="outline" className="border-white/10 text-white/45">
                  Demo credits only
                </Badge>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Fewer games.
                <span className="block bg-gradient-to-r from-fuchsia-300 via-violet-200 to-cyan-200 bg-clip-text text-transparent">
                  Better games.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-white/50 sm:text-lg">
                The old quantity-first catalog is no longer the main experience.
                SKYCOIN4444 Gaming now centers on Crash, Plinko, High-Low,
                Blackjack, Roulette, and a small Crypto Ops arcade.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/game-crash">
                  <Button size="lg" className="bg-white text-black hover:bg-white/90">
                    Play Crash
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/arcade#plinko">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                  >
                    Open game floor
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-white/10 bg-black/25 text-white backdrop-blur">
              <CardHeader>
                <CardDescription className="text-white/40">Beta rules</CardDescription>
                <CardTitle className="text-2xl text-white">Play without pretending</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-6 text-white/45">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <p>No deposits, withdrawals, wallet wagering, custody, or blockchain settlement.</p>
                </div>
                <div className="flex gap-3">
                  <Coins className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <p>Credits, chips, multipliers, and payouts are browser-local demo game state with no cash or token value.</p>
                </div>
                <div className="flex gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                  <p>Seed/proof strings are for repeatable engineering tests; they are not a certified provably-fair system.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-fuchsia-200/60">Flagship floor</p>
              <h2 className="mt-1 text-3xl font-black">Five core games</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/35">
              Every promoted game has its own replay loop, visible state, deterministic demo engine, and a clear no-value boundary.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {flagshipGames.map(game => {
              const Icon = game.icon;
              return (
                <Link key={game.name} href={game.href}>
                  <Card className="group h-full overflow-hidden border-white/10 bg-white/[0.035] text-white transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055]">
                    <div className={"h-28 bg-gradient-to-br " + game.accent}>
                      <div className="flex h-full items-end justify-between p-5">
                        <Icon className="h-9 w-9 text-white/85" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                          {game.eyebrow}
                        </span>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-2xl text-white">{game.name}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-[0.14em] text-white/30">
                        {game.metric}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="min-h-20 text-sm leading-6 text-white/45">{game.detail}</p>
                      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/80">
                        Play
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
          <Card className="border-cyan-300/15 bg-cyan-300/[0.035] text-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-cyan-200">
                <Gamepad2 className="h-5 w-5" />
                <CardDescription className="text-cyan-100/45">Crypto Ops</CardDescription>
              </div>
              <CardTitle className="text-3xl text-white">Crypto-themed skill games</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-white/45">
                Crypto should add mechanics, not fake money claims. These games use blockchain and wallet concepts as the challenge itself.
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
              <Link key={game.name} href={game.href}>
                <Card className="h-full border-white/10 bg-white/[0.03] text-white transition hover:border-cyan-300/20">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{game.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-white/40">{game.detail}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-xs leading-5 text-white/35">
          <strong className="text-white/60">Engineering beta:</strong> this rebuild intentionally removes the legacy quantity-first positioning from the flagship Games Center. Legacy routes can remain for compatibility, but they are not part of the promoted arcade lineup.
        </section>
      </div>
    </main>
  );
}
