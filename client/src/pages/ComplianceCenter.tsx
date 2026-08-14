import {
  AlertTriangle,
  ClipboardCheck,
  FileLock2,
  KeyRound,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const requirements = [
  {
    title: "Identity verification",
    icon: KeyRound,
    detail:
      "A verified identity provider, documented review process, encrypted document handling, retention rules, and appeal workflow are required before accepting identity documents.",
  },
  {
    title: "Consent and privacy preferences",
    icon: ShieldCheck,
    detail:
      "Persisted consent records, policy versioning, audit trails, and jurisdiction-specific review are required before presenting editable consent controls.",
  },
  {
    title: "Data access, export, and deletion",
    icon: FileLock2,
    detail:
      "Authenticated request workflows, identity verification, secure export delivery, deletion safeguards, and operational review are required before enabling these actions.",
  },
  {
    title: "Compliance monitoring",
    icon: ClipboardCheck,
    detail:
      "A defined control framework, validated data sources, human review, and immutable audit logging are required before reporting compliance scores or certification status.",
  },
];

export default function ComplianceCenter() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Verification services
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Compliance Center
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            This deployment does not currently operate an identity-verification,
            consent-management, data-rights, or compliance-monitoring service.
            No compliance score, KYC status, certification, review time, audit
            event, or privacy request status is displayed.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No legal or regulatory representation
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                The platform does not represent that it has completed KYC, AML,
                privacy, data-retention, or regulatory certification processes.
                Identity documents and data-rights requests are intentionally
                not accepted through this interface until the required controls
                and operational processes are implemented.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-5 md:grid-cols-2">
          {requirements.map(requirement => {
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
