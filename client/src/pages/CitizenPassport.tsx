import {
  AlertTriangle,
  BadgeCheck,
  Database,
  Landmark,
  Scale,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified identity and credential governance",
    icon: BadgeCheck,
    detail:
      "A lawful identity-verification program, user consent, issuer and verifier controls, credential lifecycle management, privacy and data-minimization safeguards, revocation, correction, security monitoring, audit trails, and jurisdictional review are required before issuing or displaying a passport, citizen identity, verification signal, membership tier, credential, or personal identifier.",
  },
  {
    title: "Reliable reputation and eligibility records",
    icon: Database,
    detail:
      "Documented scoring methodology, authenticated source events, anti-gaming controls, transparency on inputs and limitations, privacy review, fairness assessment, human review, appeal and correction procedures, retention policies, and data-quality checks are required before calculating or displaying a trust score, learning score, reputation dimension, archetype, progression tier, achievement, or entitlement threshold.",
  },
  {
    title: "Authorized governance and participation controls",
    icon: Scale,
    detail:
      "Clearly defined governance rules, participant eligibility, secure authentication, proposal and ballot integrity, authorization, quorum requirements, transparent results, audit logs, dispute and appeal processes, and legal review are required before granting or representing voting rights, proposal rights, councils, citizen participation, governance privileges, or institutional authority.",
  },
  {
    title: "Secure token, financial, and platform entitlements",
    icon: Landmark,
    detail:
      "Verified financial and blockchain infrastructure, custody safeguards, eligibility controls, settlement confirmation, transaction reconciliation, consumer disclosures, privacy controls, access enforcement, and auditability are required before presenting or granting staking rewards, token benefits, premium AI access, startup rights, financial privileges, or other value-bearing entitlements.",
  },
];

export default function CitizenPassport() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Citizen credential service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Citizen Passport
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Digital citizenship, identity verification, passports, membership
            credentials, personal archetypes, trust and reputation scores,
            progression tiers, achievements, citizen rights, governance
            eligibility, voting, proposals, councils, premium access, staking,
            token benefits, startup rights, and other entitlements are not
            configured for this deployment. No identity, credential, score,
            privilege, financial benefit, or governance state is represented as
            current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated identity, reputation, governance, or entitlement
                state
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not verify identity, issue a credential,
                calculate reputation, classify a citizen, grant access, create a
                vote or proposal, award a financial benefit, enable staking, or
                establish a governance, membership, or legal status.
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
