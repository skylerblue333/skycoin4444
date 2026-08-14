import {
  AlertTriangle,
  BarChart3,
  Database,
  Landmark,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Creator payment and payout infrastructure",
    icon: Landmark,
    detail:
      "An authorized payment provider, creator onboarding, payee verification, payout account controls, taxes and jurisdiction review, transaction reconciliation, refund and dispute handling, payout-failure recovery, and secure financial records are required before collecting or distributing creator funds.",
  },
  {
    title: "Verified subscriptions, tips, gifts, and membership entitlements",
    icon: Database,
    detail:
      "Server-side purchase records, entitlement checks, pricing and fee disclosure, webhook verification, duplicate-prevention controls, cancellation and refund workflows, role controls, and auditing are required before granting subscriber, tip, gift, membership, or premium-content access.",
  },
  {
    title: "Reliable creator analytics and reporting",
    icon: BarChart3,
    detail:
      "Authenticated source data, durable event records, metric definitions, period and currency handling, reconciliation, privacy controls, methodology disclosure, and correction processes are required before displaying revenue, payout status, audience metrics, creator performance, or forecast data.",
  },
  {
    title: "Creator safety, fairness, and policy safeguards",
    icon: ShieldCheck,
    detail:
      "Published creator policies, content and transaction moderation, anti-fraud controls, reporting and appeal processes, customer support, access controls, retention policies, and incident response are required before operating a monetization or affiliate program.",
  },
];

export default function CreatorMonetization() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Creator monetization
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Creator Monetization
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Subscriptions, tips, donations, sponsorships, advertising revenue,
            stream gifts, memberships, affiliate earnings, creator earnings,
            revenue analytics, payout schedules, milestones, AI growth advice,
            premium content, and payment entitlements are not configured for
            this deployment. No payment, earnings balance, payout, membership,
            performance result, or financial claim is represented as current,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated creator earnings, payments, or audience analytics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not accept a payment, create a subscription,
                award a tip or gift, provide a paid entitlement, calculate
                earnings, schedule or complete a payout, generate a performance
                chart, issue an affiliate reward, or provide AI growth guidance.
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
