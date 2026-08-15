import { Layers } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authoritative feature and module registry",
    detail:
      "A versioned source of truth tied to implemented routes, components, server procedures, integrations, ownership, and release status is required before reporting feature counts, modules, versions, or feature coverage.",
  },
  {
    title: "Verified implementation and production-readiness evidence",
    detail:
      "Build and runtime evidence, integration and end-to-end tests, accessibility checks, security review, dependency status, deployment verification, and operational ownership are required before describing features as real, compiled, complete, or production-ready.",
  },
  {
    title: "Traceable platform and voice-command statistics",
    detail:
      "Defined measurement semantics, source records, collection time, provenance, and reconciliation are required before reporting platform users, feature totals, versions, modules, voice commands, analytics, or other aggregate statistics.",
  },
  {
    title: "Accurate capability and integration disclosure",
    detail:
      "Each listed capability must map to a verified implementation and clearly identify unavailable, demo, test, third-party, or planned functionality. No financial, trading, wallet, AI, governance, education, charity, marketplace, security, or operational capability is asserted here without evidence.",
  },
];

export default function Features() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Feature Catalog"
          icon={Layers}
          summary="The authoritative feature registry, implementation provenance, production-readiness evidence, platform statistics, voice-command inventory, and cross-module capability verification are not configured for this deployment. No feature count, module count, version count, command count, implementation status, or production-readiness claim is represented as current, verified, complete, or available."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
