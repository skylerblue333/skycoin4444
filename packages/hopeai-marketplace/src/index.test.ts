import { describe, expect, it } from 'vitest';
import { searchListings } from './index';

const listings = [
  { listingId: 'listing:a', publisherId: 'publisher:1', name: 'Reasoning Agent', priceCredits: 20n, capabilities: ['reasoning'], active: true },
  { listingId: 'listing:b', publisherId: 'publisher:2', name: 'Workflow Agent', priceCredits: 10n, capabilities: ['workflow'], active: true },
  { listingId: 'listing:c', publisherId: 'publisher:3', name: 'Inactive Agent', priceCredits: 1n, capabilities: ['reasoning'], active: false },
] as const;

describe('HopeAI marketplace', () => {
  it('filters active listings by capability and sorts by price', () => {
    expect(searchListings(listings, { capability: 'reasoning' }).map((item) => item.listingId)).toEqual(['listing:a']);
  });

  it('enforces maximum price filters', () => {
    expect(searchListings(listings, { maxPriceCredits: 15n }).map((item) => item.listingId)).toEqual(['listing:b']);
  });

  it('rejects duplicate listing ids', () => {
    expect(() => searchListings([listings[0], listings[0]], {})).toThrow('duplicate listing id');
  });

  it('rejects malformed capability queries', () => {
    expect(() => searchListings(listings, { capability: 'x' })).toThrow('capability query');
  });
});
