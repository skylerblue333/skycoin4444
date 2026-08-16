import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function TeamWorkspace() {
  return (
    <FeatureUnavailable
      title="Team Workspace is not enabled yet"
      description="Channels, member identities and presence, messages, tasks, files, notifications, meetings, productivity analytics, and collaboration actions require verified workspace storage, authorization, retention, and audit controls. The current release does not seed team records or claim that a message, task, file, or notification was created or delivered."
      capability="Team communication, project tracking, files, and analytics"
      nextStep="Review the collaboration and operations launch boundaries"
    />
  );
}
