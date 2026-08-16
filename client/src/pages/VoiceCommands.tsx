import FeatureUnavailable from "@/components/FeatureUnavailable";

export function VoiceCommandsPage() {
  return (
    <FeatureUnavailable
      title="Voice Commands are not enabled yet"
      description="Voice recognition, command execution, macros, payments, balance access, analytics, and response-time metrics require verified speech services, permission scopes, confirmation controls, audit logs, and safe action dispatch. The current release does not claim that a voice command was recognized, executed, or completed."
      capability="Voice recognition, macros, analytics, and action execution"
      nextStep="Explore the launch hub"
    />
  );
}

export default VoiceCommandsPage;
