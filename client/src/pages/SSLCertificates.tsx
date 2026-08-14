import {
  AlertTriangle,
  BadgeCheck,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authorized certificate, domain, and deployment inventory",
    icon: BadgeCheck,
    detail:
      "Authenticated infrastructure ownership, tenant isolation, scoped authorization, verified domain control, durable inventory records, source attribution, safe pagination, audit logging, configuration reconciliation, and clear empty and error states are required before displaying any certificate, domain, hostname, issuer, deployment, expiration, renewal, key, endpoint, or security result.",
  },
  {
    title: "Verified issuance, renewal, and deployment integration",
    icon: KeyRound,
    detail:
      "Authorized certificate authorities and infrastructure providers, verified domain challenges, validated issuance and renewal workflows, certificate-chain verification, idempotent deployment controls, expiration handling, rollback and recovery procedures, alert routing, and evidence-based status verification are required before issuing, renewing, deploying, revoking, changing, or reporting a certificate or transport-security result.",
  },
  {
    title: "Secure key-management and access controls",
    icon: LockKeyhole,
    detail:
      "Protected key storage, least-privilege access, no plaintext private keys, rotation and revocation workflows, sensitive-data minimization, secure logging, access reviews, incident response, and independently evidenced safeguards are required before exposing, generating, managing, or reporting a private key, certificate, cryptographic setting, or security control.",
  },
  {
    title: "Evidence-based certificate and operational reporting",
    icon: ShieldCheck,
    detail:
      "Source-attributed certificate events, documented status and freshness definitions, durable deployment records, observability, capacity monitoring, performance testing, incident management, and independently verifiable methods are required before reporting certificate validity, expiry, encryption, hostname coverage, uptime, active users, transaction totals, success rates, response times, live updates, automation, advanced analytics, or production readiness.",
  },
];

export default function SSLCertificates() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> TLS-certificate service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SSL Certificates
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Certificate inventory, domain validation, issuance, renewal,
            deployment, expiration, encryption, endpoint status, active user
            counts, transaction totals, live updates, automation, success rates,
            and response times are not configured for this deployment. No
            certificate, key, domain, cryptographic setting, security result,
            metric, or service result is represented as current, complete,
            verified, active, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated certificate, encryption, issuance, renewal, or
                deployment
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not inspect a domain or endpoint, retrieve a
                certificate, generate or expose a key, perform a validation
                challenge, issue or renew a certificate, deploy configuration,
                calculate a metric, stream an update, or report that an
                infrastructure action succeeded.
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
