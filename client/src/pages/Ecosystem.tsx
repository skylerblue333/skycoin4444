import FeatureUnavailable from "@/components/FeatureUnavailable";

export default function Ecosystem() {
  return (
    <FeatureUnavailable
      title="Ecosystem overview is being verified"
      description="The prior overview made unverified claims about sector readiness, live users, posts, token metrics, streams, fees, APY, certifications, infrastructure scale, and integrated capabilities. This release keeps those claims hidden until each module has a working route, verified backend contract, real data source, security review, operational evidence, and an explicit owner."
      capability="Cross-module ecosystem directory and live platform metrics"
      nextStep="Review the evidence-first launch hub"
    />
  );
}
