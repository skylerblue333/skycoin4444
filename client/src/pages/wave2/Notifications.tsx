import UnavailableFeature from "@/components/UnavailableFeature";

export default function NotificationsPage() {
  return (
    <UnavailableFeature
      name="Legacy notifications page"
      reason="This duplicate Wave 2 page depends on the removed wave2Notifications namespace. Use the verified Notifications Hub route while the legacy route is retired."
    />
  );
}
