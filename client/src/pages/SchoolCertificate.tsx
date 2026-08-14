import {
  AlertTriangle,
  Award,
  Database,
  Scale,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Verified learner and completion records",
    icon: Database,
    detail:
      "Authenticated learner identity, durable enrollment and course-progress records, assessment provenance, grading controls, completion rules, correction workflows, privacy safeguards, record retention, and appropriate access controls are required before displaying a learner name, course, score, completion date, time spent, credential identifier, achievement, or educational record.",
  },
  {
    title: "Credential issuance and verification governance",
    icon: Award,
    detail:
      "An authorized issuer, documented academic or program criteria, secure certificate generation, tamper-resistant identifiers, revocation and correction procedures, verification records, appropriate signing authority, and public-verification policy are required before issuing a certificate or asserting that a credential can be verified by an employer, institution, or other third party.",
  },
  {
    title: "Blockchain and external-publication controls",
    icon: ShieldCheck,
    detail:
      "A configured network, verified contract address, custody and key-management controls, signed and confirmed transactions, transaction-status handling, blockchain explorer integration, privacy review, cost disclosure, and appropriate user consent are required before stating that a certificate, identifier, record, or credential is stored on-chain or linking to an external verification destination.",
  },
  {
    title: "Accurate sharing and representation safeguards",
    icon: Scale,
    detail:
      "Verified public URLs, user authorization, disclosure requirements, issuer brand approval, platform-specific sharing integrations, accessible content, and clear failure handling are required before providing a share action, copying a credential link, inviting a public claim, or representing a qualification as earned.",
  },
];

export default function SchoolCertificate() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Credential service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            School Certificate
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Certificate issuance, learner names, completed courses, quiz scores,
            completion dates, instructional attribution, credential identifiers,
            on-chain verification, blockchain explorer links, achievement
            sharing, learning-time metrics, earned experience, and course
            recommendations are not configured for this deployment. No person,
            educational outcome, credential, record, issuer, transaction, or
            qualification is represented as current, verified, or earned.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated credential, grade, verification, or blockchain
                record
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not verify an identity, determine course
                completion, calculate a score, issue or sign a credential,
                create a public verification link, record anything on-chain,
                submit a blockchain transaction, copy a credential URL, open an
                explorer, or report that an academic or professional achievement
                has been earned.
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
