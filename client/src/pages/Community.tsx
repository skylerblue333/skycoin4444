import {
  AlertTriangle,
  BadgeCheck,
  Database,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized community and membership records",
    icon: UsersRound,
    detail:
      "Persisted community records, authenticated membership, role-based authorization, ownership controls, invitation and removal workflows, private-content boundaries, audit trails, deletion handling, and error recovery are required before listing, creating, joining, or managing a community, member, role, channel, or group.",
  },
  {
    title: "Moderated communication and safety operations",
    icon: ShieldCheck,
    detail:
      "Secure messaging and voice infrastructure, channel authorization, reporting and blocking tools, moderation queues, abuse and spam controls, age-appropriate safeguards, incident escalation, content retention policies, and active trust-and-safety operations are required before offering text, voice, streaming, or community communication.",
  },
  {
    title: "Verified token-gating and financial controls",
    icon: BadgeCheck,
    detail:
      "Authorized wallet or entitlement integrations, verified asset ownership, chain and network validation, access reconciliation, eligibility rules, transaction safeguards, financial and legal review, support handling, and clear risk disclosures are required before representing token-gated access, holdings, trading signals, governance power, revenue sharing, or premium benefits.",
  },
  {
    title: "Accurate community metrics and feature claims",
    icon: Database,
    detail:
      "Source-of-truth data, documented metric definitions, integrity controls, anti-manipulation protections, correction procedures, telemetry, and observability are required before displaying community counts, member counts, activity, roles, channels, feature availability, or any engagement metric.",
  },
];

export default function Community() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Community service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Community
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Communities, groups, memberships, channels, roles, messages, voice
            rooms, live watch parties, token-gated access, trading content,
            governance privileges, subscriptions, premium benefits, external
            community links, and activity metrics are not configured for this
            deployment. No community, member, entitlement, financial state, or
            communication channel is represented as current, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated communities, membership, or token access
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create or join a community, assign a role,
                expose a private channel, send a message, start voice
                communication, validate a wallet or token holding, grant a
                premium benefit, provide a trading signal, or represent any
                community statistic as verified.
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
