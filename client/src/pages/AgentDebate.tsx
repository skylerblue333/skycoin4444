import UnavailableFeature from "@/components/UnavailableFeature";

export default function AgentDebate() {
  return (
    <UnavailableFeature
      name="Agent Debate"
      reason="The former page presented static agent perspectives, confidence scores, revenue and ROI projections, customer metrics, and launch recommendations without verified source data, model execution, or decision governance. It is gated until its inputs, model outputs, approvals, and audit trail are production-backed and validated."
    />
  );
}
