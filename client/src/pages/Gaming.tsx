import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Crown,
  Gamepad2,
  Play,
  Shield,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GameCategory =
  | "all"
  | "arcade"
  | "knowledge"
  | "strategy"
  | "simulation";

const games = [
  {
    id: "sky-rush",
    name: "Sky Rush",
    detail:
      "Three-lane reflex runner with escalating speed, combo chains, shields, and no-value Sparks.",
    icon: Zap,
    href: "/game-sky-rush",
    category: "arcade" as const,
    duration: "3–6 min",
    featured: true,
    gradient: "from-violet-600 via-fuchsia-600 to-sky-600",
    tag: "NEW",
  },
  {
    id: "arcade-lab",
    name: "Arcade Lab",
    detail:
      "Deterministic high-low, memory, word, trivia, tower, mines, board, snake, and puzzle modules.",
    icon: Gamepad2,
    href: "/arcade",
    category: "arcade" as const,
    duration: "Pick a game",
    featured: true,
    gradient: "from-sky-600 via-blue-700 to-indigo-800",
    tag: "13 MODES",
  },
  {
    id: "crypto-quiz",
    name: "Crypto Quiz Blitz",
    detail:
      "Timed blockchain recall with Study XP, streaks, and no token payout.",
    icon: Brain,
    href: "/game-crypto-quiz",
    category: "knowledge" as const,
    duration: "~4 min",
    featured: true,
    gradient: "from-cyan-600 via-blue-700 to-violet-700",
    tag: "LEARN + PLAY",
  },
  {
    id: "token-tap",
    name: "Spark Tap",
    detail:
      "Thirty-second speed/combo challenge using game-only Sparks instead of fake token donations.",
    icon: Sparkles,
    href: "/game-token-tap",
    category: "arcade" as const,
    duration: "30 sec",
    featured: false,
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    tag: "COMBO",
  },
  {
    id: "block-builder",
    name: "Block Builder",
    detail:
      "Stacking and timing challenge presented as deterministic local play.",
    icon: Target,
    href: "/game-block-builder",
    category: "strategy" as const,
    duration: "Short run",
    featured: false,
    gradient: "from-amber-600 via-orange-700 to-rose-800",
    tag: "PUZZLE",
  },
  {
    id: "blackjack",
    name: "Blackjack Lab",
    detail:
      "Card-strategy simulation only. No wager, payout, wallet, or real-money execution.",
    icon: Crown,
    href: "/game-blackjack",
    category: "simulation" as const,
    duration: "Practice",
    featured: false,
    gradient: "from-emerald-700 via-green-800 to-slate-900",
    tag: "SIMULATION",
  },
  {
    id: "crash",
    name: "Crash Lab",
    detail:
      "Multiplier-style simulation with no wager, payout, token, or settlement value.",
    icon: TimerReset,
    href: "/game-crash",
    category: "simulation" as const,
    duration: "Practice",
    featured: false,
    gradient: "from-fuchsia-700 via-violet-800 to-slate-950",
    tag: "SIMULATION",
  },
] as const;

const filters: Array<{ id: GameCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "arcade", label: "Arcade" },
  { id: "knowledge", label: "Knowledge" },
  { id: "strategy", label: "Strategy" },
  { id: "simulation", label: "Simulations" },
];

function dailyPickIndex() {
  const now = new Date();
  const day =
    Math.floor(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
        86_400_000
    ) || 0;
  return Math.abs(day) % games.length;
}

export default function Gaming() {
  const [filter, setFilter] = useState<GameCategory>("all");
  const tournamentsQuery = trpc.gamefi.tournaments.useQuery(undefined, {
    retry: false,
  });
  const questsQuery = trpc.gamefi.quests.useQuery(undefined, {
    retry: false,
  });
  const leaderboardQuery = trpc.gamefi.leaderboard.useQuery(
    { type: "global", limit: 5 },
    { retry: false }
  );

  const visibleGames = useMemo(
    () =>
      filter === "all"
        ? games
        : games.filter(game => game.category === filter),
    [filter]
  );
  const dailyGame = games[dailyPickIndex()];
  const tournaments = (tournamentsQuery.data ?? []) as any[];
  const quests = (questsQuery.data ?? []) as any[];
  const leaderboard = (leaderboardQuery.data ?? []) as any[];

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-14rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-[-12rem] top-52 h-[30rem] w-[30rem] rounded-full bg-cyan-500/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-700/80 via-fuchsia-800/55 to-sky-900/70 p-6 shadow-2xl shadow-violet-950/30 sm:p-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(255,255,255,.18),transparent_28%)]" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/15 text-white">
                  Games Center
                </Badge>
                <Badge
                  variant="outline"
                  className="border-white/20 text-white/70"
                >
                  Engineering beta · no real-money play
                </Badge>
              </div>
              <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                Learn. Play. Chase a better run.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/65">
                Replayable deterministic games, knowledge challenges, and
                backend quest/tournament records in one place. Game-only
                Sparks, XP, ranks, and scores have no monetary value.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/game-sky-rush">
                  <Button
                    size="lg"
                    className="bg-white text-violet-900 hover:bg-white/90"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Play Sky Rush
                  </Button>
                </Link>
                <Link href="/arcade">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/25 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Open Arcade Lab
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-white/15 bg-black/20 text-white backdrop-blur">
              <CardHeader>
                <CardDescription className="text-white/45">
                  Daily deterministic pick
                </CardDescription>
                <CardTitle className="text-2xl text-white">
                  {dailyGame.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-white/55">
                  {dailyGame.detail}
                </p>
                <Link href={dailyGame.href}>
                  <Button className="mt-4 w-full">
                    Start today's pick
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Playable routes", games.length, Gamepad2],
            [
              "Quest records",
              questsQuery.isLoading ? "…" : quests.length,
              Target,
            ],
            [
              "Tournament records",
              tournamentsQuery.isLoading ? "…" : tournaments.length,
              Trophy,
            ],
            [
              "Leaderboard records",
              leaderboardQuery.isLoading ? "…" : leaderboard.length,
              Crown,
            ],
          ].map(([label, value, Icon]) => (
            <Card
              key={label as string}
              className="border-white/10 bg-white/[0.035] text-white"
            >
              <CardContent className="p-5">
                <Icon className="h-5 w-5 text-violet-200" />
                <p className="mt-4 text-3xl font-black">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/30">
                  {label}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/30">
                Play now
              </p>
              <h2 className="mt-2 text-3xl font-black">Game library</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  aria-pressed={filter === item.id}
                  className={
                    "rounded-full border px-3 py-2 text-xs font-semibold transition " +
                    (filter === item.id
                      ? "border-violet-300/35 bg-violet-300/[0.09] text-violet-100"
                      : "border-white/10 bg-white/[0.025] text-white/45 hover:border-white/20 hover:text-white")
                  }
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleGames.map(game => {
              const Icon = game.icon;
              return (
                <Link
                  key={game.id}
                  href={game.href}
                  className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-violet-300/25 hover:shadow-2xl hover:shadow-violet-950/20"
                >
                  <div
                    className={
                      "relative aspect-[16/8] bg-gradient-to-br p-5 " +
                      game.gradient
                    }
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(255,255,255,.22),transparent_30%)]" />
                    <div className="relative flex h-full flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                          <Icon className="h-5 w-5" />
                        </span>
                        <Badge className="bg-black/20 text-white">
                          {game.tag}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                          {game.category} · {game.duration}
                        </p>
                        <h3 className="mt-1 text-2xl font-black">{game.name}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="min-h-12 text-sm leading-6 text-white/45">
                      {game.detail}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-violet-100">
                      Play
                      <Play className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-emerald-200" />
                Quest records
              </CardTitle>
              <CardDescription className="text-white/45">
                Current records returned by the existing GameFi service.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {questsQuery.isLoading ? (
                <p className="text-sm text-white/35">Loading quests…</p>
              ) : questsQuery.error ? (
                <p className="text-sm text-rose-200">
                  Quest records are unavailable.
                </p>
              ) : quests.length === 0 ? (
                <p className="text-sm text-white/35">
                  No quest records are currently available.
                </p>
              ) : (
                quests.slice(0, 4).map((quest: any, index: number) => (
                  <div
                    key={quest.id ?? index}
                    className="rounded-2xl border border-white/[0.08] bg-black/20 p-3"
                  >
                    <p className="font-semibold text-white">
                      {quest.name ?? `Quest ${index + 1}`}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-white/35">
                      {quest.description ?? quest.type ?? "Quest details"}
                    </p>
                    {quest.rewardXp ? (
                      <p className="mt-2 text-xs font-semibold text-emerald-200">
                        {quest.rewardXp} service XP
                      </p>
                    ) : null}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Trophy className="h-5 w-5 text-amber-200" />
                Tournaments
              </CardTitle>
              <CardDescription className="text-white/45">
                Backend records only; no invented prize pools or active-player
                counts.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {tournamentsQuery.isLoading ? (
                <p className="text-sm text-white/35">
                  Loading tournaments…
                </p>
              ) : tournamentsQuery.error ? (
                <p className="text-sm text-rose-200">
                  Tournament records are unavailable.
                </p>
              ) : tournaments.length === 0 ? (
                <p className="text-sm text-white/35">
                  No tournament records are currently available.
                </p>
              ) : (
                tournaments.slice(0, 4).map((item: any, index: number) => (
                  <div
                    key={item.id ?? index}
                    className="rounded-2xl border border-white/[0.08] bg-black/20 p-3"
                  >
                    <p className="font-semibold">
                      {item.name ?? `Tournament ${index + 1}`}
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      {item.status ?? "Record available"}
                    </p>
                  </div>
                ))
              )}
              <Link href="/tournaments">
                <Button
                  variant="outline"
                  className="w-full border-white/15 bg-white/[0.03] text-white"
                >
                  Open tournament hub
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Crown className="h-5 w-5 text-yellow-200" />
                Leaderboard records
              </CardTitle>
              <CardDescription className="text-white/45">
                Only rows returned by the current backend query.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaderboardQuery.isLoading ? (
                <p className="text-sm text-white/35">
                  Loading leaderboard…
                </p>
              ) : leaderboardQuery.error ? (
                <p className="text-sm text-rose-200">
                  Leaderboard records are unavailable.
                </p>
              ) : leaderboard.length === 0 ? (
                <p className="text-sm text-white/35">
                  No leaderboard records are currently available.
                </p>
              ) : (
                leaderboard.map((entry: any, index: number) => (
                  <div
                    key={entry.id ?? entry.userId ?? index}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 p-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/[0.06] text-xs font-black">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {entry.username ??
                          entry.name ??
                          `Player ${index + 1}`}
                      </p>
                      <p className="text-xs text-white/30">
                        {entry.score ??
                          entry.xp ??
                          entry.points ??
                          0}{" "}
                        points
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Link
            href="/sky-school"
            className="rounded-3xl border border-blue-300/20 bg-blue-300/[0.04] p-5 transition hover:-translate-y-0.5"
          >
            <BookOpen className="h-5 w-5 text-blue-200" />
            <h2 className="mt-3 font-bold">Learn before you play</h2>
            <p className="mt-2 text-sm leading-6 text-white/40">
              SkySchool turns authored lessons into durable progress and quick
              recall loops.
            </p>
          </Link>
          <Link
            href="/hope-a-i"
            className="rounded-3xl border border-violet-300/20 bg-violet-300/[0.04] p-5 transition hover:-translate-y-0.5"
          >
            <Brain className="h-5 w-5 text-violet-200" />
            <h2 className="mt-3 font-bold">Ask HopeAI Coach</h2>
            <p className="mt-2 text-sm leading-6 text-white/40">
              Build a deterministic Play or Learn sprint from your real account
              evidence.
            </p>
          </Link>
          <div className="rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.04] p-5">
            <Shield className="h-5 w-5 text-emerald-200" />
            <h2 className="mt-3 font-bold">Responsible beta boundary</h2>
            <p className="mt-2 text-sm leading-6 text-white/40">
              No real-money wagering, custody, prize settlement, token payout,
              or production blockchain execution is performed by this hub.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
