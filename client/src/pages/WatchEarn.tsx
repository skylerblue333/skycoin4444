import UnavailableFeature from "@/components/UnavailableFeature";

export default function WatchEarnPage() {
  return (
    <UnavailableFeature
      name="Watch & Earn"
      reason="Video reward rates, XP, SKY444 accrual, puzzle payouts, streak multipliers, and reward settlement are not connected to a verified ledger or rewards contract. This route is gated to prevent simulated earnings."
    />
  );
}
