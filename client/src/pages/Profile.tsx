import UnavailableFeature from "@/components/UnavailableFeature";

export default function ProfilePage() {
  return (
    <UnavailableFeature
      name="Profiles"
      reason="Verified profile updates, follows, avatar/banner uploads, follower metrics, levels, XP, reputation, and social activity are not implemented end-to-end. Current mutations return unavailable while the UI can show success toasts, so this route is gated until persistence, authorization, upload validation, and accurate metrics are verified."
    />
  );
}
