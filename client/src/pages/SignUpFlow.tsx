import FeatureUnavailable from "@/components/FeatureUnavailable";

export const SignUpFlow = () => {
  return (
    <FeatureUnavailable
      title="Guided sign-up flow is not enabled yet"
      description="The previous flow used simulated scarcity, fabricated user counts, reviews, earnings, bonuses, premium access, and a fake account-creation success state. The current release does not claim an account was created, a bonus credited, or an entitlement unlocked without the verified authentication and provisioning flow."
      capability="Conversion onboarding, account provisioning, and welcome entitlements"
      nextStep="Use the verified sign-in entry point"
    />
  );
};

export default SignUpFlow;
