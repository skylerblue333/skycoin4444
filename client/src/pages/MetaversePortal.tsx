import {
  AlertTriangle,
  Boxes,
  Database,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Authenticated virtual-world and real-time session service",
    icon: Boxes,
    detail:
      "A deployed and tested virtual-world runtime, authenticated account and session ownership, authorization boundaries, durable world, presence, identity, inventory, event, and content records, real-time synchronization, capacity controls, client compatibility testing, explicit error and reconnect handling, and independently verified session state are required before providing a portal, interactive world, user presence, shared space, virtual asset, or metaverse result.",
  },
  {
    title: "Validated content, asset, and integration lifecycle",
    icon: Database,
    detail:
      "A governed content pipeline; reviewed and rights-cleared assets; versioned world configuration; secure upload, moderation, retention, and deletion controls; documented third-party integration contracts; input and output validation; and recovery procedures are required before presenting, creating, configuring, publishing, processing, transferring, or reporting virtual-world content, an integration, or an automated workflow.",
  },
  {
    title: "Security, privacy, and operational control plane",
    icon: ShieldCheck,
    detail:
      "Threat modeling, secure authentication and authorization, tenant isolation, abuse prevention, rate limits, audit logging, incident response, privacy and consent controls, encryption with managed keys, vulnerability remediation, access reviews, and evidence that the controls operate as designed are required before representing a portal, account, session, virtual asset, automation, data workflow, or security feature as protected, resilient, private, or available.",
  },
  {
    title: "Evidence-based analytics, performance, documentation, and support",
    icon: FileCheck2,
    detail:
      "Defined metric calculations, traceable data sources, monitoring, alerting, performance and load testing, service-level objectives, documented deployment and support procedures, accurate technical documentation, demo environment controls, and independently verifiable operational evidence are required before reporting analytics, AI insights, performance, throughput, latency, uptime, service levels, automation outcomes, documentation availability, demo availability, or production readiness.",
  },
];

export default function MetaversePortal() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Metaverse Portal service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Metaverse Portal
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            A metaverse runtime, authenticated virtual-world sessions, presence,
            asset and content management, analytics, AI insights, automation,
            security controls, performance monitoring, operational metrics,
            technical documentation, and demo scheduling are not configured for
            this deployment. No portal, virtual world, user, session, asset,
            content item, configuration, automated outcome, security property,
            metric, documentation result, or demo is represented as current,
            complete, verified, active, protected, available, or delivered.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No simulated portal, data, automation, or metric result
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not create, enter, or configure a virtual world;
                establish a user session or presence; process content or assets;
                run automation or AI analysis; report security status,
                analytics, uptime, latency, throughput, or other performance
                figures; supply documentation; or schedule a demo.
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
