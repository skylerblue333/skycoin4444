# SkyShop Marketplace V2 — Supplier Discovery Engineering Beta

## Goal

SkyShop V2 turns the previous marketplace-readiness shell into a usable, truthful
supplier-style commerce rehearsal. It is inspired by large multi-vendor marketplace
interaction patterns such as broad catalog discovery, MOQ/wholesale pricing, seller
trust signals, reviews, wishlists, comparison, and cart planning.

It **does not copy or scrape DHgate catalog data or customer reviews** and it does not
claim any DHgate affiliation. The current product and review data are controlled test
fixtures. A real third-party catalog must arrive through an authorized provider/API or
merchant feed with source attribution, terms compliance, moderation, and freshness
handling.

## What is implemented in this beta

- Search across product names, descriptions, categories, tags, and supplier names.
- Category browsing and deterministic sorting.
- Free-shipping, rating, MOQ, and supplier-tier filters.
- Supplier trust-signal fixtures.
- Quantity/MOQ and bulk price-break calculations.
- Sample review cards with explicit fixture-backed verified-purchase semantics.
- Local wishlist persistence.
- Four-item comparison shortlist.
- Local cart planning with quantity-aware wholesale price breaks.
- Handoff to the existing checkout-math sandbox rather than fake checkout success.
- Shared Official TRUMP public token metadata used by marketplace and server transfer
  validation so the configured mint cannot silently drift between surfaces.
- A 100-capability expansion map with explicit beta/contract/roadmap status.

## Official TRUMP payment boundary

SkyShop can expose the configured Official TRUMP Solana asset as a marketplace
**payment-planning rail**. This means the UI can identify the configured token and
prepare future integration around it.

The marketplace currently has:

- public token metadata: connected;
- token address consistency with the server registry: tested;
- price oracle: **not connected**;
- merchant invoice conversion: **not connected**;
- custody: **disabled**;
- signing: **disabled**;
- blockchain broadcast: **disabled**;
- settlement: **disabled**;
- refunds in TRUMP: **not implemented**.

Because there is no verified live price oracle or settlement provider, SkyShop must not
invent a TRUMP amount for a USD-denominated cart. Any future payment flow must obtain a
fresh quote server-side, bind it to an order/merchant/expiry, require explicit wallet
review, verify the correct mint/network/recipient/amount, and reconcile the resulting
transaction before an order can be marked paid.

This integration does not claim endorsement, partnership, issuer authorization, or
affiliation with Donald Trump, the Trump Organization, CIC Digital, Fight Fight Fight
LLC, or any issuer.

## Review integrity model

The visible reviews are **sample fixtures**, not imported reviews. A production review
service should require an auditable order reference before granting a
`verified_purchase` badge, separate review text from seller-controlled content,
moderate prohibited material, retain edit/moderation history, detect duplicate/abusive
review behavior, and prevent seller self-review.

## External supplier catalog contract

A production catalog connector should normalize provider data into an internal contract
that includes at minimum:

- source/provider and immutable source listing ID;
- seller ID and seller display metadata;
- product title/description/media rights;
- variant/SKU identifiers;
- currency and integer minor-unit price;
- MOQ and quantity tiers;
- inventory/availability timestamp;
- ships-from region and delivery service data;
- category/taxonomy mapping;
- return/dispute policy references;
- last-updated timestamp and stale-data policy.

The connector must fail closed when required data is malformed and should not create
seller verification, inventory, delivery, or buyer-protection claims that the provider
did not supply.

## 100-capability expansion map

1. **Keyword search** — `beta-surface`
2. **Category browsing** — `beta-surface`
3. **Featured ranking** — `beta-surface`
4. **Price-low sort** — `beta-surface`
5. **Price-high sort** — `beta-surface`
6. **Rating sort** — `beta-surface`
7. **Review-count sort** — `beta-surface`
8. **Price range filtering** — `beta-surface`
9. **Minimum-order filtering** — `beta-surface`
10. **Free-shipping filtering** — `beta-surface`
11. **Supplier-tier filtering** — `beta-surface`
12. **Four-star-and-up filtering** — `beta-surface`
13. **Bulk quantity tiers** — `beta-surface`
14. **MOQ display** — `beta-surface`
15. **Supplier trust signals** — `beta-surface`
16. **Sample review summaries** — `beta-surface`
17. **Sample verified-purchase labels** — `beta-surface`
18. **Wishlist persistence** — `beta-surface`
19. **Product comparison** — `beta-surface`
20. **Cart planning** — `beta-surface`
21. **Official TRUMP payment handoff** — `integration-contract`
22. **USD quote planning** — `integration-contract`
23. **Buyer-protection disclosure** — `integration-contract`
24. **No-fake-checkout guard** — `integration-contract`
25. **Catalog source labeling** — `integration-contract`
26. **Seller profile contract** — `integration-contract`
27. **Seller onboarding contract** — `integration-contract`
28. **Catalog import contract** — `integration-contract`
29. **Inventory contract** — `integration-contract`
30. **Order-state contract** — `integration-contract`
31. **Return-policy contract** — `integration-contract`
32. **Refund contract** — `integration-contract`
33. **Dispute-resolution contract** — `integration-contract`
34. **Shipment-tracking contract** — `integration-contract`
35. **Delivery-estimate contract** — `integration-contract`
36. **Tax quote contract** — `integration-contract`
37. **Promotion contract** — `integration-contract`
38. **Coupon contract** — `integration-contract`
39. **Fraud-signal contract** — `integration-contract`
40. **Audit-event contract** — `integration-contract`
41. **Image search** — `roadmap`
42. **Visual similarity search** — `roadmap`
43. **Voice search** — `roadmap`
44. **Barcode search** — `roadmap`
45. **Search suggestions** — `roadmap`
46. **Recent searches** — `roadmap`
47. **Saved searches** — `roadmap`
48. **Personalized recommendations** — `roadmap`
49. **Trending discovery** — `roadmap`
50. **Flash deals** — `roadmap`
51. **Daily deals** — `roadmap`
52. **New-arrival feed** — `roadmap`
53. **Best-seller feed** — `roadmap`
54. **Country-of-origin filter** — `roadmap`
55. **Ships-from filter** — `roadmap`
56. **Delivery-speed filter** — `roadmap`
57. **Color variants** — `roadmap`
58. **Size variants** — `roadmap`
59. **Material variants** — `roadmap`
60. **Bundle offers** — `roadmap`
61. **Tiered wholesale pricing** — `roadmap`
62. **Request-for-quote** — `roadmap`
63. **Sample-order flow** — `roadmap`
64. **Supplier chat** — `roadmap`
65. **Buyer-seller translation** — `roadmap`
66. **Product Q&A** — `roadmap`
67. **Review media** — `roadmap`
68. **Review helpful votes** — `roadmap`
69. **Review moderation** — `roadmap`
70. **Review replies** — `roadmap`
71. **Seller ratings** — `roadmap`
72. **Seller response-time metrics** — `roadmap`
73. **Seller transaction history** — `roadmap`
74. **Seller certifications** — `roadmap`
75. **Store followers** — `roadmap`
76. **Storefront themes** — `roadmap`
77. **Store coupons** — `roadmap`
78. **Store categories** — `roadmap`
79. **Cross-sell recommendations** — `roadmap`
80. **Frequently-bought-together** — `roadmap`
81. **Recently viewed** — `roadmap`
82. **Price-drop alerts** — `roadmap`
83. **Back-in-stock alerts** — `roadmap`
84. **Order notifications** — `roadmap`
85. **Shipment notifications** — `roadmap`
86. **Return notifications** — `roadmap`
87. **Multi-currency display** — `roadmap`
88. **Localized tax display** — `roadmap`
89. **Address book** — `roadmap`
90. **Gift options** — `roadmap`
91. **Business purchasing** — `roadmap`
92. **Team purchasing approvals** — `roadmap`
93. **Purchase orders** — `roadmap`
94. **Invoice downloads** — `roadmap`
95. **Bulk CSV ordering** — `roadmap`
96. **Affiliate attribution** — `roadmap`
97. **Creator storefronts** — `roadmap`
98. **Live-shopping hooks** — `roadmap`
99. **Marketplace analytics** — `roadmap`
100. **Admin risk dashboard** — `roadmap`

## Production gates

Before SkyShop can be called an active marketplace, at minimum:

1. Connect an authorized catalog/merchant source.
2. Add durable marketplace persistence with authorization.
3. Add real seller onboarding/verification appropriate to the jurisdictions served.
4. Add server-side inventory and order-state authority.
5. Add payment/settlement provider integration and reconciliation.
6. Add tax/shipping/returns/disputes handling.
7. Add review purchase-verification and moderation persistence.
8. Add fraud/abuse controls, rate limits, audit events, and observability.
9. Run accessibility, security, load, failure-mode, and end-to-end checkout tests.
10. Verify exact-head CI and deployed behavior before changing the engineering-beta label.
