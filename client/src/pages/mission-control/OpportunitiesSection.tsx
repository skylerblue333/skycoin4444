import { Briefcase } from "lucide-react";
import FeatureUnavailable from "@/components/FeatureUnavailable";

export function OpportunitiesSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/70"><Briefcase className="h-4 w-4 text-cyan-300" /><span>Opportunity intelligence boundary</span></div>
      <FeatureUnavailable
        title="Opportunity matching is not enabled yet"
        description="AI-ranked opportunities, network suggestions, reputation matching, scoring, and saved or dismissed statuses require verified source data, consented profile attributes, explainability, abuse prevention, and durable persistence. The current release does not claim that recommendations or scores are real."
        capability="AI opportunity matching and network recommendations"
        nextStep="Return to the launch hub"
      />
    </div>
  );
}
