import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function TrustSafetyDashboard() {
  return (
    <FeatureUnavailable
      title="Trust & Safety Dashboard is not enabled yet"
      description="Trust scores, moderation rules, enforcement actions, audit logs, rate-limit telemetry, and platform risk statistics require verified policy storage, privileged authorization, immutable audit logging, redaction, alerting, and operational ownership. The current release does not claim that users were scored, content was moderated, or security controls were active."
      capability="Trust scoring, moderation operations, audit logging, and abuse prevention"
      nextStep="Explore the launch hub"
    />
  );
}
