import UnavailableFeature from "@/components/UnavailableFeature";

export default function AdminPanelPage() {
  return (
    <UnavailableFeature
      name="Admin panel"
      reason="Server-side admin-role authorization, user administration, moderation persistence, audit logging, and operational metrics are not verified end-to-end. The current admin procedures are protected only by login, return empty or unavailable data, and can expose misleading success states, so this route is gated until authorization and audit controls are implemented."
    />
  );
}
