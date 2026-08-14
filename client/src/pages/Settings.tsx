import {
  AlertTriangle,
  Database,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated preferences and profile-data controls",
    icon: Database,
    detail:
      "Authenticated ownership checks, persisted preference records, input validation, data minimization, clear user disclosures, privacy controls, durable updates, audit history, correction paths, and error recovery are required before saving or representing profile preferences, notification choices, privacy settings, communication permissions, or account data.",
  },
  {
    title: "Account security, sessions, and deletion safeguards",
    icon: LockKeyhole,
    detail:
      "Secure multi-factor enrollment, recovery procedures, session inventory, device verification, re-authentication for high-risk actions, account-deletion workflows, retention and legal-hold rules, user notification, revocation controls, and abuse prevention are required before managing two-factor authentication, sessions, login history, or account deletion.",
  },
  {
    title: "Verified wallet and financial integrations",
    icon: WalletCards,
    detail:
      "Authorized wallet infrastructure, verified addresses and network state, transaction confirmation, custody safeguards, token and staking eligibility checks, balance reconciliation, financial and legal review, alerts, incident handling, and clear risk disclosures are required before displaying a wallet, enabling auto-staking, or representing token-related settings or activity.",
  },
  {
    title: "Accurate personal metrics and service delivery",
    icon: ShieldCheck,
    detail:
      "Authoritative source records, documented metric definitions, authorization, privacy review, data-quality checks, moderation and safety controls, notification delivery infrastructure, monitoring, and correction workflows are required before displaying profile levels, XP, reputation, followers, service availability, or notification outcomes.",
  },
];

export default function Settings() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Account-settings service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Settings
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Profile settings, avatar uploads, notification preferences, privacy
            controls, direct-message permissions, account deletion, two-factor
            authentication, active sessions, login history, wallet information,
            staking controls, transaction notifications, account statistics, and
            social metrics are not configured for this deployment. No
            preference, profile update, account-security state, session, wallet,
            financial setting, statistic, or notification setting is represented
            as current, verified, or available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated account changes, security states, or wallet
                controls
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not save profile data, accept a file upload,
                alter notifications or privacy, manage direct messages, delete
                an account, enroll two-factor authentication, enumerate
                sessions, derive a wallet address, stake an asset, or represent
                a security, social, or financial setting as successful.
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
