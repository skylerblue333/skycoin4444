export type MarketplaceListing = Readonly<{
  listingId: string;
  publisherId: string;
  name: string;
  priceCredits: bigint;
  capabilities: readonly string[];
  active: boolean;
}>;

export type MarketplaceQuery = Readonly<{
  capability?: string;
  maxPriceCredits?: bigint;
}>;

const ID_RE = /^[a-zA-Z0-9:_-]{2,128}$/;
const CAP_RE = /^[a-zA-Z0-9:_-]{2,80}$/;

export function validateListing(listing: MarketplaceListing): void {
  if (!ID_RE.test(listing.listingId) || !ID_RE.test(listing.publisherId)) throw new Error('invalid listing identity');
  if (listing.name.trim().length < 2 || listing.name.length > 120) throw new Error('invalid listing name');
  if (listing.priceCredits < 0n) throw new Error('priceCredits must be non-negative');
  if (listing.capabilities.length === 0 || listing.capabilities.length > 100) throw new Error('capability count must be 1-100');
  const seen = new Set<string>();
  for (const capability of listing.capabilities) {
    if (!CAP_RE.test(capability)) throw new Error('invalid capability');
    if (seen.has(capability)) throw new Error('duplicate capability');
    seen.add(capability);
  }
}

export function searchListings(listings: readonly MarketplaceListing[], query: MarketplaceQuery): readonly MarketplaceListing[] {
  if (query.capability !== undefined && !CAP_RE.test(query.capability)) throw new Error('invalid capability query');
  if (query.maxPriceCredits !== undefined && query.maxPriceCredits < 0n) throw new Error('maxPriceCredits must be non-negative');
  if (listings.length > 10_000) throw new Error('listing limit exceeded');
  const seen = new Set<string>();
  const results = listings.filter((listing) => {
    validateListing(listing);
    if (seen.has(listing.listingId)) throw new Error('duplicate listing id');
    seen.add(listing.listingId);
    if (!listing.active) return false;
    if (query.capability && !listing.capabilities.includes(query.capability)) return false;
    if (query.maxPriceCredits !== undefined && listing.priceCredits > query.maxPriceCredits) return false;
    return true;
  });
  return Object.freeze([...results].sort((a, b) => a.priceCredits < b.priceCredits ? -1 : a.priceCredits > b.priceCredits ? 1 : a.listingId.localeCompare(b.listingId)));
}
