import UnavailableFeature from "@/components/UnavailableFeature";

export default function PresentationWithChat() {
  return (
    <UnavailableFeature
      name="Investor Presentation"
      reason="The former presentation contained unsupported fundraising, revenue, user-growth, ROI, market-size, compliance-certification, team, and production-status claims. It also implied an AI presentation chat without a verified model contract. This route is gated until every investor-facing statement has authoritative source documentation and legal/compliance review."
    />
  );
}
