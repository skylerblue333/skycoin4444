import UnavailableFeature from "@/components/UnavailableFeature";

export default function Security() {
  return (
    <UnavailableFeature
      name="Security Center"
      reason="The former page presented active encryption, 2FA, audit logging, WAF, API-key controls, SOC 2 readiness, threat counts, uptime, and a paid bug-bounty schedule without verified implementation, monitoring, certification, or program terms. This surface is gated until each security control has evidence and the vulnerability-reporting process is formally established."
    />
  );
}
