import UnavailableFeature from "@/components/UnavailableFeature";

export default function Search() {
  return (
    <UnavailableFeature
      name="Global search"
      reason="The current page depends on stale global-search, trending, and suggestion procedures that are not exposed as verified production contracts."
    />
  );
}
