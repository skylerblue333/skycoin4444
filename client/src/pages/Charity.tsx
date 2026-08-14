import {
  AlertTriangle,
  BadgeCheck,
  HandHeart,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized charitable organizations and campaign governance",
    icon: HandHeart,
    detail:
      "Verified beneficiary organizations, documented campaign ownership, lawful charitable-purpose review, jurisdictional compliance, participant disclosures, governance controls, campaign approval, beneficiary agreements, public-contact information, and dispute handling are required before listing or creating a charitable campaign.",
  },
  {
    title: "Verified donations, funds flow, and reconciliation",
    icon: ReceiptText,
    detail:
      "A configured and authorized payment or blockchain settlement provider, donor authorization, transaction confirmation, currency and network validation, duplicate-submission protection, custody controls, allocation records, reconciliation, refund handling, fraud prevention, and secure financial audit trails are required before accepting or representing a donation, amount raised, goal, balance, or transfer.",
  },
  {
    title: "Governance, donor privacy, and public recognition controls",
    icon: ShieldCheck,
    detail:
      "Authorized voting contracts or governance records, eligibility validation, proposal controls, recorded outcomes, explicit donor consent, privacy-preserving recognition, anonymization, anti-manipulation safeguards, correction requests, retention rules, and safety review are required before showing a proposal, vote, donor, badge, leaderboard, campaign participation, or giving history.",
  },
  {
    title: "Impact reporting and transparency assurance",
    icon: BadgeCheck,
    detail:
      "Beneficiary-provided evidence, documented methodology, independently verifiable transaction references, source attribution, correction and takedown processes, monitoring, legal review, and clear limitations are required before reporting fund allocation, on-chain verification, fees, disbursement times, partner status, charitable impact, or public financial outcomes.",
  },
];

export default function Charity() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Charity service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Charity Hub
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Charitable campaigns, donations, funding goals, charity governance,
            votes, donor records, reward badges, token-based participation,
            beneficiary partnerships, on-chain transaction verification,
            disbursements, fees, impact analytics, milestones, and transparency
            reports are not configured for this deployment. No charitable,
            financial, governance, donor, beneficiary, or impact claim is
            represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated donations, governance, or impact outcomes
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not accept or transfer a donation, create or
                approve a campaign, retain a donor record, calculate funds
                raised, validate a beneficiary or partner, cast a vote, allocate
                funds, issue a receipt or badge, confirm a chain transaction, or
                represent a charitable outcome as verified.
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
