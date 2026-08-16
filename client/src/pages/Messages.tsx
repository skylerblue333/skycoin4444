import UnavailableFeature from "@/components/UnavailableFeature";

export default function MessagesPage() {
  return (
    <UnavailableFeature
      name="Messages"
      reason="Conversation persistence, message sending, deletion, read state, search, snap expiration, media handling, and end-to-end encryption are not verified end-to-end. The current DM procedures return unavailable, so this route is gated rather than claiming private encrypted messaging or successful message actions."
    />
  );
}
