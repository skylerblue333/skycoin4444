import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Admin() {
  return (
    <FeatureUnavailable
      title="Administrative Operations are not enabled yet"
      description="User administration, platform health, uptime, version reporting, moderation telemetry, audit logs, and privileged actions require server-enforced role authorization, immutable audit trails, redacted observability, incident response, and independently verified operational data. The current release does not expose an admin control plane or claim that a moderation or administrative action occurred."
      capability="Privileged administration, moderation, audit, and operations"
      nextStep="Explore the launch hub"
    />
  );
}
