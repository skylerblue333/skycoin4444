import {
  AlertTriangle,
  Database,
  KeyRound,
  ShieldCheck,
  Terminal,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated administrative access",
    icon: KeyRound,
    detail:
      "A dedicated administrative role, least-privilege authorization, session controls, re-authentication for sensitive actions, approved access requests, and complete audit logging are required before exposing a developer console, operational event feed, system information, internal procedure catalog, database metadata, or diagnostic output.",
  },
  {
    title: "Safe and documented API operations",
    icon: Terminal,
    detail:
      "An allowlisted, documented, input-validated, output-sanitized, rate-limited, permission-aware, observable, and versioned administrative API is required before accepting a procedure name or JSON input, invoking a backend operation, displaying a response, or reporting that a query ran successfully.",
  },
  {
    title: "Protected database observability",
    icon: Database,
    detail:
      "A read-only, scoped, audited, privacy-reviewed database observability service with schema governance, query limits, redaction, tenant isolation, and production safeguards is required before disclosing table names, row counts, connection health, schema details, record contents, or any database condition.",
  },
  {
    title: "Verified operational telemetry",
    icon: ShieldCheck,
    detail:
      "A production telemetry pipeline with source attribution, retention policy, access controls, alert management, incident procedures, integrity checks, and documented service-level definitions is required before presenting a live event, system state, deployment version, route count, test result, health assertion, simulation state, or operational metric.",
  },
];

export default function UnhiddenInterface() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Administrative diagnostics
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Unhidden Interface
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            The raw API console, event log, system-state viewer, database
            inspector, query execution, copyable diagnostic output, internal
            procedure examples, health indicators, environment details, table
            listings, record counts, token information, simulation state, and
            operational statistics are not configured for this deployment. No
            request is executed, no operational system is inspected, and no
            diagnostic result is represented as current or verified.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated console, log entry, database condition, or health
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not connect to a database, enumerate data, report
                a connection or service state, refresh backend data, expose an
                internal route, run a query, render a procedure result, read a
                wallet or token record, access a user profile, or display a
                fabricated operational event.
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
