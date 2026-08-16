import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Governance() {
  return (
    <FeatureUnavailable
      title="Governance is not enabled yet"
      description="Proposals, voting, quorum, treasury balances, voter participation, token approvals, proposal execution, and governance history require verified identity, authorization, durable records, anti-sybil controls, immutable audit trails, and a tested execution boundary. The current release does not present a fabricated genesis vote or claim that a vote was submitted or passed."
      capability="Protocol governance, voting, treasury, and proposal execution"
      nextStep="Explore the launch hub"
    />
  );
}
