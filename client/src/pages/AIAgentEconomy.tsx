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
    title: "Governed autonomous-agent operations",
    icon: Activity,
    detail:
      "A documented agent purpose and capability scope, explicit user authorization, authenticated ownership, least-privilege permissions, tool allowlists, input and output validation, execution logs, rate limits, human oversight, interruption controls, safe failure handling, and incident response are required before creating, deploying, assigning, or reporting activity for an autonomous agent.",
  },
  {
    title: "Verified task, goal, and marketplace records",
    icon: Database,
    detail:
      "Durable user-owned records, authorization-aware access, clear task definitions, validation of completion evidence, audit trails, privacy controls, correction and deletion workflows, service-level boundaries, and reliable state reconciliation are required before showing a goal, task queue, agent status, completed action, level, efficiency, workload, marketplace listing, or operational metric.",
  },
  {
    title: "Financial, trading, and reward safeguards",
    icon: ShieldCheck,
    detail:
      "Authorized custody or wallet infrastructure, verified accounts and networks, transaction validation and signature controls, duplicate-submission prevention, balance and supply reconciliation, accounting, fraud controls, risk disclosures, settlement monitoring, and independent auditability are required before representing trading, earnings, token rewards, wallet activity, balances, payouts, financial performance, or any financial result.",
  },
  {
    title: "AI, governance, and compliance assurance",
    icon: Scale,
    detail:
      "Appropriate legal and policy review, documented model limitations, privacy and safety assessment, user notices, role-based authorization, governance controls, monitoring, transparency, dispute handling, and human decision authority are required before an AI system recommends or undertakes trading, governance, creator, development, research, or other consequential activity on behalf of a user.",
  },
];

export default function AIAgentEconomy() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Autonomous agent service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Agent Economy
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Autonomous agent deployment, agent marketplaces, research, trading,
            creator, governance, and developer agents, task execution, goal
            tracking, activity logs, agent status, levels, workload,
            performance, efficiency, earnings, rewards, token balances,
            financial outcomes, and actions undertaken on a user’s behalf are
            not configured for this deployment. No agent, task, result, record,
            transaction, balance, recommendation, or economic outcome is
            represented as active, verified, authorized, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated agent, execution, trading, governance, reward, or
                financial result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create or deploy an agent, access user goals,
                run a task, call an external service, make a trading or
                governance decision, perform work on a user’s behalf, issue an
                instruction, collect a reward, move a token, calculate earnings,
                inspect a wallet, or report that an autonomous action succeeded.
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
