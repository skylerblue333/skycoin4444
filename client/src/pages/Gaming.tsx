import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Crown,
  Gamepad2,
  LockKeyhole,
  Play,
  Shield,
  Sparkles,
  Target,
  TimerReset,
  Trophy,
  Zap,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
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
import { Progress } from "@/components/ui/progress";

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
      "Three-lane reflex runner with escalating speed, combo chains, shields, saved runs, and no-value Sparks.",
    icon: Zap,
    href: "/game-sky-rush",
    category: "arcade" as const,
    duration: "3–6 min",
    gradient: "from-violet-600 via-fuchsia-600 to-sky-600",
    tag: "SAVE RUNS",
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
    gradient: "from-sky-600 via-blue-700 to-indigo-800",
    tag: "13 MODES",
  },
  {
    id: "crypto-quiz",
    name: "Crypto Quiz Blitz",
    detail:
      "Timed blockchain recall with Study XP, streaks, saved runs, and no token payout.",
    icon: Brain,
    href: "/game-crypto-quiz",
    category: "knowledge" as const,
    duration: "~4 min",
    gradient: "from-cyan-600 via-blue-700 to-violet-700",
    tag: "LEARN + PLAY",
  },
  {
    id: "spark-tap",
    name: "Spark Tap",
    detail:
      "Thirty-second speed/combo challenge with saved personal runs and game-only Sparks.",
    icon: Sparkles,
    href: "/game-token-tap",
    category: "arcade" as const,
    duration: "30 sec",
    gradient: "from-emerald-600 via-teal-700 to-cyan-800",
    tag: "COMBO",
  },
  {
    id: "block-builder",
    name: "Block Builder",
    detail:
      "Stacking and timing challenge with saveable account runs and game-only progress.",
    icon: Target,
    href: "/game-block-builder",
    category: "strategy" as const,
    duration: "Short run",
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

function localDailyPickIndex() {
  const now = new Date();
  const day =
    Math.floor(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) /
        86_400_000
    ) || 0;
  return Math.abs(day) % 5;
}

function gameHref(gameId: string) {
  return games.find(game => game.id === gameId)?.href ?? "/gaming";
}

export default function Gaming() {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<GameCategory>("all");
  const gaming = trpc.betaGaming.dashboard.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
  });

  const visibleGames = useMemo(
    () =>
      filter === "all"
        ? games
        : games.filter(game => game.category === filter),
    [filter]
  );

  const summary = gaming.data?.summary;
  const fallbackDailyGame = games[localDailyPickIndex()];
  const dailyGame =
    games.find(
      game => game.id === summary?.dailyChallenge.gameId
    ) ?? fallbackDailyGame;

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
                Play. Save a run. Beat yourself.
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-white/65">
                Replayable games now connect to an opt-in, account-owned gaming
                record. Save selected runs to build personal bests,
                achievements, and daily challenge progress without pretending a
                token economy or global competition service exists.
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
                  Daily challenge
                </CardDescription>
                <CardTitle className="text-2xl text-white">
                  {summary?.dailyChallenge.gameLabel ?? dailyGame.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-white/55">
                  {isAuthenticated
                    ? summary?.dailyChallenge.requirement ??
                      "Load your account challenge."
                    : "Sign in, play today's game, and explicitly save one non-zero run to complete the challenge."}
                </p>
                {summary?.dailyChallenge.completed ? (
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-200">
                    <CheckCircle2 className="h-4 w-4" />
                    Completed today
                  </div>
                ) : null}
                <Link href={dailyGame.href}>
                  <Button className="mt-4 w-full">
                    Play today's game
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Playable routes",
              value: games.length,
              icon: Gamepad2,
            },
            {
              label: "Saved runs",
              value: isAuthenticated
                ? gaming.isLoading
                  ? "…"
                  : summary?.totalRuns ?? 0
                : "Sign in",
              icon: Trophy,
            },
            {
              label: "Personal best",
              value: isAuthenticated
                ? gaming.isLoading
                  ? "…"
                  : (summary?.bestScore ?? 0).toLocaleString()
                : "Local only",
              icon: Crown,
            },
            {
              label: "Achievements",
              value: isAuthenticated
                ? gaming.isLoading
                  ? "…"
                  : `${summary?.unlockedAchievements ?? 0}/5`
                : "Sign in",
              icon: Target,
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

        {!isAuthenticated ? (
          <Card className="border-amber-300/20 bg-amber-300/[0.04] text-white">
            <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-amber-200" />
                <div>
                  <p className="font-semibold text-amber-100">
                    Playing stays local until you choose to save
                  </p>
                  <p className="mt-1 text-sm leading-6 text-white/45">
                    Anonymous play does not write game records. Sign in, finish a
                    supported game, then choose Save run if you want it in your
                    account history.
                  </p>
                </div>
              </div>
              <Link href="/signin">
                <Button className="shrink-0">
                  Open invitation sign in
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : gaming.error ? (
          <div
            className="rounded-2xl border border-rose-300/20 bg-rose-300/[0.05] p-4 text-sm text-rose-100"
            role="alert"
          >
            Saved gaming progress is temporarily unavailable. Local game play
            still works; do not assume a run was saved unless its Save run
            control confirms success.
          </div>
        ) : null}

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

        {isAuthenticated ? (
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5 text-amber-200" />
                  Personal achievements
                </CardTitle>
                <CardDescription className="text-white/45">
                  Derived only from up to the latest{" "}
                  {gaming.data?.historyLimit ?? 500} explicitly saved runs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {gaming.isLoading ? (
                  <p className="text-sm text-white/35">
                    Loading saved progress…
                  </p>
                ) : (
                  summary?.achievements.map(item => (
                    <div
                      key={item.id}
                      className={
                        "rounded-2xl border p-4 " +
                        (item.unlocked
                          ? "border-emerald-300/20 bg-emerald-300/[0.04]"
                          : "border-white/[0.08] bg-black/20")
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            "grid h-9 w-9 shrink-0 place-items-center rounded-xl " +
                            (item.unlocked
                              ? "bg-emerald-300/10 text-emerald-200"
                              : "bg-white/[0.05] text-white/25")
                          }
                        >
                          {item.unlocked ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-semibold">{item.title}</p>
                            <span className="text-xs text-white/30">
                              {item.progress}/{item.target}
                            </span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-white/35">
                            {item.detail}
                          </p>
                          <Progress
                            value={(item.progress / item.target) * 100}
                            className="mt-3 h-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03] text-white">
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Sparkles className="h-5 w-5 text-cyan-200" />
                      Recent saved runs
                    </CardTitle>
                    <CardDescription className="mt-1 text-white/45">
                      Account-owned game records. Saving is explicit.
                    </CardDescription>
                  </div>
                  <Link
                    href="/activity-evidence"
                    className="text-xs font-semibold text-sky-200"
                  >
                    Activity Evidence
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {gaming.isLoading ? (
                  <p className="text-sm text-white/35">
                    Loading saved runs…
                  </p>
                ) : !gaming.data?.recent.length ? (
                  <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
                    <Gamepad2 className="mx-auto h-6 w-6 text-white/20" />
                    <p className="mt-3 text-sm text-white/45">
                      No saved runs yet.
                    </p>
                    <p className="mt-1 text-xs text-white/30">
                      Finish Sky Rush, Spark Tap, Crypto Quiz, or Block Builder
                      and choose Save run.
                    </p>
                  </div>
                ) : (
                  gaming.data.recent.map(run => (
                    <div
                      key={run.id}
                      className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-black/20 p-4"
                    >
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-300/10 text-violet-100">
                        <Gamepad2 className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">
                          {games.find(game => game.id === run.gameId)?.name ??
                            run.gameId}
                        </p>
                        <p className="mt-0.5 text-xs text-white/35">
                          {run.score.toLocaleString()} points · {run.sparks}{" "}
                          Sparks · {run.combo}x combo
                        </p>
                      </div>
                      <time className="hidden text-xs text-white/25 sm:block">
                        {new Date(run.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </section>
        ) : null}

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
            <h2 className="mt-3 font-bold">Competition boundary</h2>
            <p className="mt-2 text-sm leading-6 text-white/40">
              Global tournaments, cross-user rankings, prize settlement, and
              GameFi economy services are not activated in this beta. Personal
              saved runs are not a public leaderboard.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
