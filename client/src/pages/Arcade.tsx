import {
  Activity,
  AlertTriangle,
  Database,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized game and player-state operations",
    icon: Database,
    detail:
      "Authenticated player records, authoritative game-server state, server-side validation, anti-cheat controls, session integrity, durable scoring, match and quest definitions, eligibility rules, idempotent actions, audit logging, and recovery procedures are required before showing or changing a game, player progress, score, match result, quest, tournament, rank, mission, or leaderboard-like state.",
  },
  {
    title: "Verified reward, prize, and token settlement",
    icon: ShieldCheck,
    detail:
      "Authorized issuer controls, secure inventory or token custody, reward policy, transaction validation, duplicate-prevention, balance and supply reconciliation, confirmation handling, fraud controls, failure recovery, accurate disclosures, and independent auditability are required before listing a prize pool, awarding experience, issuing a token, claiming a reward, paying a player, or reporting a financial or game reward outcome.",
  },
  {
    title: "Licensed wagering and consumer-protection controls",
    icon: Scale,
    detail:
      "Appropriate jurisdictional authorization, age and identity verification where required, geofencing, responsible-play safeguards, approved game logic and randomness controls, payment and custody compliance, anti-money-laundering controls, loss and risk disclosures, limits, dispute handling, and audited settlement are required before offering, promoting, or enabling wagering, casino games, bets, odds, deposits, withdrawals, or token-based gambling.",
  },
  {
    title: "Accurate activity and operational transparency",
    icon: Activity,
    detail:
      "Source-attributed data, documented metric definitions, quality monitoring, privacy safeguards, moderation, rate limits, observability, incident response, and clear availability status are required before presenting active players, competitions, participation, availability, rewards, quests, game activity, or other operational claims.",
  },
];

export default function Arcade() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Arcade and wagering
            services unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Arcade
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Games, player-versus-player modes, tournaments, quests, player
            rankings, game results, prizes, experience, token rewards, casino
            games, token wagering, bets, prize pools, leaderboards, financial
            outcomes, and reward settlement are not configured for this
            deployment. No game, competition, player, score, prize, token,
            wager, payment, or result is represented as active, playable,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated play, contest, wager, reward, token, or financial
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not start a game, create a match, calculate a
                score, register tournament entry, identify a player, update a
                quest, place a wager, take a payment, award a prize, issue a
                token, generate a game result, or report that any gaming or
                financial action succeeded.
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
