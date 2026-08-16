import UnavailableFeature from "@/components/UnavailableFeature";

export default function AdvancedAnalytics() {
  return (
    <UnavailableFeature
      name="Advanced Analytics"
      reason="Revenue, users, transactions, conversion, engagement, platform mix, and performance analytics require verified event instrumentation and an authoritative analytics backend. The former page used static sample metrics while describing real-time insights, so it is gated until production analytics evidence is available."
    />
  );
}
