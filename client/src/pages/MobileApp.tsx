import {
  AlertTriangle,
  Database,
  FileCheck2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Published mobile application and verified distribution",
    icon: Smartphone,
    detail:
      "A completed mobile application, verified iOS and Android builds, authorized publisher accounts, documented store listings, signed release artifacts, supported-device and operating-system testing, accessible privacy and support information, release-version governance, and independently verifiable distribution status are required before offering a mobile download, installation path, platform support statement, system requirement, application preview, or store result.",
  },
  {
    title: "Authenticated account, social, and messaging integration",
    icon: Database,
    detail:
      "Authenticated account ownership, tenant isolation, durable user, social, messaging, notification, preference, and entitlement records, validated device registration, privacy controls, offline-data definitions, synchronization and conflict handling, defined empty states, and clear error recovery are required before displaying, creating, changing, sending, receiving, or reporting an account, social, message, notification, reward, device, voice, camera, or activity result.",
  },
  {
    title: "Secure wallet, trading, and device-operation safeguards",
    icon: ShieldCheck,
    detail:
      "Authorized wallet, exchange, blockchain-provider, payment, or other financial integration; validated network and transaction parameters; protected key and secret handling; biometric and device-security implementation; secure permission controls; transaction-status verification; duplicate-submission prevention; fraud and abuse protections; secure audit logging; and independently evidenced safeguards are required before claiming or operating wallet access, token swaps, trading, rewards, mining, hardware-wallet connections, dApp connections, asset transfers, financial transactions, or device security features.",
  },
  {
    title: "Evidence-based operations, waitlist, and reporting",
    icon: FileCheck2,
    detail:
      "A durable, consent-aware waitlist or notification workflow, verified delivery integration, documented metric definitions, source attribution, observability, performance testing, incident management, and independently verifiable methods are required before accepting a waitlist request, promising notification or bonus eligibility, reporting ratings, reviews, downloads, response times, uptime, service levels, analytics, automation, or production readiness.",
  },
];

export default function MobileApp() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Mobile-application service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            SKYCOIN4444 on Mobile
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Mobile builds, App Store and Google Play distribution, PWA
            installation, account integration, push notifications, biometric
            access, camera and voice features, offline mode, wallet connections,
            token swaps, trading, rewards, mining, device capabilities, waitlist
            enrollment, ratings, reviews, downloads, analytics, and operational
            metrics are not configured for this deployment. No application,
            download, account, wallet, transaction, waitlist, metric, or service
            result is represented as current, complete, verified, active,
            supported, installed, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated application, waitlist, wallet, or transaction
                result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not initiate an application download, enroll a
                waitlist entry, send a notification, access device capabilities,
                create or read a mobile account record, connect a wallet, submit
                a swap, trade, reward, mining, transfer, or transaction, or
                report that a mobile or financial operation succeeded.
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
