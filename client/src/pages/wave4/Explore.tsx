import UnavailableFeature from "@/components/UnavailableFeature";

export default function ExplorePage() {
  return (
    <UnavailableFeature
      name="Legacy explore page"
      reason="This duplicate Wave 4 page depends on the retired wave4Explore namespace and aggregates unsupported discovery, product, course, game, and governance data. Use the individual verified ecosystem surfaces instead of this unverified cross-module feed."
    />
  );
}
