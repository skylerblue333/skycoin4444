import {
  AlertTriangle,
  Database,
  Gamepad2,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized game and event operations",
    icon: Gamepad2,
    detail:
      "Verified game implementations, server-authoritative rules, secure sessions, published gameplay terms, eligibility controls, result integrity, participant protections, moderation, support, and incident handling are required before operating games, quests, tournaments, or season passes.",
  },
  {
    title: "Reward, prize, and token accounting",
    icon: WalletCards,
    detail:
      "Validated wallet or payment infrastructure, approved reward rules, transaction verification, balance reconciliation, anti-duplication controls, payout and failure handling, refund processes where applicable, tax and jurisdiction review, and clear disclosures are required before representing tokens, prizes, jackpots, rewards, or earnings.",
  },
  {
    title: "Trusted participation and leaderboard records",
    icon: Database,
    detail:
      "Authenticated player accounts, durable event records, anti-cheat controls, transparent scoring, server-side ranking calculations, privacy protections, correction procedures, and audit trails are required before displaying a player count, quest, tournament, XP, rank, standing, or season progress.",
  },
  {
    title: "Safety and responsible-play safeguards",
    icon: ShieldCheck,
    detail:
      "Age and jurisdiction restrictions where relevant, responsible-play controls, content ratings, anti-fraud safeguards, abuse reporting, rate limits, policy enforcement, customer support, and an escalation process are required before exposing competitive, chance-based, token-linked, or reward-linked game mechanics.",
  },
];

export default function Gaming() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Gaming service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Gaming Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Games, arcade sessions, chance-based mechanics, tournaments, quests,
            season passes, player counts, leaderboards, XP, token rewards,
            prizes, jackpots, staking-to-play, balances, and game-linked
            earnings are not configured for this deployment. No game,
            participant, event, reward, token, prize, score, or rank is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated gameplay, chance outcomes, token rewards, or prize
                claims
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not begin a game, accept a wager or entry fee,
                award a token, calculate a score, update a leaderboard, record a
                quest, issue a prize, create a tournament, or represent a gaming
                reward as earned.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {serviceRequirements.map(requirement => {
            const Icon = requirement.icon;
            return (
              <Card
                key={requirement.title}
                className="border-slate-700 bg-slate-900"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-base text-white">
                    <span className="rounded-lg bg-slate-800 p-2 text-sky-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    {requirement.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-slate-300">
                    {requirement.detail}
                  </p>
                  <p className="mt-4 text-xs font-medium text-slate-400">
                    Status: not configured
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </main>
  );
}
