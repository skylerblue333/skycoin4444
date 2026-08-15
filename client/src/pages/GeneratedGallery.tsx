import { Images } from "lucide-react";

import { UnavailableService } from "@/pages/mission-control/UnavailableService";

const requirements = [
  {
    title: "Authoritative screen and component inventory",
    detail:
      "A versioned source of truth for screens, routes, categories, components, ownership, release status, and provenance is required before this area can report counts, classifications, or coverage.",
  },
  {
    title: "Verified generation and review provenance",
    detail:
      "Generation records, source artifacts, reviewer identity, review criteria, test evidence, accessibility checks, security review, and release approvals are required before describing any screen as AI-generated, reviewed, production-ready, or complete.",
  },
  {
    title: "Live route and deployment verification",
    detail:
      "The route registry, deployment environment, authentication requirements, dependency health, and runtime checks must be verified before linking to a module as live or available.",
  },
  {
    title: "Controlled artifact distribution",
    detail:
      "A configured, authorized, integrity-checked artifact store with access control, retention, versioning, and documented provenance is required before offering a codebase or ZIP download.",
  },
];

export default function GeneratedGallery() {
  return (
    <main className="min-h-screen bg-background p-4 text-foreground sm:p-8">
      <div className="mx-auto max-w-5xl">
        <UnavailableService
          title="Screen Gallery"
          icon={Images}
          summary="The generated-screen inventory, provenance, production-readiness review, live-route verification, component counts, and downloadable artifact service are not configured for this deployment. No screen count, category count, live-page count, component count, review result, route status, or download is represented as current, verified, available, or complete."
          requirements={requirements}
        />
      </div>
    </main>
  );
}
