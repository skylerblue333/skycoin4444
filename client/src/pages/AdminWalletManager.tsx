import UnavailableFeature from "@/components/UnavailableFeature";

export default function AdminWalletManagerPage() {
  return (
    <UnavailableFeature
      name="Admin wallet manager"
      reason="Verified wallet balances, mining rewards, earned totals, transaction history, custody controls, explorer state, and administrative wallet operations are not connected to a production blockchain and authorization layer. This surface is gated so fallback or unavailable data cannot be mistaken for real financial custody records."
    />
  );
}
