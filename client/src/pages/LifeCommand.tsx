import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function LifeCommand() {
  return (
    <FeatureUnavailable
      title="Life Command is not enabled yet"
      description="Life scores, wealth or influence dimensions, digital twins, personality profiles, memory depth, AI priority actions, XP progression, and personal history require explicit consent, explainability, privacy controls, verified user-owned data, and safe human override. The current release does not profile a person, infer sensitive traits, or claim a life outcome or recommendation occurred."
      capability="Personal operating-system analytics, digital twins, and AI coaching"
      nextStep="Explore the launch hub"
    />
  );
}
