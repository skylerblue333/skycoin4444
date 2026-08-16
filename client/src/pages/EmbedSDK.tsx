import UnavailableFeature from "@/components/UnavailableFeature";

export default function EmbedSDK() {
  return (
    <UnavailableFeature
      name="Embed SDK"
      reason="The former page advertised wallet custody, AI, live price charts, payments, NFTs, API keys, pricing plans, webhooks, SLAs, and revenue sharing without verified SDK contracts or production infrastructure. It is gated until the SDK, authentication, billing, webhooks, and embedded financial actions are implemented and independently tested."
    />
  );
}
