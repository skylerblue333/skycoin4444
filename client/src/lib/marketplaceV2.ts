import { OFFICIAL_TRUMP_PUBLIC_ASSET } from "../../../shared/officialTrump";

export type MarketplaceCategory =
  | "Electronics"
  | "Home"
  | "Beauty"
  | "Fashion"
  | "Auto"
  | "Sports"
  | "Toys"
  | "Tools";

export type SupplierTier = "demo-verified" | "new-supplier";
export type MarketplaceSort =
  | "featured"
  | "price-low"
  | "price-high"
  | "rating"
  | "reviews";

export type MarketplaceProduct = {
  sku: string;
  name: string;
  category: MarketplaceCategory;
  description: string;
  unitAmountMinor: number;
  minOrder: number;
  rating: number;
  reviewCount: number;
  trendScore: number;
  freeShipping: boolean;
  shipsFrom: string;
  supplier: {
    name: string;
    tier: SupplierTier;
    years: number;
    responseRate: number;
  };
  bulkTiers: ReadonlyArray<{ minQty: number; unitAmountMinor: number }>;
  tags: readonly string[];
  source: "demo-fixture";
};

export type MarketplaceReviewFixture = {
  id: string;
  sku: string;
  rating: number;
  title: string;
  body: string;
  verifiedPurchase: true;
  verificationMode: "demo-fixture";
  helpfulCount: number;
};

export type MarketplaceFilters = {
  query?: string;
  category?: MarketplaceCategory | "All";
  sort?: MarketplaceSort;
  minPriceMinor?: number;
  maxPriceMinor?: number;
  maxMinOrder?: number;
  freeShippingOnly?: boolean;
  fourStarsOnly?: boolean;
  supplierTier?: SupplierTier | "all";
};

export type MarketplaceCapabilityStatus =
  | "beta-surface"
  | "integration-contract"
  | "roadmap";

export type MarketplaceCapability = {
  id: string;
  name: string;
  status: MarketplaceCapabilityStatus;
};

export const marketplaceDemoProducts: readonly MarketplaceProduct[] = [
  {
    "sku": "DEMO-WIRELESS-EARBUDS",
    "name": "Wireless earbuds with charging case",
    "category": "Electronics",
    "description": "Supplier-style electronics fixture for discovery, bulk-tier, review, and comparison testing.",
    "unitAmountMinor": 1899,
    "minOrder": 1,
    "rating": 4.6,
    "reviewCount": 48,
    "trendScore": 98,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Nova Audio Supply",
      "tier": "demo-verified",
      "years": 6,
      "responseRate": 97
    },
    "bulkTiers": [
      {
        "minQty": 1,
        "unitAmountMinor": 1899
      },
      {
        "minQty": 10,
        "unitAmountMinor": 1699
      },
      {
        "minQty": 50,
        "unitAmountMinor": 1499
      }
    ],
    "tags": [
      "audio",
      "mobile",
      "gift"
    ]
  },
  {
    "sku": "DEMO-MINI-PROJECTOR",
    "name": "Portable mini projector",
    "category": "Electronics",
    "description": "Compact home-entertainment fixture with quantity tiers and sample buyer feedback.",
    "unitAmountMinor": 4599,
    "minOrder": 1,
    "rating": 4.5,
    "reviewCount": 34,
    "trendScore": 94,
    "freeShipping": false,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Pixel Harbor",
      "tier": "demo-verified",
      "years": 8,
      "responseRate": 96
    },
    "bulkTiers": [
      {
        "minQty": 1,
        "unitAmountMinor": 4599
      },
      {
        "minQty": 5,
        "unitAmountMinor": 4299
      },
      {
        "minQty": 20,
        "unitAmountMinor": 3999
      }
    ],
    "tags": [
      "projector",
      "home",
      "video"
    ]
  },
  {
    "sku": "DEMO-LED-STRIP",
    "name": "Smart RGB LED strip kit",
    "category": "Home",
    "description": "Home-lighting fixture for category discovery, shipping filters, and review summaries.",
    "unitAmountMinor": 1299,
    "minOrder": 2,
    "rating": 4.7,
    "reviewCount": 63,
    "trendScore": 97,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "BrightNest Supply",
      "tier": "demo-verified",
      "years": 5,
      "responseRate": 98
    },
    "bulkTiers": [
      {
        "minQty": 2,
        "unitAmountMinor": 1299
      },
      {
        "minQty": 20,
        "unitAmountMinor": 1099
      },
      {
        "minQty": 100,
        "unitAmountMinor": 899
      }
    ],
    "tags": [
      "lighting",
      "smart-home",
      "decor"
    ]
  },
  {
    "sku": "DEMO-MASSAGE-GUN",
    "name": "Compact percussion massager",
    "category": "Sports",
    "description": "Fitness-recovery fixture with supplier trust, MOQ, and bulk pricing interactions.",
    "unitAmountMinor": 3299,
    "minOrder": 1,
    "rating": 4.4,
    "reviewCount": 29,
    "trendScore": 88,
    "freeShipping": false,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Motion Peak",
      "tier": "new-supplier",
      "years": 2,
      "responseRate": 92
    },
    "bulkTiers": [
      {
        "minQty": 1,
        "unitAmountMinor": 3299
      },
      {
        "minQty": 10,
        "unitAmountMinor": 2999
      },
      {
        "minQty": 40,
        "unitAmountMinor": 2699
      }
    ],
    "tags": [
      "fitness",
      "recovery",
      "gym"
    ]
  },
  {
    "sku": "DEMO-MAKEUP-BRUSH",
    "name": "Professional makeup brush set",
    "category": "Beauty",
    "description": "Beauty fixture for supplier catalog, review, wishlist, and wholesale-tier rehearsal.",
    "unitAmountMinor": 1599,
    "minOrder": 3,
    "rating": 4.8,
    "reviewCount": 71,
    "trendScore": 95,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Luma Beauty Works",
      "tier": "demo-verified",
      "years": 7,
      "responseRate": 99
    },
    "bulkTiers": [
      {
        "minQty": 3,
        "unitAmountMinor": 1599
      },
      {
        "minQty": 25,
        "unitAmountMinor": 1399
      },
      {
        "minQty": 100,
        "unitAmountMinor": 1199
      }
    ],
    "tags": [
      "beauty",
      "brushes",
      "cosmetics"
    ]
  },
  {
    "sku": "DEMO-NAIL-LAMP",
    "name": "USB UV nail lamp",
    "category": "Beauty",
    "description": "Salon-accessory fixture with sample ratings, quantity breaks, and shipping flags.",
    "unitAmountMinor": 1099,
    "minOrder": 2,
    "rating": 4.3,
    "reviewCount": 25,
    "trendScore": 81,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Studio Glow",
      "tier": "new-supplier",
      "years": 3,
      "responseRate": 90
    },
    "bulkTiers": [
      {
        "minQty": 2,
        "unitAmountMinor": 1099
      },
      {
        "minQty": 20,
        "unitAmountMinor": 949
      },
      {
        "minQty": 80,
        "unitAmountMinor": 799
      }
    ],
    "tags": [
      "beauty",
      "nails",
      "salon"
    ]
  },
  {
    "sku": "DEMO-HOODIE",
    "name": "Heavyweight blank hoodie",
    "category": "Fashion",
    "description": "Unbranded apparel fixture designed for variant, wholesale, and creator-merch workflows.",
    "unitAmountMinor": 2299,
    "minOrder": 5,
    "rating": 4.6,
    "reviewCount": 39,
    "trendScore": 90,
    "freeShipping": false,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Thread District",
      "tier": "demo-verified",
      "years": 9,
      "responseRate": 95
    },
    "bulkTiers": [
      {
        "minQty": 5,
        "unitAmountMinor": 2299
      },
      {
        "minQty": 30,
        "unitAmountMinor": 1999
      },
      {
        "minQty": 120,
        "unitAmountMinor": 1699
      }
    ],
    "tags": [
      "fashion",
      "hoodie",
      "merch"
    ]
  },
  {
    "sku": "DEMO-SNEAKERS",
    "name": "Lightweight casual sneakers",
    "category": "Fashion",
    "description": "Generic footwear fixture for comparison, review filtering, and supplier discovery.",
    "unitAmountMinor": 2799,
    "minOrder": 2,
    "rating": 4.4,
    "reviewCount": 31,
    "trendScore": 86,
    "freeShipping": false,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Urban Step Supply",
      "tier": "new-supplier",
      "years": 4,
      "responseRate": 93
    },
    "bulkTiers": [
      {
        "minQty": 2,
        "unitAmountMinor": 2799
      },
      {
        "minQty": 15,
        "unitAmountMinor": 2499
      },
      {
        "minQty": 60,
        "unitAmountMinor": 2199
      }
    ],
    "tags": [
      "fashion",
      "shoes",
      "casual"
    ]
  },
  {
    "sku": "DEMO-CAR-DASHCAM",
    "name": "1080p compact dash camera",
    "category": "Auto",
    "description": "Automotive electronics fixture for search, sorting, seller signals, and bulk quotes.",
    "unitAmountMinor": 3699,
    "minOrder": 1,
    "rating": 4.5,
    "reviewCount": 42,
    "trendScore": 92,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "RoadLink Tech",
      "tier": "demo-verified",
      "years": 6,
      "responseRate": 97
    },
    "bulkTiers": [
      {
        "minQty": 1,
        "unitAmountMinor": 3699
      },
      {
        "minQty": 8,
        "unitAmountMinor": 3399
      },
      {
        "minQty": 30,
        "unitAmountMinor": 3099
      }
    ],
    "tags": [
      "auto",
      "camera",
      "safety"
    ]
  },
  {
    "sku": "DEMO-TOOL-SET",
    "name": "Precision screwdriver tool kit",
    "category": "Tools",
    "description": "Repair-tool fixture with MOQ, supplier history, sample ratings, and quantity pricing.",
    "unitAmountMinor": 1399,
    "minOrder": 2,
    "rating": 4.7,
    "reviewCount": 54,
    "trendScore": 93,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "FixCraft Supply",
      "tier": "demo-verified",
      "years": 10,
      "responseRate": 98
    },
    "bulkTiers": [
      {
        "minQty": 2,
        "unitAmountMinor": 1399
      },
      {
        "minQty": 25,
        "unitAmountMinor": 1199
      },
      {
        "minQty": 100,
        "unitAmountMinor": 999
      }
    ],
    "tags": [
      "tools",
      "repair",
      "electronics"
    ]
  },
  {
    "sku": "DEMO-BUILDING-BLOCKS",
    "name": "STEM building block kit",
    "category": "Toys",
    "description": "Educational toy fixture for catalog search, review previews, and bundle planning.",
    "unitAmountMinor": 1999,
    "minOrder": 2,
    "rating": 4.8,
    "reviewCount": 57,
    "trendScore": 96,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Bright Minds Factory",
      "tier": "demo-verified",
      "years": 8,
      "responseRate": 99
    },
    "bulkTiers": [
      {
        "minQty": 2,
        "unitAmountMinor": 1999
      },
      {
        "minQty": 20,
        "unitAmountMinor": 1799
      },
      {
        "minQty": 80,
        "unitAmountMinor": 1599
      }
    ],
    "tags": [
      "toys",
      "stem",
      "education"
    ]
  },
  {
    "sku": "DEMO-YOGA-MAT",
    "name": "Textured non-slip yoga mat",
    "category": "Sports",
    "description": "Fitness fixture for supplier discovery, free-shipping filtering, and cart planning.",
    "unitAmountMinor": 1799,
    "minOrder": 3,
    "rating": 4.5,
    "reviewCount": 36,
    "trendScore": 84,
    "freeShipping": true,
    "shipsFrom": "Demo warehouse",
    "supplier": {
      "name": "Core Balance Goods",
      "tier": "new-supplier",
      "years": 3,
      "responseRate": 91
    },
    "bulkTiers": [
      {
        "minQty": 3,
        "unitAmountMinor": 1799
      },
      {
        "minQty": 24,
        "unitAmountMinor": 1599
      },
      {
        "minQty": 96,
        "unitAmountMinor": 1399
      }
    ],
    "tags": [
      "sports",
      "yoga",
      "fitness"
    ]
  }
].map(product => ({
  ...product,
  category: product.category as MarketplaceCategory,
  supplier: {
    ...product.supplier,
    tier: product.supplier.tier as SupplierTier,
  },
  source: "demo-fixture" as const,
}));

const reviewSeeds = [
  [
    "DEMO-WIRELESS-EARBUDS",
    5,
    "Good demo fit and finish",
    "The review fixture shows how a verified-purchase badge and useful detail would render."
  ],
  [
    "DEMO-WIRELESS-EARBUDS",
    4,
    "Useful bulk-price preview",
    "Quantity breaks are easy to understand in the demo flow."
  ],
  [
    "DEMO-MINI-PROJECTOR",
    5,
    "Clear comparison experience",
    "The sample review panel makes it easy to compare rating context."
  ],
  [
    "DEMO-MINI-PROJECTOR",
    4,
    "Shipping disclosure is clear",
    "I like that delivery claims are labeled as demo-only."
  ],
  [
    "DEMO-LED-STRIP",
    5,
    "Strong category fixture",
    "Search and free-shipping filters behave predictably."
  ],
  [
    "DEMO-LED-STRIP",
    4,
    "Good wholesale rehearsal",
    "MOQ and tier prices are presented clearly."
  ],
  [
    "DEMO-MASSAGE-GUN",
    4,
    "Trust signals stand out",
    "The supplier tier and response-rate fields are useful in the demo."
  ],
  [
    "DEMO-MASSAGE-GUN",
    5,
    "Comparison works well",
    "The product is easy to save and compare with another fixture."
  ],
  [
    "DEMO-MAKEUP-BRUSH",
    5,
    "Review layout is readable",
    "Verified-purchase semantics are obvious without claiming a real order."
  ],
  [
    "DEMO-MAKEUP-BRUSH",
    5,
    "Good supplier-style flow",
    "Bulk tiers and saved items make the demo feel like a serious marketplace."
  ],
  [
    "DEMO-NAIL-LAMP",
    4,
    "Simple and clear",
    "The filters make this fixture easy to find."
  ],
  [
    "DEMO-NAIL-LAMP",
    4,
    "Helpful sample feedback",
    "The review text is clearly marked as a fixture."
  ],
  [
    "DEMO-HOODIE",
    5,
    "Wholesale controls are useful",
    "MOQ and large-quantity pricing are the strongest parts of this rehearsal."
  ],
  [
    "DEMO-HOODIE",
    4,
    "Merch workflow potential",
    "Good foundation for variants and creator stores later."
  ],
  [
    "DEMO-SNEAKERS",
    4,
    "Good comparison card",
    "Seller and rating context are compact and useful."
  ],
  [
    "DEMO-SNEAKERS",
    5,
    "Easy to shortlist",
    "Wishlist and comparison behavior make sense."
  ],
  [
    "DEMO-CAR-DASHCAM",
    5,
    "Good trust presentation",
    "Supplier years and response rate give the demo useful decision context."
  ],
  [
    "DEMO-CAR-DASHCAM",
    4,
    "Clear payment boundary",
    "The page does not pretend a crypto payment settled."
  ],
  [
    "DEMO-TOOL-SET",
    5,
    "Excellent filter rehearsal",
    "Search, rating, and shipping controls are easy to test."
  ],
  [
    "DEMO-TOOL-SET",
    5,
    "Bulk tiers are obvious",
    "The unit price changes deterministically with quantity."
  ],
  [
    "DEMO-BUILDING-BLOCKS",
    5,
    "Strong discovery demo",
    "The product and review fixtures are transparent and useful."
  ],
  [
    "DEMO-BUILDING-BLOCKS",
    4,
    "Good educational category",
    "This is a clear example of a supplier-style catalog item."
  ],
  [
    "DEMO-YOGA-MAT",
    4,
    "Good shipping filter",
    "Free-shipping behavior is easy to verify."
  ],
  [
    "DEMO-YOGA-MAT",
    5,
    "Clean cart planning",
    "The demo quote path is clearly separate from real checkout."
  ]
] as const;

export const marketplaceReviewFixtures: readonly MarketplaceReviewFixture[] =
  reviewSeeds.map((review, index) => ({
    id: `fixture-review-${String(index + 1).padStart(3, "0")}`,
    sku: review[0],
    rating: review[1],
    title: review[2],
    body: review[3],
    verifiedPurchase: true,
    verificationMode: "demo-fixture",
    helpfulCount: (index * 7) % 23,
  }));

const capabilityNames = [
  "Keyword search",
  "Category browsing",
  "Featured ranking",
  "Price-low sort",
  "Price-high sort",
  "Rating sort",
  "Review-count sort",
  "Price range filtering",
  "Minimum-order filtering",
  "Free-shipping filtering",
  "Supplier-tier filtering",
  "Four-star-and-up filtering",
  "Bulk quantity tiers",
  "MOQ display",
  "Supplier trust signals",
  "Sample review summaries",
  "Sample verified-purchase labels",
  "Wishlist persistence",
  "Product comparison",
  "Cart planning",
  "Official TRUMP payment handoff",
  "USD quote planning",
  "Buyer-protection disclosure",
  "No-fake-checkout guard",
  "Catalog source labeling",
  "Seller profile contract",
  "Seller onboarding contract",
  "Catalog import contract",
  "Inventory contract",
  "Order-state contract",
  "Return-policy contract",
  "Refund contract",
  "Dispute-resolution contract",
  "Shipment-tracking contract",
  "Delivery-estimate contract",
  "Tax quote contract",
  "Promotion contract",
  "Coupon contract",
  "Fraud-signal contract",
  "Audit-event contract",
  "Image search",
  "Visual similarity search",
  "Voice search",
  "Barcode search",
  "Search suggestions",
  "Recent searches",
  "Saved searches",
  "Personalized recommendations",
  "Trending discovery",
  "Flash deals",
  "Daily deals",
  "New-arrival feed",
  "Best-seller feed",
  "Country-of-origin filter",
  "Ships-from filter",
  "Delivery-speed filter",
  "Color variants",
  "Size variants",
  "Material variants",
  "Bundle offers",
  "Tiered wholesale pricing",
  "Request-for-quote",
  "Sample-order flow",
  "Supplier chat",
  "Buyer-seller translation",
  "Product Q&A",
  "Review media",
  "Review helpful votes",
  "Review moderation",
  "Review replies",
  "Seller ratings",
  "Seller response-time metrics",
  "Seller transaction history",
  "Seller certifications",
  "Store followers",
  "Storefront themes",
  "Store coupons",
  "Store categories",
  "Cross-sell recommendations",
  "Frequently-bought-together",
  "Recently viewed",
  "Price-drop alerts",
  "Back-in-stock alerts",
  "Order notifications",
  "Shipment notifications",
  "Return notifications",
  "Multi-currency display",
  "Localized tax display",
  "Address book",
  "Gift options",
  "Business purchasing",
  "Team purchasing approvals",
  "Purchase orders",
  "Invoice downloads",
  "Bulk CSV ordering",
  "Affiliate attribution",
  "Creator storefronts",
  "Live-shopping hooks",
  "Marketplace analytics",
  "Admin risk dashboard"
] as const;

export const MARKETPLACE_CAPABILITIES: readonly MarketplaceCapability[] =
  capabilityNames.map((name, index) => ({
    id: `market-${String(index + 1).padStart(3, "0")}`,
    name,
    status:
      index < 20
        ? "beta-surface"
        : index < 40
          ? "integration-contract"
          : "roadmap",
  }));

export const OFFICIAL_TRUMP_MARKETPLACE_PAYMENT = Object.freeze({
  type: "sky.marketplace.crypto-payment-option.v1",
  asset: OFFICIAL_TRUMP_PUBLIC_ASSET,
  status: "integration-contract",
  priceOracleConnected: false,
  settlementEnabled: false,
  custodyEnabled: false,
  signingEnabled: false,
  broadcastEnabled: false,
  walletSignatureRequired: true,
  affiliationClaimed: false,
} as const);

export function filterMarketplaceProducts(
  products: readonly MarketplaceProduct[],
  filters: MarketplaceFilters
): MarketplaceProduct[] {
  const query = (filters.query ?? "").trim().toLowerCase();
  const category = filters.category ?? "All";
  const sort = filters.sort ?? "featured";
  const minPrice = Number.isSafeInteger(filters.minPriceMinor)
    ? Math.max(0, filters.minPriceMinor as number)
    : 0;
  const maxPrice = Number.isSafeInteger(filters.maxPriceMinor)
    ? Math.max(minPrice, filters.maxPriceMinor as number)
    : Number.MAX_SAFE_INTEGER;
  const maxMinOrder = Number.isSafeInteger(filters.maxMinOrder)
    ? Math.max(1, filters.maxMinOrder as number)
    : Number.MAX_SAFE_INTEGER;

  const filtered = products.filter(product => {
    const searchable = [
      product.name,
      product.description,
      product.category,
      product.supplier.name,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (category === "All" || product.category === category) &&
      product.unitAmountMinor >= minPrice &&
      product.unitAmountMinor <= maxPrice &&
      product.minOrder <= maxMinOrder &&
      (!filters.freeShippingOnly || product.freeShipping) &&
      (!filters.fourStarsOnly || product.rating >= 4) &&
      (!filters.supplierTier ||
        filters.supplierTier === "all" ||
        product.supplier.tier === filters.supplierTier)
    );
  });

  return [...filtered].sort((a, b) => {
    if (sort === "price-low") return a.unitAmountMinor - b.unitAmountMinor;
    if (sort === "price-high") return b.unitAmountMinor - a.unitAmountMinor;
    if (sort === "rating") return b.rating - a.rating || b.reviewCount - a.reviewCount;
    if (sort === "reviews") return b.reviewCount - a.reviewCount || b.rating - a.rating;
    return b.trendScore - a.trendScore || b.rating - a.rating;
  });
}

export function unitPriceForQuantity(
  product: MarketplaceProduct,
  quantity: number
): number {
  const safeQuantity =
    Number.isSafeInteger(quantity) && quantity > 0
      ? quantity
      : product.minOrder;

  return [...product.bulkTiers]
    .sort((a, b) => a.minQty - b.minQty)
    .reduce(
      (amount, tier) =>
        safeQuantity >= tier.minQty ? tier.unitAmountMinor : amount,
      product.unitAmountMinor
    );
}

export function reviewFixturesForProduct(
  sku: string
): MarketplaceReviewFixture[] {
  return marketplaceReviewFixtures.filter(review => review.sku === sku);
}

export function marketplaceReviewSummary(sku: string) {
  const reviews = reviewFixturesForProduct(sku);
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  return {
    fixtureCount: reviews.length,
    average: Number(average.toFixed(2)),
    verifiedFixtureCount: reviews.filter(review => review.verifiedPurchase).length,
  };
}

export function marketplaceCapabilityCounts() {
  return MARKETPLACE_CAPABILITIES.reduce(
    (counts, capability) => {
      counts[capability.status] += 1;
      return counts;
    },
    {
      "beta-surface": 0,
      "integration-contract": 0,
      roadmap: 0,
    } as Record<MarketplaceCapabilityStatus, number>
  );
}
