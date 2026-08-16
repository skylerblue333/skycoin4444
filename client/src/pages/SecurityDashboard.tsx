import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function SecurityDashboard() {
  return (
    <FeatureUnavailable
      title="Security Dashboard is not enabled yet"
      description="Security scores, TLS grades, WAF state, uptime, 2FA status, security scans, moderation counts, connected-app counts, and active-session claims require verified infrastructure telemetry, identity controls, monitoring, audit data, and owner acceptance. The current release does not display fallback security metrics or claim that a scan completed or found no issues."
      capability="Security posture, monitoring, scans, and session evidence"
      nextStep="Review account security settings"
    />
  );
}
