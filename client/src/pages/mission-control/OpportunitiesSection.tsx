import { Briefcase } from "lucide-react";

import { UnavailableService } from "./UnavailableService";

export function OpportunitiesSection() {
  return (
    <UnavailableService
      title="Opportunity Matching"
      icon={Briefcase}
      summary="Opportunity matching, AI scoring, network suggestions, interest responses, and profile-based recommendations are not configured for this deployment. No match, score, reputation, mutual connection, or recommendation is represented as live data."
      requirements={[
        {
          title: "Verified opportunity sources",
          detail:
            "Authenticated opportunity providers, moderation, source verification, expiry handling, and clear ownership metadata are required before showing a listing or recommendation.",
        },
        {
          title: "Recommendation methodology",
          detail:
            "Defined ranking methods, consented profile data, bias review, explainability, evaluation, and user controls are required before making a match or score claim.",
        },
        {
          title: "Network and reputation privacy",
          detail:
            "Authorized relationship data, privacy settings, relationship validation, abuse prevention, and data-retention rules are required before showing network or reputation information.",
        },
        {
          title: "Response workflow",
          detail:
            "Saved-interest records, contact authorization, notification controls, error recovery, and support paths are required before users can take action on an opportunity.",
        },
      ]}
    />
  );
}
