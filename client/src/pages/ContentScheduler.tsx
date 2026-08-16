import UnavailableFeature from "@/components/UnavailableFeature";

export default function ContentScheduler() {
  return (
    <UnavailableFeature
      name="Content Scheduler"
      reason="The former route used static content, fabricated staking APY and market-analysis claims, local-only scheduling state, and success toasts without persisted publishing or failure reconciliation. It is gated until authenticated scheduling, publishing, moderation, and truthful delivery status are implemented."
    />
  );
}
