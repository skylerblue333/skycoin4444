import UnavailableFeature from "@/components/UnavailableFeature";

export default function SocialMediaPage() {
  return (
    <UnavailableFeature
      name="Legacy social media page"
      reason="This legacy page mixes verified feed reads with hard-coded creator recommendations and unsupported follow, upload, and AI-draft actions. It is not available as a production surface until all interactions are backed by typed contracts."
    />
  );
}
