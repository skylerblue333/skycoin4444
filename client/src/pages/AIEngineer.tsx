import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AIEngineer() {
  return (
    <FeatureUnavailable
      title="AI Engineer Studio is not enabled yet"
      description="Specialized agents, code generation, security audits, multi-agent sprints, and autonomous orchestration require a verified model runtime, execution sandbox, tool permissions, audit logging, and human review controls. The current release does not claim that agents are active or that generated code is production-ready."
      capability="AI coding agents, orchestration, and automated engineering workflows"
      nextStep="Explore the launch hub"
    />
  );
}
