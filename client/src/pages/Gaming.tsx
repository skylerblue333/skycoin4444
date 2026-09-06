import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Gamepad2,
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  arcadePassportBadges,
  arcadePassportLevel,
  dailyArcadeGameIds,
  loadArcadePassport,
  toggleArcadeFavoriteInStorage,
  type ArcadeGameId,
  type ArcadePassport,
} from "@/lib/arcadePassport";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type GameCategory =
  | "all"
  | "arcade"
  | "knowledge"
  | "strategy"
  | "simulation";

type GameDefinition = Readonly<{
  id: ArcadeGameId;
  name: string;
  detail: string;
  href: string;
  category: Exclude<GameCategory, "all">;
  duration: string;
  tag: string;
  gradient: string;
  icon: typeof Gamepad2;
}>;

const games: readonly GameDefinition[] = [
  {
    id: "sky-rush",
    name: "Sky Rush",
    detail:
      "Three-lane reflex runner with escalating speed, shields, combos, and no-value Sparks.",
    href: "/game-sky-rush",
    category: "arcade",
    duration: "3–6 min",
    tag: "FEATURED",
    gradient: "from-violet-600 via-fuchsia-600 to-sky-600",
    icon: Zap,
  },
  {
    id: "crypto-quiz",
    name: "Crypto Quiz Blitz",
    detail:
      "Fast blockchain recall with Study XP and no token payout or financial reward.",
    href: "/game-crypto-quiz",
    category: "knowledge",
    duration: "~4 min",
    tag: "LEARN + PLAY",
    gradient: "from-cyan-600 via-blue-700 to-violet-700",
    icon: Brain,
  },
  {
    id: "spark-tap",
    name: "Spark Tap",
    detail:
      "Thirty-second speed/combo challenge with device-local Sparks and XP only.",
    href: "/game-token-tap",
    category: "arcade",
    duration: "30 sec",
    tag: "COMBO",
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    icon: Sparkles,
  },
  {
    id: "block-builder",
    name: "Block Builder",
    detail:
      "Timing/stacking puzzle with local scores, perfect-drop chains, and no-value Sparks.",
    href: "/game-block-builder",
    category: "strategy",
    duration: "Short run",
    tag: "PUZZLE",
    gradient: "from-amber-600 via-orange-700 to-rose-800",
    icon: Target,
  },
  {
    id: "arcade-lab",
    name: "Arcade Lab",
    detail:
      "A library of deterministic memory, word, logic, board, snake, and puzzle mini-games.",
    href: "/arcade",
    category: "arcade",
    duration: "Pick a mode",
    tag: "13 MODES",
    gradient: "from-sky-600 via-blue-700 to-indigo-800",
    icon: Gamepad2,
  },
  {
    id: "blackjack-lab",
    name: "Blackjack Strategy Lab",
    detail:
      "Card-decision practice scored for strategy quality only—no chips, wagers, payouts, or balance.",
    href: "/game-blackjack",
    category: "simulation",
    duration: "Practice",
    tag: "SKILL LAB",
    gradient: "from-emerald-700 via-green-800 to-slate-900",
    icon: Star,
  },
  {
    id: "crash-lab",
    name: "Multiplier Reflex Lab",
    detail:
      "Timing/reflex practice against a deterministic rising curve with score only and no cashout value.",
    href: "/game-crash",
    category: "simulation",
    duration: "Practice",
    tag: "REFLEX LAB",
    gradient: "from-fuchsia-700 via-violet-800 to-slate-950",
    icon: Zap,
  },
  {
    id: "pattern-lab",
    name: "Pattern Match Lab",
    detail:
      "Short reel-pattern recognition rounds scored for matches—no betting, auto-spin, balance, RTP, or payout.",
    href: "/game-slots",
    category: "simulation",
    duration: "Short rounds",
    tag: "PATTERN LAB",
    gradient: "from-yellow-600 via-orange-700 to-red-800",
    icon: Star,
  },
];

const filters: ReadonlyArray<{ id: GameCategory; label: string }> = [
  { id: "all", label: "All" },
  { id: "arcade", label: "Arcade" },
  { id: "knowledge", label: "Knowledge" },
  { id: "strategy", label: "Strategy" },
  { id: "simulation", label: "Skill simulations" },
];

function latestPlayed(passport: ArcadePassport): ArcadeGameId | null {
  let latest: { id: ArcadeGameId; time: number } | null = null;

  for (const game of games) {
    const raw = passport.games[game.id].lastPlayedAt;
    const time = raw ? Date.parse(raw) : Number.NaN;
    if (!Number.isFinite(time)) continue;
    if (!latest || time > latest.time) latest = { id: game.id, time };
  }

  return latest?.id ?? null;
}

export default function Gaming() {
  const [filter, setFilter] = useState<GameCategory>("all");
  const [passport, setPassport] = useState(() => loadArcadePassport());

  const visibleGames = useMemo(
    () =>
      filter === "all"
        ? games
        : games.filter(game => game.category === filter),
    [filter]
  );
  const dailyGame =
    games.find(game => game.id === passport.daily.gameId) ?? games[0];
  const recentGameId = latestPlayed(passport);
  const recentGame = recentGameId
    ? games.find(game => game.id === recentGameId)
    : null;
  const unlockedBadges = arcadePassportBadges(passport).filter(
    badge => badge.unlocked
  ).length;
  const uniqueGamesPlayed = dailyArcadeGameIds.filter(
    gameId => passport.games[gameId].plays > 0
  ).length;

  function toggleFavorite(gameId: ArcadeGameId) {
    setPassport(toggleArcadeFavoriteInStorage(gameId));
  }

  function refreshPassport() {
    setPassport(loadArcadePassport());
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#050510] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-14rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-[-12rem] top-52 h-[30rem] w-[30rem] rounded-full bg-cyan-500/12 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-10">
        <section className="relative overflow-hidden rounded-[2rem] border border-violet-300/20 bg-gradient-to-br from-violet-700/80 via-fuchsia-800/55 to-sky-900/70 p-6 shadow-2xl shadow-violet-950/30 sm:p-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(255,255,255,.18),transparent_28%)]" />
          <div className="relative grid gap-7 lg:grid-cols-[1fr_380px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-white/15 text-white">Games Center</Badge>
                <Badge
                  variant="outline"
                  className="border-white/20 text-white/70"
                >
                  Arcade Passport · no real-money play
                </Badge>
              </div>
              <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-tight sm:text-6xl">
                Learn. Play. Build a better run.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/65">
                Replayable arcade, knowledge, strategy, and simulation modes
                connected by one device-local progression layer. Sparks, Study
                XP, scores, badges, favorites, and daily challenges have no
                monetary or token value.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={dailyGame.href}>
                  <Button
                    size="lg"
                    className="bg-white text-violet-900 hover:bg-white/90"
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Play today's challenge
                  </Button>
                </Link>
                <Link href="/game-fi-quest-board">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/25 bg-white/10 text-white hover:bg-white/15"
                  >
                    <Target className="mr-2 h-5 w-5" />
                    Open Quest Board
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="border-white/15 bg-black/20 text-white backdrop-blur">
              <CardHeader>
                <CardDescription className="text-white/45">
                  Arcade Passport
                </CardDescription>
                <CardTitle className="text-2xl text-white">
                  Level {arcadePassportLevel(passport)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    ["Runs", passport.totalPlays],
                    ["Sparks", passport.totalSparks],
                    ["Study XP", passport.totalXp],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-white/10 bg-white/[0.04] p-3"
                    >
                      <p className="text-xl font-black">{value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-white/30">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs text-white/35">
                    <span>Games sampled</span>
                    <span>
                      {uniqueGamesPlayed}/{dailyArcadeGameIds.length}
                    </span>
                  </div>
                  <Progress
                    value={
                      (uniqueGamesPlayed / dailyArcadeGameIds.length) * 100
                    }
                    className="mt-2 h-1.5"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-white/60"
                  onClick={refreshPassport}
                >
                  Refresh local progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Recorded runs",
              value: passport.totalPlays,
              icon: Gamepad2,
            },
            {
              label: "Games sampled",
              value: uniqueGamesPlayed,
              icon: Trophy,
            },
            {
              label: "Unlocked badges",
              value: unlockedBadges,
              icon: Star,
            },
            {
              label: "Favorites",
              value: passport.favorites.length,
              icon: Heart,
            },
          ].map(({ label, value, icon: Icon }) => (
            <Card
              key={label}
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

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border-cyan-300/20 bg-cyan-300/[0.04] text-white">
            <CardHeader>
              <CardDescription className="text-cyan-100/55">
                Daily deterministic pick
              </CardDescription>
              <CardTitle className="text-2xl text-white">
                {dailyGame.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-white/45">
                {dailyGame.detail}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className={
                    passport.daily.completed
                      ? "border-emerald-300/25 text-emerald-100"
                      : "border-cyan-300/25 text-cyan-100"
                  }
                >
                  {passport.daily.completed ? "Cleared today" : "Open today"}
                </Badge>
                <Link href={dailyGame.href}>
                  <Button>Play daily</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardDescription className="text-white/45">
                Continue
              </CardDescription>
              <CardTitle className="text-2xl text-white">
                {recentGame ? recentGame.name : "Start your first run"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-white/45">
                {recentGame
                  ? "Jump back into the most recently recorded Arcade Passport mode."
                  : "Pick any mode below. The first finished run starts your device-local passport."}
              </p>
              <Link href={recentGame?.href ?? "/game-sky-rush"}>
                <Button
                  variant="outline"
                  className="mt-4 border-white/15 bg-white/[0.03] text-white"
                >
                  {recentGame ? "Continue" : "Start with Sky Rush"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
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
              const progress = passport.games[game.id];
              const favorite = passport.favorites.includes(game.id);

              return (
                <Card
                  key={game.id}
                  className="group overflow-hidden border-white/10 bg-white/[0.03] text-white transition hover:-translate-y-1 hover:border-violet-300/25 hover:shadow-2xl hover:shadow-violet-950/20"
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
                        <button
                          type="button"
                          aria-label={
                            favorite
                              ? "Remove from favorite games"
                              : "Add to favorite games"
                          }
                          onClick={() => toggleFavorite(game.id)}
                          className={
                            "grid h-10 w-10 place-items-center rounded-xl border backdrop-blur transition " +
                            (favorite
                              ? "border-rose-200/40 bg-rose-300/20 text-rose-100"
                              : "border-white/15 bg-black/15 text-white/60 hover:text-white")
                          }
                        >
                          <Heart
                            className="h-4 w-4"
                            fill={favorite ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
                          {game.category} · {game.duration}
                        </p>
                        <h3 className="mt-1 text-2xl font-black">{game.name}</h3>
                      </div>
                    </div>
                  </div>

                  <CardContent className="space-y-4 p-4">
                    <p className="min-h-12 text-sm leading-6 text-white/45">
                      {game.detail}
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {[
                        ["Runs", progress.plays],
                        ["Best", progress.bestScore],
                        ["Combo", progress.bestCombo],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-white/[0.07] bg-black/20 p-2"
                        >
                          <p className="font-bold text-white">{value}</p>
                          <p className="text-[10px] uppercase tracking-[0.1em] text-white/25">
                            {label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Link href={game.href}>
                      <Button className="w-full">
                        Play {game.name}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <Card className="border-violet-300/20 bg-violet-300/[0.04] text-white">
            <CardHeader>
              <Target className="h-5 w-5 text-violet-200" />
              <CardTitle className="mt-2 text-white">Quest Board</CardTitle>
              <CardDescription className="text-white/45">
                Daily challenge, milestones, and badges derived from real local
                runs instead of unavailable GameFi backend calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/game-fi-quest-board">
                <Button className="w-full">Open Arcade Passport</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-blue-300/20 bg-blue-300/[0.04] text-white">
            <CardHeader>
              <BookOpen className="h-5 w-5 text-blue-200" />
              <CardTitle className="mt-2 text-white">Learn → play</CardTitle>
              <CardDescription className="text-white/45">
                Move from authored SkySchool lessons into recall and arcade
                practice.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sky-school">
                <Button
                  variant="outline"
                  className="w-full border-blue-300/20 bg-blue-300/[0.03] text-white"
                >
                  Open SkySchool
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-emerald-300/20 bg-emerald-300/[0.04] text-white">
            <CardHeader>
              <ShieldCheck className="h-5 w-5 text-emerald-200" />
              <CardTitle className="mt-2 text-white">Healthy loop</CardTitle>
              <CardDescription className="text-white/45">
                Daily play is optional. There is no streak penalty, wager,
                balance pressure, auto-spin, payout, or notification pressure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/hope-a-i">
                <Button
                  variant="outline"
                  className="w-full border-emerald-300/20 bg-emerald-300/[0.03] text-white"
                >
                  Ask HopeAI for a sprint
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          Arcade Passport progression is stored only in this browser. Sparks,
          Study XP, scores, badges, favorites, and daily completion are not
          transferable assets, wallet balances, prizes, server-backed rankings,
          financial rewards, or blockchain records. Clearing browser storage
          removes them.
        </section>
      </div>
    </main>
  );
}
