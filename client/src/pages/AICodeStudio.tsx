import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function AICodeStudio() {
  return (
    <FeatureUnavailable
      title="AI Code Studio is not enabled yet"
      description="Code generation, review, analysis, autonomous sprints, repository writes, and push history require a verified model runtime, sandboxed execution, scoped repository permissions, human approval, audit logs, and rollback controls. The current release does not claim live bots or production-ready generated code."
      capability="AI code generation, analysis, and autonomous repository operations"
      nextStep="Explore the launch hub"
    />
  );
}
