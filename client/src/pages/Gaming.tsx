import { Link } from "wouter";
import {
  Coins,
  Crown,
  Gamepad2,
  Play,
  Shield,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ExperienceShell, SurfaceCard } from "@/components/ecosystem/ExperienceShell";

const GAMES = [
  { name: "Sky Blackjack", detail: "Table strategy", icon: Crown, href: "/game-blackjack", gradient: "from-emerald-600 to-teal-800" },
  { name: "Fortune Slots", detail: "Reel game", icon: Star, href: "/game-slots", gradient: "from-amber-500 to-orange-700" },
  { name: "Sky Crash", detail: "Multiplier arcade", icon: TrendingUp, href: "/game-crash", gradient: "from-fuchsia-600 to-violet-800" },
  { name: "Block Builder", detail: "Strategy", icon: Shield, href: "/game-block-builder", gradient: "from-sky-600 to-indigo-800" },
  { name: "Crypto Quiz", detail: "Knowledge", icon: Zap, href: "/game-crypto-quiz", gradient: "from-cyan-500 to-blue-700" },
  { name: "Token Tap", detail: "Arcade", icon: Coins, href: "/game-token-tap", gradient: "from-pink-600 to-rose-800" },
] as const;

export default function Gaming() {
  const tournamentsQuery = trpc.gamefi.tournaments.useQuery();
  const questsQuery = trpc.gamefi.quests.useQuery();
  const leaderboardQuery = trpc.gamefi.leaderboard.useQuery({ type: "global", limit: 5 });
  const platformStatsQuery = trpc.platform.stats.useQuery();

  const tournaments = (tournamentsQuery.data ?? []) as any[];
  const quests = (questsQuery.data ?? []) as any[];
  const leaderboard = (leaderboardQuery.data ?? []) as any[];
  const platformStats = platformStatsQuery.data as any;

  return (
    <ExperienceShell
      title="Games Center"
      subtitle="Play, compete, complete quests, and explore SKYCOIN4444 game experiences."
      icon={Gamepad2}
      accent="violet"
      badge="Engineering beta"
      actions={
        <Link href="/tournaments">
          <Button className="rounded-xl bg-violet-600 shadow-md shadow-violet-200 hover:bg-violet-700"><Trophy className="mr-2 h-4 w-4" /> Tournaments</Button>
        </Link>
      }
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Platform users", value: platformStats?.totalUsers ?? "—", icon: Users, note: "Backend reported" },
            { label: "Tournaments", value: tournamentsQuery.isLoading ? "…" : tournaments.length, icon: Trophy, note: "Available records" },
            { label: "Active quests", value: questsQuery.isLoading ? "…" : quests.length, icon: Target, note: "Available records" },
            { label: "Game experiences", value: GAMES.length, icon: Gamepad2, note: "Linked modules" },
          ].map(({ label, value, icon: Icon, note }) => (
            <SurfaceCard key={label} className="p-5">
              <div className="flex items-start justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-700"><Icon className="h-5 w-5" /></span><Sparkles className="h-4 w-4 text-slate-300" /></div>
              <div className="mt-4 text-2xl font-black tracking-tight text-slate-950">{typeof value === "number" ? value.toLocaleString() : value}</div>
              <div className="mt-1 text-sm font-semibold text-slate-700">{label}</div>
              <div className="mt-1 text-xs text-slate-400">{note}</div>
            </SurfaceCard>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <SurfaceCard className="p-5 md:p-6">
            <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-lg font-bold">Featured games</h2><p className="mt-1 text-sm text-slate-500">Existing game routes presented in a consistent, responsive card system.</p></div><Link href="/game-lobby" className="text-sm font-semibold text-violet-700 hover:text-violet-900">Open game lobby →</Link></div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.map(({ name, detail, icon: Icon, href, gradient }) => (
                <Link key={name} href={href} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className={`relative aspect-[16/10] bg-gradient-to-br ${gradient} p-4 text-white`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,.28),transparent_35%)]" />
                    <div className="relative flex h-full flex-col justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur"><Icon className="h-5 w-5" /></span><div><div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">{detail}</div><h3 className="mt-1 text-xl font-black">{name}</h3></div></div>
                  </div>
                  <div className="flex items-center justify-between p-3 text-sm"><span className="font-semibold text-slate-700">Open game</span><Play className="h-4 w-4 text-violet-600 transition-transform group-hover:translate-x-0.5" /></div>
                </Link>
              ))}
            </div>
          </SurfaceCard>

          <div className="space-y-5">
            <SurfaceCard className="p-5">
              <div className="flex items-center justify-between"><div><h2 className="font-bold">Leaderboard</h2><p className="mt-1 text-xs text-slate-400">Backend records</p></div><Crown className="h-5 w-5 text-amber-500" /></div>
              <div className="mt-4 space-y-2">
                {leaderboardQuery.isLoading ? <p className="py-5 text-center text-sm text-slate-400">Loading leaderboard…</p> : leaderboard.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500">No leaderboard records available.</p> : leaderboard.map((entry: any, index: number) => (
                  <div key={entry.id ?? entry.userId ?? index} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5"><span className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-black ${index === 0 ? "bg-amber-100 text-amber-700" : "bg-white text-slate-500"}`}>{index + 1}</span><div className="min-w-0 flex-1"><div className="truncate text-sm font-semibold text-slate-700">{entry.username ?? entry.name ?? `Player ${index + 1}`}</div><div className="text-xs text-slate-400">{entry.score ?? entry.xp ?? entry.points ?? 0} points</div></div></div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-900 p-5 text-white">
              <Trophy className="h-8 w-8 text-amber-300" /><h2 className="mt-4 text-xl font-black">Tournament hub</h2><p className="mt-2 text-sm leading-6 text-violet-100">Competition records come from the existing GameFi service. Empty states remain honest when no tournaments are available.</p><Link href="/tournaments"><Button className="mt-5 w-full rounded-xl bg-white text-violet-800 hover:bg-violet-50">View tournaments</Button></Link>
            </SurfaceCard>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2"><Target className="h-5 w-5 text-emerald-600" /><h2 className="font-bold">Active quests</h2></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {questsQuery.isLoading ? <p className="text-sm text-slate-400">Loading quests…</p> : quests.length === 0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 sm:col-span-2">No quest records are currently available.</p> : quests.slice(0, 4).map((quest: any, index: number) => <div key={quest.id ?? index} className="rounded-xl border border-slate-200 p-4"><div className="text-sm font-bold text-slate-800">{quest.name ?? `Quest ${index + 1}`}</div><div className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{quest.description ?? quest.type ?? "Quest details"}</div><div className="mt-3 text-xs font-semibold text-emerald-700">{quest.rewardXp ? `+${quest.rewardXp} XP` : "Reward details unavailable"}</div></div>)}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5 md:p-6">
            <div className="flex items-center gap-2"><Shield className="h-5 w-5 text-violet-600" /><h2 className="font-bold">Play responsibly</h2></div><p className="mt-3 text-sm leading-6 text-slate-600">Game availability, rewards and tournament state should be backed by the platform services. This hub does not invent balances, prize pools or active-player counts when the backend does not provide them.</p><div className="mt-4 rounded-xl bg-violet-50 p-3 text-xs leading-5 text-violet-800">Linked game modules can continue evolving independently while sharing this common navigation and presentation language.</div>
          </SurfaceCard>
        </div>
      </div>
    </ExperienceShell>
  );
}
