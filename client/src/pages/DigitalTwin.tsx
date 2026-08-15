import { Brain } from "lucide-react";

import { UnavailableService } from "./mission-control/UnavailableService";

export default function DigitalTwin() {
  return (
    <UnavailableService
      title="Digital Twin"
      icon={Brain}
      summary="A personalized digital-twin service is not configured for this deployment. No personality scores, growth history, predictions, relationships, XP, or archetype are represented as available."
      requirements={[
        { title: "Consent-based profile data", detail: "The service requires explicit user consent, data provenance, retention controls, and account-level access rules." },
        { title: "Validated inference", detail: "Predictions and scores require documented models, evaluation data, uncertainty reporting, and safe explanations." },
        { title: "User-controlled records", detail: "Growth and relationship history must come from user-owned records rather than hardcoded timelines or percentages." },
      ]}
    />
  );
}
