import { describe, expect, it } from "vitest";
import {
  createListing,
  repriceListing,
  toListingChangedEvent,
  transitionListing,
  validateMarketplaceListing,
} from "./index.js";

describe("SkyMarketplaceCore", () => {
  const base = {
    id: "listing-1",
    sellerId: "seller-1",
    title: "  Example   listing  ",
    description: "  Useful   item  ",
    priceMinor: 1250,
    currency: "USD",
  };

  it("normalizes and versions listing lifecycle changes", () => {
    const draft = createListing(base);
    expect(draft.title).toBe("Example listing");
    expect(draft.status).toBe("draft");
    const active = transitionListing(draft, "active");
    const repriced = repriceListing(active, 1500);
    expect(repriced.version).toBe(3);
    expect(toListingChangedEvent(repriced)).toEqual({
      type: "sky.marketplace.listing.changed.v1",
      listingId: "listing-1",
      sellerId: "seller-1",
      status: "active",
      version: 3,
    });
  });

  it("rejects unsafe money and invalid transitions", () => {
    expect(() => createListing({ ...base, priceMinor: -1 })).toThrow();
    expect(() => createListing({ ...base, currency: "usd" })).toThrow();
    const draft = createListing(base);
    expect(() => transitionListing(draft, "paused")).toThrow();
  });

  it("prevents reopening or repricing closed listings", () => {
    const closed = transitionListing(createListing(base), "closed");
    expect(() => transitionListing(closed, "active")).toThrow();
    expect(() => repriceListing(closed, 100)).toThrow();
  });

  it("fails closed on malformed runtime listing shapes", () => {
    expect(() =>
      createListing(
        null as unknown as Parameters<typeof createListing>[0],
      ),
    ).toThrow("listing input is required");

    expect(() =>
      createListing({
        ...base,
        title: null as unknown as string,
      }),
    ).toThrow("title invalid");

    expect(() =>
      validateMarketplaceListing(
        null as unknown as Parameters<typeof validateMarketplaceListing>[0],
      ),
    ).toThrow("listing is required");
  });

  it("rejects malformed persisted state before lifecycle or event operations", () => {
    const draft = createListing(base);
    const malformedStatus = {
      ...draft,
      status: "deleted" as unknown as typeof draft.status,
    };
    const malformedVersion = { ...draft, version: 0 };

    expect(() => transitionListing(malformedStatus, "active")).toThrow(
      "listing status invalid",
    );
    expect(() => repriceListing(malformedVersion, 500)).toThrow(
      "listing version",
    );
    expect(() => toListingChangedEvent(malformedStatus)).toThrow(
      "listing status invalid",
    );
    expect(() =>
      transitionListing(
        draft,
        "deleted" as unknown as Parameters<typeof transitionListing>[1],
      ),
    ).toThrow("target listing status invalid");
  });
});
