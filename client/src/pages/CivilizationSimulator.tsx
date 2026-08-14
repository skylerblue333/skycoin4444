import {
  AlertTriangle,
  Database,
  Landmark,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Documented simulation model and evidence base",
    icon: Database,
    detail:
      "A defined and reviewable model, stated inputs and assumptions, validated source data, repeatable calculations, uncertainty and limitation disclosures, version control, results provenance, independent review, and appropriate safeguards are required before representing a civilization score, era, population, territory, historical state, forecast, or other simulation result.",
  },
  {
    title: "Verified governance and participation records",
    icon: Scale,
    detail:
      "Authenticated participants, explicit governance rules, eligibility and quorum definitions, durable proposal and vote records, authorization, ballot integrity, privacy safeguards, audit trails, appeal processes, legal review, and transparent result publication are required before claiming a proposal, vote, law, council, ministry, citizen status, governance health, or AI-governed institution.",
  },
  {
    title: "Authorized economic, treasury, and token infrastructure",
    icon: Landmark,
    detail:
      "Verified accounting records, custody and wallet safeguards, authenticated blockchain integrations, contract and network validation, transaction confirmation, reconciliation, supply and allocation methodology, consumer disclosures, financial controls, and independent verification are required before reporting tokens, mints, circulation, revenue, GDP, treasury state, active markets, funding, jobs, or economic health.",
  },
  {
    title: "Responsible AI and platform-safety governance",
    icon: ShieldCheck,
    detail:
      "Documented AI capabilities, human oversight, scoped authority, consent, access controls, safety evaluations, monitoring, incident response, accountability, privacy review, security testing, and clear limitations are required before representing autonomous agents, a digital twin, agent economies, AI decisions, AI governance, self-sustaining operations, or durable institutional outcomes.",
  },
];

export default function CivilizationSimulator() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Civilization service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Civilization Simulator
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Digital-nation stages, civilization scores, citizens, territories,
            AI actions, digital twins, autonomous agents, token mints and
            circulation, treasury health, revenue, markets, governance,
            proposals, votes, laws, ministries, startup funding, jobs, and
            future institutional outcomes are not configured for this
            deployment. No simulation, forecast, governance state, economic
            metric, AI capability, or civic claim is represented as current,
            verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated civic, economic, governance, or AI outcome
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not calculate a civilization metric, create a
                citizen or territory record, mint or track tokens, operate a
                treasury, conduct a vote, establish a law or institution, deploy
                an autonomous agent, or predict an economic or social outcome.
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
