import {
  AlertTriangle,
  EyeOff,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Identity and profile privacy controls",
    icon: UserRound,
    detail:
      "A documented identity model, authenticated profile settings, audience-specific authorization, consent records, secure storage, and recovery flows are required before changing or revealing identity information.",
  },
  {
    title: "Anonymization and privacy protections",
    icon: EyeOff,
    detail:
      "A tested anonymization design, metadata protection, threat modeling, logging controls, and clear privacy limitations are required before representing a profile as anonymous or protected from identification.",
  },
  {
    title: "Reputation and behavioral analysis",
    icon: ShieldCheck,
    detail:
      "A defined scoring methodology, valid data sources, consent, bias review, correction rights, and monitoring are required before assigning behavior, trust, toxicity, or reputation assessments.",
  },
  {
    title: "Community rankings and disclosure",
    icon: UsersRound,
    detail:
      "Fair-ranking controls, privacy review, anti-gaming measures, governance, and support processes are required before publishing user comparisons, tiers, or leaderboards.",
  },
];

export default function ShadowIdentity() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Identity-protection
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Shadow Identity
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Identity mode changes, anonymous identifiers, verified reveals,
            privacy guarantees, reputation analysis, behavior scores, tiers, and
            leaderboards are not configured for this deployment. No identity or
            protection state is represented as active or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated privacy, identity, or trust claims
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create anonymous identities, change
                visibility settings, disclose personal information, infer
                behavior, calculate reputation, or rank users. Those functions
                remain unavailable until their privacy and governance controls
                are operational.
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
