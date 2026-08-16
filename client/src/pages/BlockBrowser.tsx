import UnavailableFeature from "@/components/UnavailableFeature";

export default function BlockBrowser() {
  return (
    <UnavailableFeature
      name="Block browser"
      reason="Blockchain indexing is not connected to a verified production data source yet."
    />
  );
}
