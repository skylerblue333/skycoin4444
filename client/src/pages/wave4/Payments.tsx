import UnavailableFeature from "@/components/UnavailableFeature";

export default function PaymentsPage() {
  return (
    <UnavailableFeature
      name="Legacy payments page"
      reason="This duplicate Wave 4 page depends on the retired wave4Payments namespace and does not provide a verified payout or billing contract. Use the canonical /payments page for supported payment flows."
    />
  );
}
