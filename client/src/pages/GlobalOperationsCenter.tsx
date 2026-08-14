import {
  AlertTriangle,
  Database,
  Globe2,
  ShieldCheck,
  UserCog,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified operational data and observability",
    icon: Database,
    detail:
      "Documented data sources, authenticated collection, metric definitions, data-quality controls, privacy review, access controls, retention rules, service monitoring, and auditability are required before showing global activity, user counts, regional heatmaps, transaction metrics, or operational intelligence.",
  },
  {
    title: "Region, compliance, and service-availability governance",
    icon: Globe2,
    detail:
      "Jurisdiction-specific legal review, official service eligibility, continuously maintained policy records, change control, disclosures, and accountable owners are required before asserting that a financial, crypto, wallet, mining, staking, marketplace, or AI feature is available in a region.",
  },
  {
    title: "Role and ambassador-management controls",
    icon: UserCog,
    detail:
      "A documented program, eligibility criteria, consent and identity verification where appropriate, scoped permissions, appointment records, revocation procedures, public disclosures, and support processes are required before presenting a participant as an ambassador or program leader.",
  },
  {
    title: "AI, token, and high-impact operational safeguards",
    icon: ShieldCheck,
    detail:
      "Authorized integrations, policy controls, human review, secure administrative endpoints, financial and token verification, abuse prevention, incident response, and durable audit records are required before operating an AI growth engine, token registry, or global operations control surface.",
  },
];

export default function GlobalOperationsCenter() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Global operations service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Global Operations Center
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Token registries, regional compliance matrices, service
            availability, ambassador records, activity heatmaps, AI growth
            analysis, global metrics, transactions, command controls, and
            operational status are not configured for this deployment. No token,
            region, role, activity measure, analysis, participant, or
            operational state is represented as current, verified, or
            authorized.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated global operations, compliance, or AI intelligence
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not register a token, certify a regional service,
                display user activity, publish an ambassador appointment,
                generate an AI growth analysis, create an operational metric, or
                provide an administrative command surface.
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
