import UnavailableFeature from "@/components/UnavailableFeature";

export default function DMInbox() {
  return (
    <UnavailableFeature
      name="Direct messages"
      reason="The current inbox is not connected to verified conversation, message-send, encryption, or wallet-tip persistence. It is disabled instead of showing local-only or simulated messages."
    />
  );
}
