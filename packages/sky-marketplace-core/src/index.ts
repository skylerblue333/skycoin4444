export const SKY_MARKETPLACE_LISTING_CHANGED = 'sky.marketplace.listing.changed.v1' as const;

export type ListingStatus = 'draft' | 'active' | 'paused' | 'closed';

export interface MarketplaceListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  priceMinor: number;
  currency: string;
  status: ListingStatus;
  version: number;
}

export interface ListingChangedEvent {
  type: typeof SKY_MARKETPLACE_LISTING_CHANGED;
  listingId: string;
  sellerId: string;
  status: ListingStatus;
  version: number;
}

const ID = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const CURRENCY = /^[A-Z]{3}$/;

function clean(value: string, max: number, field: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ');
  if (!normalized || normalized.length > max) throw new Error(`${field} invalid`);
  return normalized;
}

function assertMoney(priceMinor: number, currency: string): void {
  if (!Number.isSafeInteger(priceMinor) || priceMinor < 0) throw new Error('priceMinor must be a non-negative safe integer');
  if (!CURRENCY.test(currency)) throw new Error('currency must be an uppercase ISO-style code');
}

export function createListing(input: Omit<MarketplaceListing, 'status' | 'version'>): MarketplaceListing {
  if (!ID.test(input.id) || !ID.test(input.sellerId)) throw new Error('invalid identifier');
  assertMoney(input.priceMinor, input.currency);
  return Object.freeze({
    ...input,
    title: clean(input.title, 160, 'title'),
    description: clean(input.description, 4000, 'description'),
    status: 'draft' as const,
    version: 1,
  });
}

const transitions: Record<ListingStatus, readonly ListingStatus[]> = {
  draft: ['active', 'closed'],
  active: ['paused', 'closed'],
  paused: ['active', 'closed'],
  closed: [],
};

export function transitionListing(listing: MarketplaceListing, status: ListingStatus): MarketplaceListing {
  if (!transitions[listing.status].includes(status)) throw new Error(`invalid transition ${listing.status}->${status}`);
  return Object.freeze({ ...listing, status, version: listing.version + 1 });
}

export function repriceListing(listing: MarketplaceListing, priceMinor: number, currency = listing.currency): MarketplaceListing {
  if (listing.status === 'closed') throw new Error('closed listings cannot be repriced');
  assertMoney(priceMinor, currency);
  return Object.freeze({ ...listing, priceMinor, currency, version: listing.version + 1 });
}

export function toListingChangedEvent(listing: MarketplaceListing): ListingChangedEvent {
  return {
    type: SKY_MARKETPLACE_LISTING_CHANGED,
    listingId: listing.id,
    sellerId: listing.sellerId,
    status: listing.status,
    version: listing.version,
  };
}
