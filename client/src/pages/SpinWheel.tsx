import {
  AlertTriangle,
  BadgeCheck,
  CircleDollarSign,
  Dice5,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Lawful game and promotion governance",
    icon: Dice5,
    detail:
      "Jurisdiction-specific legal review, eligibility and age controls, official rules, prize terms, promotion registration where required, no-purchase conditions where applicable, prohibited-jurisdiction controls, consumer disclosures, complaint handling, and operational oversight are required before operating or promoting a chance-based reward feature.",
  },
  {
    title: "Verifiable randomness and fair-outcome controls",
    icon: ShieldCheck,
    detail:
      "A documented and independently reviewable randomness approach, server-side outcome generation, tamper resistance, probability definitions, audit logs, abuse prevention, rate limits, idempotency, retry handling, anomaly monitoring, and correction procedures are required before presenting a spin, chance, winner, prize, or reward outcome.",
  },
  {
    title: "Verified wallet, token, and reward fulfillment",
    icon: CircleDollarSign,
    detail:
      "Authorized wallet or custody infrastructure, eligibility validation, chain and network verification, transaction confirmation, secure balance reconciliation, duplicate-award protection, financial and tax review, fraud controls, support handling, and clear risk disclosures are required before granting or representing tokens, currency, XP, boosts, or any other reward.",
  },
  {
    title: "Durable reward records and entitlement controls",
    icon: BadgeCheck,
    detail:
      "Persisted user eligibility, authenticated access, daily-use enforcement, entitlement records, reward definitions, profile updates, revocation and correction paths, privacy protections, retention policies, and observability are required before recording a streak, badge, prize history, account reward, or benefit.",
  },
];

export default function SpinWheel() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Reward service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Daily Spin Wheel
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Daily spins, prize probabilities, outcomes, XP, tokens, wallet
            rewards, badges, boosts, login streaks, reward history, and
            eligibility states are not configured for this deployment. No prize,
            chance, winning outcome, financial or token reward, account benefit,
            or completed spin is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated spins, odds, or reward fulfillment
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate an outcome, calculate a chance,
                record a daily spin, select a prize, grant XP or a badge, credit
                a wallet or token balance, activate a boost, or represent a
                reward as awarded.
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
