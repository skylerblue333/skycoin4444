import {
  AlertTriangle,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated enrollment and secure secret handling",
    icon: KeyRound,
    detail:
      "Authenticated account context, server-generated secrets, encryption at rest, no client-side secret exposure, key lifecycle controls, session re-authentication, atomic enrollment records, revocation, recovery workflows, rate limits, audit logging, and server-side validation are required before generating, displaying, storing, rotating, or accepting a two-factor authentication secret.",
  },
  {
    title: "Verified TOTP challenge and sign-in enforcement",
    icon: ShieldCheck,
    detail:
      "Server-side TOTP validation, replay protection, clock-skew handling, challenge binding, failure limits, account-lockout safeguards, session invalidation, device controls, secure sign-in enforcement, incident response, and independently tested authentication flows are required before accepting a code or claiming that two-factor authentication protects an account.",
  },
  {
    title: "Secure recovery and backup-code operations",
    icon: LockKeyhole,
    detail:
      "Cryptographically secure, one-time recovery codes, protected issuance and display, hashed storage, consumption tracking, revocation, re-issuance controls, recovery verification, support escalation, audit trails, and safe user guidance are required before generating, exposing, copying, saving, or declaring backup codes valid.",
  },
  {
    title: "Safe authenticator-device configuration",
    icon: Smartphone,
    detail:
      "Authorized account context, server-issued enrollment URIs, privacy-safe device naming, QR generation without third-party secret disclosure, content-security protections, safe error handling, documented compatibility testing, and operational monitoring are required before providing a QR code, manual key, device setup instruction, or authenticator status.",
  },
];

export default function TwoFactorSetup() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Two-factor authentication
            service unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Two-Factor Authentication
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Two-factor enrollment, authenticator configuration, QR codes, manual
            secrets, verification codes, backup codes, recovery,
            reconfiguration, and account-protection status are not configured
            for this deployment. No secret, QR code, code verification, recovery
            code, device, protection state, or security action is generated,
            stored, accepted, or represented as valid or successful.
          </p>
        </header>
        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated secret, QR code, verification, backup code, device
                enrollment, or security status
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create a two-factor secret, display a QR
                code, validate a token, generate recovery codes, protect a
                sign-in, modify account security, or report that an
                authentication action succeeded.
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
