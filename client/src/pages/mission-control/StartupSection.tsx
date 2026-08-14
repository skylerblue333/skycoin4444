import { Rocket } from "lucide-react";

import { UnavailableService } from "./UnavailableService";

export function StartupSection() {
  return (
    <UnavailableService
      title="Startup Builder"
      icon={Rocket}
      summary="Startup blueprint generation, business planning, branding, marketing plans, team plans, roadmaps, and stored project records are not configured for this deployment. No idea, forecast, plan, recommendation, or startup outcome is represented as generated or validated."
      requirements={[
        {
          title: "AI planning service",
          detail:
            "A configured model provider, server-side credential controls, safe prompt handling, output labeling, error handling, and user review requirements are needed before generating planning materials.",
        },
        {
          title: "Project storage and access",
          detail:
            "Authenticated project records, ownership rules, versioning, retention controls, export handling, and authorization checks are required before storing or retrieving a startup blueprint.",
        },
        {
          title: "Business and market evidence",
          detail:
            "Source-backed research, financial-model assumptions, uncertainty disclosure, review workflows, and clear limitations are required before presenting a plan as business, market, or investment guidance.",
        },
        {
          title: "User approval and safety",
          detail:
            "Human approval, privacy safeguards, abuse prevention, and support processes are required before any generated material can be relied on or shared outside the platform.",
        },
      ]}
    />
  );
}
