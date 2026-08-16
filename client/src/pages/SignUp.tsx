import FeatureUnavailable from "@/components/FeatureUnavailable";

export function SignUp() {
  return (
    <FeatureUnavailable
      title="Account creation is not enabled in this release"
      description="Registration, password handling, phone verification, social identity providers, terms consent, secure sessions, and account activation require a verified authentication service and server-side credential handling. The current release does not store credentials in browser storage, simulate verification email delivery, or claim that an account was created."
      capability="Registration, identity verification, and secure account activation"
      nextStep="Review the authentication and infrastructure launch boundaries"
    />
  );
}

export default SignUp;
