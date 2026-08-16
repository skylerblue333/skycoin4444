import UnavailableFeature from "@/components/UnavailableFeature";

export default function ProfilePage() {
  return (
    <UnavailableFeature
      name="Legacy profile page"
      reason="This duplicate Wave 2 page depends on the removed wave2Profile namespace. Use the verified profile and settings surfaces while the legacy route is retired."
    />
  );
}
