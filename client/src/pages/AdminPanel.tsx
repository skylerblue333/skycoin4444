import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AdminPanel() {
  return (
    <FeatureUnavailable
      title="Admin operations are not enabled yet"
      description="User administration, role changes, bans, moderation queues, system health, audit data, and privileged statistics require server-enforced authorization, least privilege, immutable audit logging, approval controls, redaction, and tested rollback. The current release does not claim that an administrative action was executed or that live platform statistics are authoritative."
      capability="Privileged administration, moderation, and operational control"
      nextStep="Explore the launch hub"
    />
  );
}
