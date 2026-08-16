import UnavailableFeature from "@/components/UnavailableFeature";

export default function InvestorPortalPage() {
  return (
    <UnavailableFeature
      name="Investor portal"
      reason="Token-sale pricing, hard caps, total-raised figures, bonuses, purchase settlement, vesting claims, payment methods, and KYC statements are not verified end-to-end in production. This investor surface is gated to prevent unsupported fundraising or financial claims."
    />
  );
}
