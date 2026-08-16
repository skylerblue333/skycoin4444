import UnavailableFeature from "@/components/UnavailableFeature";

export default function NotificationsHubPage() {
  return (
    <UnavailableFeature
      name="Notifications"
      reason="Verified notification delivery, persistence, unread state, mark-read actions, and connected-service alerts are not backed by a production notification store or delivery integration. The existing UI shell is gated until notification authorization and state changes are verified end-to-end."
    />
  );
}
