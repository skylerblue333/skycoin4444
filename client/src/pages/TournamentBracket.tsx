import {
  AlertTriangle,
  Database,
  ShieldCheck,
  Trophy,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified tournament and game administration",
    icon: Trophy,
    detail:
      "Persisted event definitions, published rules, secure enrollment, participant eligibility, match reporting, result verification, dispute resolution, anti-cheat controls, moderator authority, audit trails, and cancellation procedures are required before operating a tournament or bracket.",
  },
  {
    title: "Entry-fee, prize, and reward controls",
    icon: WalletCards,
    detail:
      "Authorized payment or token infrastructure, eligibility checks, transparent fee and prize rules, segregated accounting, transaction verification, payout controls, failure handling, refunds, dispute processes, and legal review are required before accepting an entry fee or representing a prize pool or reward.",
  },
  {
    title: "Reliable participant and standings data",
    icon: Database,
    detail:
      "Authenticated participant records, server-authoritative capacity tracking, verified activity data, bracket generation, result integrity checks, privacy controls, and auditable history are required before displaying a player count, tournament status, match, ranking, or bracket placement.",
  },
  {
    title: "Safety, fairness, and abuse safeguards",
    icon: ShieldCheck,
    detail:
      "Age and jurisdiction review where applicable, published conduct policies, reporting tools, anti-fraud and anti-cheat measures, rate limits, account-security controls, appeal procedures, and incident response are required before operating competitive events.",
  },
];

export default function TournamentBracket() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Tournament service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Tournament Brackets
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Tournaments, brackets, games, match results, participant counts,
            event statuses, entry fees, prize pools, token prizes, rankings,
            enrollment, and reward claims are not configured for this
            deployment. No event, payment, prize, player, standing, or result is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated tournaments, fees, prizes, or results
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create an event, enroll a player, collect an
                entry fee, hold or award a prize, establish a bracket, record a
                result, or represent a token reward as won.
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
