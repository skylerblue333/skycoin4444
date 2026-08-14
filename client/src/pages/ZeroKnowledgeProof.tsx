import {
  AlertTriangle,
  Database,
  LockKeyhole,
  ShieldCheck,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified cryptographic implementation",
    icon: LockKeyhole,
    detail:
      "A documented proof system, independently reviewed circuits and cryptographic libraries, trusted setup procedures where applicable, parameter management, deterministic verification, test vectors, key and secret handling, versioning, and incident response are required before generating, verifying, or representing a zero-knowledge proof.",
  },
  {
    title: "Authorized identity and data contracts",
    icon: Database,
    detail:
      "Authenticated ownership, explicit proof statements, scoped data access, consent, minimization, retention and deletion controls, accurate public inputs, audit logs, and correction workflows are required before processing identity, credential, account, transaction, or personal data in a privacy-preserving workflow.",
  },
  {
    title: "Safe workflow and automation controls",
    icon: Workflow,
    detail:
      "Explicit user authorization, least-privilege permissions, input validation, tool allowlists, human oversight, rate limits, idempotency, durable action records, failure recovery, and operational monitoring are required before configuring or performing an automated proof-related action.",
  },
  {
    title: "Security and operational assurance",
    icon: ShieldCheck,
    detail:
      "Threat modeling, penetration testing, secure deployment, dependency monitoring, error handling, availability measurement, observability, incident management, and independently evidenced performance testing are required before claiming encryption strength, protection, uptime, latency, throughput, analytics, or production readiness.",
  },
];

export default function ZeroKnowledgeProof() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Zero-knowledge proof
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Zero Knowledge Proof
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Proof generation, verification, credential or identity assertions,
            data processing, AI analytics, automation, encryption guarantees,
            security guarantees, uptime, latency, throughput, documentation,
            demonstrations, and configuration actions are not configured for
            this deployment. No proof, privacy property, cryptographic result,
            security certification, automation, metric, or operational
            capability is represented as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated proof, verification, privacy guarantee, or security
                metric
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not process a credential, create a proof, verify
                a proof, access a user record, expose a cryptographic key,
                encrypt data, run an automation, calculate a metric, demonstrate
                a capability, or report that a proof or security action
                succeeded.
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
