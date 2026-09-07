import { useMemo } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Gamepad2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import {
  arcadeGameIds,
  arcadePassportBadges,
  arcadePassportLevel,
  type ArcadeGameId,
  type ArcadePassport,
} from "@/lib/arcadePassport";
import { useArcadePassportSync } from "@/hooks/useArcadePassportSync";
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

const gameMeta: Record<
  ArcadeGameId,
  { label: string; href: string; icon: typeof Gamepad2 }
> = {
  "sky-rush": { label: "Sky Rush", href: "/game-sky-rush", icon: Zap },
  "crypto-quiz": {
    label: "Crypto Quiz Blitz",
    href: "/game-crypto-quiz",
    icon: BookOpen,
  },
  "spark-tap": {
    label: "Spark Tap",
    href: "/game-token-tap",
    icon: Sparkles,
  },
  "block-builder": {
    label: "Block Builder",
    href: "/game-block-builder",
    icon: Target,
  },
  "arcade-lab": { label: "Arcade Lab", href: "/arcade", icon: Gamepad2 },
  "blackjack-lab": {
    label: "Blackjack Lab",
    href: "/game-blackjack",
    icon: Target,
  },
  "crash-lab": {
    label: "Multiplier Reflex Lab",
    href: "/game-crash",
    icon: Zap,
  },
  "pattern-lab": {
    label: "Pattern Match Lab",
    href: "/game-slots",
    icon: Star,
  },
};

type Quest = Readonly<{
  id: string;
  title: string;
  detail: string;
  current: number;
  target: number;
  complete: boolean;
  href: string;
}>;

function quests(passport: ArcadePassport): Quest[] {
  const uniqueGames = arcadeGameIds.filter(
    gameId => passport.games[gameId].plays > 0
  ).length;

  return [
    {
      id: "first-run",
      title: "Finish a run",
      detail: "Complete any Arcade Passport game session.",
      current: Math.min(1, passport.totalPlays),
      target: 1,
      complete: passport.totalPlays >= 1,
      href: "/gaming",
    },
    {
      id: "daily",
      title: "Clear today's daily game",
      detail:
        "Finish today's deterministic pick: " +
        gameMeta[passport.daily.gameId].label +
        ".",
      current: passport.daily.completed ? 1 : 0,
      target: 1,
      complete: passport.daily.completed,
      href: gameMeta[passport.daily.gameId].href,
    },
    {
      id: "sampler",
      title: "Try three different modes",
      detail: "Finish runs in three different Arcade Passport game modes.",
      current: Math.min(3, uniqueGames),
      target: 3,
      complete: uniqueGames >= 3,
      href: "/gaming",
    },
    {
      id: "rush",
      title: "Build a Sky Rush score",
      detail: "Reach 1,000 points in a recorded Sky Rush run.",
      current: Math.min(1000, passport.games["sky-rush"].bestScore),
      target: 1000,
      complete: passport.games["sky-rush"].bestScore >= 1000,
      href: "/game-sky-rush",
    },
    {
      id: "study",
      title: "Score 7/10 in Crypto Quiz",
      detail: "Reach a recorded quiz score of at least 700.",
      current: Math.min(700, passport.games["crypto-quiz"].bestScore),
      target: 700,
      complete: passport.games["crypto-quiz"].bestScore >= 700,
      href: "/game-crypto-quiz",
    },
    {
      id: "builder",
      title: "Stack eight blocks",
      detail: "Reach eight recorded blocks in Block Builder.",
      current: Math.min(8, passport.games["block-builder"].bestScore),
      target: 8,
      complete: passport.games["block-builder"].bestScore >= 8,
      href: "/game-block-builder",
    },
  ];
}

export default function GameFiQuestBoard() {
  const {
    passport,
    syncStatus,
    refresh,
  } = useArcadePassportSync();
  const milestoneList = useMemo(() => quests(passport), [passport]);
  const badges = arcadePassportBadges(passport);
  const completeCount = milestoneList.filter(item => item.complete).length;
  const dailyMeta = gameMeta[passport.daily.gameId];

  return (
    <main className="min-h-screen bg-[#050510] text-white">
      <div className="mx-auto max-w-6xl space-y-7 px-4 py-10">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/gaming"
              className="mb-4 inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Games Center
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-violet-500/15 text-violet-100">
                Arcade Passport
              </Badge>
              <Badge
                variant="outline"
                className="border-white/10 text-white/45"
              >
                {syncStatus === "synced"
                  ? "Account + device progression"
                  : syncStatus === "syncing"
                    ? "Syncing account progression"
                    : "Device-local progression"}
              </Badge>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
              Quest Board
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
              Real milestones derived from game runs recorded on this browser.
              No wallet, payout, staking, token reward, prize pool, or blockchain
              execution is attached to these quests.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => void refresh()}
            className="border-white/15 bg-white/[0.03] text-white"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh passport
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Passport level",
              value: arcadePassportLevel(passport),
              icon: Trophy,
            },
            {
              label: "Recorded runs",
              value: passport.totalPlays,
              icon: Gamepad2,
            },
            { label: "Study XP", value: passport.totalXp, icon: BookOpen },
            { label: "Game Sparks", value: passport.totalSparks, icon: Sparkles },
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

        <Card className="overflow-hidden border-cyan-300/20 bg-gradient-to-br from-cyan-300/[0.06] via-white/[0.025] to-violet-300/[0.06] text-white">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardDescription className="text-cyan-100/55">
                  Today's deterministic challenge
                </CardDescription>
                <CardTitle className="mt-1 text-2xl text-white">
                  {dailyMeta.label}
                </CardTitle>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
                  Complete one run today to mark the daily challenge on this
                  browser. There is no streak penalty, monetary reward, or
                  notification pressure if you skip it.
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  passport.daily.completed
                    ? "border-emerald-300/25 text-emerald-100"
                    : "border-cyan-300/25 text-cyan-100"
                }
              >
                {passport.daily.completed ? "Cleared" : "Open"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Link href={dailyMeta.href}>
              <Button>
                {passport.daily.completed ? "Play another run" : "Start daily game"}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-5 w-5 text-emerald-200" />
                Milestones
              </CardTitle>
              <CardDescription className="text-white/45">
                {completeCount}/{milestoneList.length} currently complete on this
                device.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {milestoneList.map(quest => {
                const progress = Math.round(
                  (quest.current / Math.max(quest.target, 1)) * 100
                );
                return (
                  <Link
                    key={quest.id}
                    href={quest.href}
                    className="block rounded-2xl border border-white/[0.08] bg-black/20 p-4 transition hover:border-violet-300/25"
                  >
                    <div className="flex items-start gap-3">
                      {quest.complete ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-200" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-white/20" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h2 className="font-semibold">{quest.title}</h2>
                          <span className="text-xs text-white/30">
                            {quest.current}/{quest.target}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-white/40">
                          {quest.detail}
                        </p>
                        <Progress value={progress} className="mt-3 h-1.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.03] text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Star className="h-5 w-5 text-amber-200" />
                Passport badges
              </CardTitle>
              <CardDescription className="text-white/45">
                Device-local progress markers only.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={
                    "rounded-2xl border p-4 " +
                    (badge.unlocked
                      ? "border-amber-300/20 bg-amber-300/[0.04]"
                      : "border-white/[0.08] bg-black/20")
                  }
                >
                  <div className="flex items-center gap-2">
                    {badge.unlocked ? (
                      <CheckCircle2 className="h-4 w-4 text-amber-200" />
                    ) : (
                      <Circle className="h-4 w-4 text-white/20" />
                    )}
                    <p className="font-semibold">{badge.label}</p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-white/35">
                    {badge.detail}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 text-xs leading-6 text-white/35">
          <ShieldCheck className="mr-2 inline h-4 w-4 text-emerald-200" />
          Anonymous Arcade Passport data lives only in this browser. Signed-in
          game summaries may also sync to the authenticated account so progress
          can rehydrate across devices. Neither form is a blockchain record,
          credential, wallet balance, transferable asset, prize, anti-cheat
          ranking, or public leaderboard.
        </section>
      </div>
    </main>
  );
}
