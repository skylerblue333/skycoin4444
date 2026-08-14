import {
  AlertTriangle,
  Database,
  FileCode2,
  Server,
  ShieldCheck,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const serviceRequirements = [
  {
    title: "Maintained deployment artifacts and release provenance",
    icon: FileCode2,
    detail:
      "A maintained and source-controlled deployment repository, versioned and reviewed artifacts, reproducible builds, signed or otherwise verified release provenance, dependency review, software bills of materials, compatibility testing, rollback documentation, and published support boundaries are required before providing an installer, container image, configuration, command, or deployment instruction.",
  },
  {
    title: "Secure infrastructure and secrets management",
    icon: ShieldCheck,
    detail:
      "A defined infrastructure architecture, hardened deployment model, secure secret generation and storage, identity and access controls, encrypted network paths, database safeguards, backup and recovery procedures, tenancy boundaries, monitoring, incident response, and operational ownership are required before generating or handling credentials, database URLs, certificates, service configuration, or environment files.",
  },
  {
    title: "Validated provisioning and service operations",
    icon: Server,
    detail:
      "Tested provisioning workflows, host and network validation, migration safety checks, health-check methodology, availability controls, rate limits, observability, cost and capacity planning, support procedures, and documented failure recovery are required before claiming that an installation, database setup, service start, certificate configuration, or health check will work.",
  },
  {
    title: "Accurate provider, pricing, and platform compatibility information",
    icon: Database,
    detail:
      "Current provider documentation, independently verified pricing, documented compatibility matrices, region and service constraints, lifecycle policies, compliance review, and clear limitations are required before recommending providers, quoting costs, or representing hardware, operating-system, database, runtime, storage, or network requirements.",
  },
];

export default function ServerInstaller() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100">
      <div className="mx-auto max-w-5xl">
        <header className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Deployment service
            unavailable
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Server Installer
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Self-hosted deployment, installation steps, repository cloning,
            container images, infrastructure provisioning, Docker configuration,
            environment-file generation, secret generation, database setup,
            service startup, certificate management, health checks,
            cloud-provider recommendations, pricing, and compatibility claims
            are not configured for this deployment. No configuration file,
            credential, script, download, deployment command, infrastructure
            result, or service state is represented as current, verified, or
            available.
          </p>
        </header>

        <section className="mt-8 rounded-xl border border-amber-900/60 bg-amber-950/30 p-5">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
            <div>
              <h2 className="font-semibold text-amber-100">
                No generated infrastructure artifacts or execution instructions
              </h2>
              <p className="mt-1 text-sm leading-6 text-amber-200">
                This page does not generate a secret, produce an environment
                file, create a container configuration, issue a script,
                recommend a provider, validate a domain or server, initiate
                deployment, run a migration, create a certificate, or report
                that an installed service is healthy.
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
