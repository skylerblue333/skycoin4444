import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Messages() {
  return (
    <FeatureUnavailable
      title="Private messaging is not enabled yet"
      description="Conversation persistence, delivery status, deletion, media handling, and end-to-end encryption require a verified messaging service, key exchange, abuse controls, retention policy, and operational monitoring. The current release does not claim that messages are encrypted, delivered, or stored."
      capability="Private messaging and encrypted communication"
      nextStep="Explore the launch hub"
    />
  );
}
