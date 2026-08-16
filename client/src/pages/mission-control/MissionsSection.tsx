import { Target } from "lucide-react";
import FeatureUnavailable from "@/components/FeatureUnavailable";

export function MissionsSection() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-white/70"><Target className="h-4 w-4 text-cyan-300" /><span>Mission system boundary</span></div>
      <FeatureUnavailable
        title="Missions are not enabled yet"
        description="Mission creation, AI-generated step plans, progress persistence, completion status, and rewards require a verified task service, user authorization, durable storage, and an auditable completion model. The current release does not claim that missions or rewards are active."
        capability="AI mission planning, progress tracking, and reward delivery"
        nextStep="Return to the launch hub"
      />
    </div>
  );
}
