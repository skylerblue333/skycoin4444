export const SKY_MARKETPLACE_LISTING_CHANGED =
  "sky.marketplace.listing.changed.v1" as const;

export type ListingStatus = "draft" | "active" | "paused" | "closed";

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
const LISTING_STATUSES = new Set<ListingStatus>([
  "draft",
  "active",
  "paused",
  "closed",
]);

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireIdentifier(value: unknown, field: string): string {
  if (typeof value !== "string" || !ID.test(value)) {
    throw new Error(`${field} invalid`);
  }
  return value;
}

function clean(value: unknown, max: number, field: string): string {
  if (typeof value !== "string") throw new Error(`${field} invalid`);
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized || normalized.length > max) {
    throw new Error(`${field} invalid`);
  }
  return normalized;
}

function assertMoney(priceMinor: unknown, currency: unknown): void {
  if (!Number.isSafeInteger(priceMinor) || (priceMinor as number) < 0) {
    throw new Error("priceMinor must be a non-negative safe integer");
  }
  if (typeof currency !== "string" || !CURRENCY.test(currency)) {
    throw new Error("currency must be an uppercase ISO-style code");
  }
}

function isListingStatus(value: unknown): value is ListingStatus {
  return (
    typeof value === "string" &&
    LISTING_STATUSES.has(value as ListingStatus)
  );
}

export function validateMarketplaceListing(listing: MarketplaceListing): void {
  if (!isObjectRecord(listing)) throw new Error("listing is required");

  requireIdentifier(listing.id, "listing id");
  requireIdentifier(listing.sellerId, "seller id");
  clean(listing.title, 160, "title");
  clean(listing.description, 4000, "description");
  assertMoney(listing.priceMinor, listing.currency);

  if (!isListingStatus(listing.status)) {
    throw new Error("listing status invalid");
  }
  if (!Number.isSafeInteger(listing.version) || (listing.version as number) < 1) {
    throw new Error("listing version must be a positive safe integer");
  }
}

export function createListing(
  input: Omit<MarketplaceListing, "status" | "version">,
): MarketplaceListing {
  if (!isObjectRecord(input)) throw new Error("listing input is required");

  const id = requireIdentifier(input.id, "listing id");
  const sellerId = requireIdentifier(input.sellerId, "seller id");
  const title = clean(input.title, 160, "title");
  const description = clean(input.description, 4000, "description");
  assertMoney(input.priceMinor, input.currency);

  return Object.freeze({
    id,
    sellerId,
    title,
    description,
    priceMinor: input.priceMinor,
    currency: input.currency,
    status: "draft" as const,
    version: 1,
  });
}

const transitions: Record<ListingStatus, readonly ListingStatus[]> = {
  draft: ["active", "closed"],
  active: ["paused", "closed"],
  paused: ["active", "closed"],
  closed: [],
};

export function transitionListing(
  listing: MarketplaceListing,
  status: ListingStatus,
): MarketplaceListing {
  validateMarketplaceListing(listing);
  if (!isListingStatus(status)) throw new Error("target listing status invalid");
  if (!transitions[listing.status].includes(status)) {
    throw new Error(`invalid transition ${listing.status}->${status}`);
  }
  return Object.freeze({
    ...listing,
    status,
    version: listing.version + 1,
  });
}

export function repriceListing(
  listing: MarketplaceListing,
  priceMinor: number,
  currency?: string,
): MarketplaceListing {
  validateMarketplaceListing(listing);
  if (listing.status === "closed") {
    throw new Error("closed listings cannot be repriced");
  }

  const nextCurrency = currency ?? listing.currency;
  assertMoney(priceMinor, nextCurrency);
  return Object.freeze({
    ...listing,
    priceMinor,
    currency: nextCurrency,
    version: listing.version + 1,
  });
}

export function toListingChangedEvent(
  listing: MarketplaceListing,
): ListingChangedEvent {
  validateMarketplaceListing(listing);
  return {
    type: SKY_MARKETPLACE_LISTING_CHANGED,
    listingId: listing.id,
    sellerId: listing.sellerId,
    status: listing.status,
    version: listing.version,
  };
}
