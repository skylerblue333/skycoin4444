import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function CreatorSpotlight() {
  return (
    <FeatureUnavailable
      title="Creator discovery is not enabled yet"
      description="Creator profiles, verification, tiers, subscriber and follower counts, views, earnings, live presence, content previews, and follow or subscription actions require verified social records, media infrastructure, identity controls, analytics, and monetization contracts. The current release does not fabricate creators, audience metrics, or subscription success."
      capability="Creator discovery, profiles, live status, and subscriptions"
      nextStep="Review the creator and commerce launch boundaries"
    />
  );
}
