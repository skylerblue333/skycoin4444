import UnavailableFeature from "@/components/UnavailableFeature";

export default function GovernancePage() {
  return (
    <UnavailableFeature
      name="Legacy governance page"
      reason="This duplicate Wave 3 page depends on procedures that are not part of the verified governance contract. Use the canonical /governance page, which is the supported governance surface."
    />
  );
}
