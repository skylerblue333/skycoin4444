import {
  AlertTriangle,
  Database,
  FileCheck2,
  Globe,
  Heart,
  MapPin,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Persisted charity, campaign, donation, and beneficiary records",
    icon: Database,
    detail:
      "Authenticated and access-controlled services for organizations, campaigns, donations, payment states, geographic scope, beneficiaries, disbursements, receipts, consent, privacy, deletion, and reconciliation are required before retrieving or reporting a campaign, donation, amount, region, beneficiary, organization, transaction, or impact record.",
  },
  {
    title: "Verified donation and impact measurement semantics",
    icon: TrendingUp,
    detail:
      "Source-backed payment and settlement records, currency and fee treatment, refund and chargeback handling, campaign and beneficiary definitions, geographic attribution, time windows, duplicate and missing-event detection, outcome methodology, and independently reviewable evidence are required before calculating or displaying money raised, goals, progress, campaigns, beneficiaries, donations, lives helped, or impact outcomes.",
  },
  {
    title: "Privacy, authorization, and charity-safety controls",
    icon: ShieldCheck,
    detail:
      "Organization verification, authenticated authorization, donor and beneficiary privacy, consent, data minimization, abuse and fraud prevention, secure payment handling, audit logs, dispute procedures, incident response, and evidence that controls operate as designed are required before exposing, exporting, aggregating, notifying, or representing donation, beneficiary, campaign, or user information as protected, legitimate, or successful.",
  },
  {
    title: "Evidence-based map, live feed, and operational reporting",
    icon: FileCheck2,
    detail:
      "Traceable source data, map and region definitions, update timestamps, monitoring, delivery and synchronization semantics, performance testing, support procedures, and independently verifiable operational records are required before reporting live donations, total raised, active campaigns, beneficiaries, response times, success rates, analytics, automation outcomes, documentation availability, or production readiness.",
  },
];

export default function ImpactMap() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Impact Map service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Impact Map
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Verified charity organizations, campaigns, donations, payment
            states, regions, beneficiaries, impact measurements, live feeds,
            analytics, automation, operational, and support services are not
            configured for this deployment. No campaign, donation, amount, goal,
            region, beneficiary, user, transaction, impact outcome, metric, or
            service status is represented as current, complete, verified,
            legitimate, private, available, or successful.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated donations, beneficiaries, maps, or impact metrics
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not retrieve or create campaigns, process
                donations, verify organizations, report beneficiary counts,
                calculate impact, render a live donation feed, map geographic
                flows, synchronize records, automate actions, or report
                financial, analytics, or operational outcomes. It does not claim
                that a donation, payment, campaign, or impact result exists or
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

        <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
          <Globe className="h-4 w-4" /> Impact visualization and donation
          reporting will remain disabled until the required services are
          configured and verified.
          <Heart className="h-4 w-4" />
          <MapPin className="h-4 w-4" />
        </div>
      </div>
    </main>
  );
}
