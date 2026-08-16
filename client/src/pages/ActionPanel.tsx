import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ActionPanel() {
  return (
    <FeatureUnavailable
      title="Action Panel is not enabled yet"
      description="Tips, service requests, marketplace listings, AI-executed tasks, platform volume, and recent-action histories require verified payment, identity, marketplace, task, permission, audit, and rollback infrastructure. The current release does not fabricate balances or claim that money was sent, a listing was published, a service was requested, or an AI task executed successfully."
      capability="Financial tips, service requests, listings, and delegated actions"
      nextStep="Explore the launch hub"
    />
  );
}
