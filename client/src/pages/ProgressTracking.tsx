import FeatureUnavailable from "@/components/FeatureUnavailable";

export function ProgressTracking() {
  return (
    <FeatureUnavailable
      title="Learning progress tracking is not enabled yet"
      description="Language levels, words learned, practice time, streaks, sessions, ratings, milestones, XP, rewards, and completion state require verified learner-owned activity, assessment rules, durable records, and transparent reward contracts. The current release does not fabricate educational progress or claim that practice or a milestone was completed."
      capability="Language progress, milestones, activity history, and learning rewards"
      nextStep="Review the education and rewards launch boundaries"
    />
  );
}

export default ProgressTracking;
