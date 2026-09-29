# SkyHope Controlled Engineering Beta

SkyHope is the SKYCOIN4444 impact workspace for demonstration cause discovery, non-settling pledge planning, volunteer-workflow examples, and evidence-aware impact design.

## What is implemented

- A server-owned demonstration campaign catalog with explicit fund-use plans and planned impact metrics.
- Category filtering and campaign progress UX.
- An authenticated pledge planner that validates campaign, amount, supporter identity, and idempotency input through the existing fundraising domain core.
- A volunteer-opportunity example catalog that explicitly requires a verified local coordinator before becoming live.
- A shared API boundary that tells the client which external capabilities are not enabled.
- First-class navigation from the global beta header and voice-navigation vocabulary.
- Unit and release-contract coverage.

## What the pledge planner does

The planner returns contract skyhope.pledge-plan.v1. It can accept or reject a support intent and calculate a projected demonstration total.

It does not collect a payment, persist a donation, issue a receipt, move a token, hold custody, broadcast a blockchain transaction, verify a beneficiary/nonprofit, or prove an external impact outcome.

## Promotion gate for real donations

Before real donation execution is exposed, a separate provider-backed release must verify beneficiary status, legal and regional policy, provider configuration, amount/currency handling, idempotency, receipt behavior, refunds/disputes, privacy and retention, failure/recovery behavior, monitoring, support ownership, exact-head CI, and deployed environment evidence.

Until that evidence exists, product copy must continue to call SkyHope a controlled engineering beta and demonstration catalog.
