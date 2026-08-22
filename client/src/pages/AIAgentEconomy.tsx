import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AGENT_TYPES = [
  { id: "research", name: "Research Agent" },
  { id: "trading", name: "Trading Agent" },
  { id: "creator", name: "Creator Agent" },
  { id: "governance", name: "Governance Agent" },
  { id: "developer", name: "Developer Agent" },
] as const;

export default function AIAgentEconomy() {
  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">Agent Economy</h1>
            <Badge variant="outline" className="border-amber-400/50 text-amber-200">
              Unavailable
            </Badge>
          </div>
          <p className="text-gray-400">
            This workspace is reserved for verified agent orchestration and task accounting.
          </p>
        </header>

        <Card className="border-amber-400/30 bg-amber-400/[0.06] p-6">
          <h2 className="text-xl font-semibold text-amber-100">Truth Mode</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-300">
            Agent deployment, task execution, earnings, rewards, and efficiency metrics are not
            available because this repository does not currently have a verified agent runtime,
            accounting ledger, or authenticated data source. No simulated agents or financial
            results are displayed.
          </p>
        </Card>

        <section aria-labelledby="planned-agent-types" className="space-y-3">
          <h2 id="planned-agent-types" className="text-lg font-semibold text-gray-200">
            Planned agent types
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {AGENT_TYPES.map((agent) => (
              <Card key={agent.id} className="border-gray-800 bg-gray-900/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-gray-200">{agent.name}</span>
                  <Badge variant="secondary">Not configured</Badge>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
