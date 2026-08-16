import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function ChatMVP() {
  return (
    <FeatureUnavailable
      title="Chat actions are not enabled yet"
      description="Messaging, AI conversations, people discovery, voice and video calls, tips, service requests, listings, payment commands, delivery receipts, and action execution require verified identity, durable message persistence, content safety, provider contracts, and financial settlement controls. The current release does not ship demo conversations or claim that a message, payment, tip, or project action succeeded."
      capability="Persistent chat, AI-assisted actions, communication, and payments"
      nextStep="Explore the launch hub"
    />
  );
}
