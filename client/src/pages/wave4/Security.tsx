import UnavailableFeature from "@/components/UnavailableFeature";

export default function SecurityPage() {
  return (
    <UnavailableFeature
      name="Legacy security page"
      reason="This duplicate Wave 4 page depends on the retired wave4Security namespace and does not provide a verified MFA, session, or security-score contract. Use the canonical security surfaces for supported account security controls."
    />
  );
}
