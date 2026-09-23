# Official TRUMP Crypto Capability Matrix

SKYCOIN4444 designates the configured Official TRUMP asset as its primary supported external crypto asset for the engineering beta. This document expands that integration into a **120-capability engineering matrix** across asset identity, wallets, transactions, custody, trading, payments, compliance, accounting, treasury, consumer/social use cases, operations, and cross-chain integration.

The machine-readable source of truth is `server/features/tokenRegistry/officialTrumpCapabilities.ts`.

## Status model

- **implemented_contract** — deterministic metadata or validation logic exists in the repository.
- **engineering_planned** — SKYCOIN4444 can build the software contract, planner, policy engine, or read model, but it is not a live external service.
- **provider_required** — a real external wallet, chain, exchange, custodian, banking/payment, identity, compliance, pricing, or infrastructure provider is required before the capability can be called live.
- **authority_required** — the status can only be created by an external legal/regulatory/governmental or contractual authority.

Availability is separately marked as read-only, planning-only, gated, or external-only.

## 120-capability scope

The matrix contains twelve categories with ten capabilities each:

1. Asset identity and provenance
2. Wallets and keys
3. Transactions and network execution
4. Custody and security
5. Trading and liquidity
6. Payments and settlement
7. Compliance and legal status
8. Accounting and tax data
9. Treasury and enterprise operations
10. Consumer and social crypto experiences
11. Reliability and operations
12. Cross-chain and ecosystem integration

It explicitly includes the requested areas: **legal-tender status, custody, live transaction broadcasting, settlement, and automated trading**, plus 115 additional capability records.

## Truth boundaries

The capability matrix is a roadmap and integration contract, not a declaration that every item is live. In particular:

- SKYCOIN4444 cannot make an asset legal tender by changing application code.
- Regulatory approval or licensing cannot be claimed until the relevant authority actually grants it.
- Issuer partnership or endorsement cannot be claimed without a real documented agreement or authorization.
- Custody requires real key ownership, operational controls, legal/compliance review, security architecture, recovery procedures, and usually external providers.
- Live broadcasting requires approved chain/RPC infrastructure plus user authorization, transaction monitoring, incident controls, and production evidence.
- Settlement requires real counterparties, accounts, reconciliation, agreements, and operational controls.
- Automated trading requires explicit user authorization, live venues, market data, strategy constraints, monitoring, kill switches, and legal review.

The current engineering beta therefore keeps live side effects disabled. The existing implemented boundary remains metadata, deterministic validation, and unsigned transfer-intent planning.

## Activation rule

A capability should move from planned/gated to live only when exact implementation, provider configuration, security review, legal/compliance requirements, monitoring, rollback, and production evidence exist for that capability. The capability matrix is designed so these states cannot be silently conflated.


## External source provenance and product-use policy

`officialTrumpEcosystemPolicy.ts` adds a reviewed external-source directory for the official project website, terms, Coin Club terms, reward information, market/ecosystem updates, and Coin Club. Every entry is marked external and carries a review date; these links do not create or imply a SKYCOIN4444 partnership or issuer authority.

The same policy layer separates neutral product use from prohibited use. Asset discovery, portfolio tracking, wallet safety, market information, community discussion, creator content, commerce handoff, education, and developer integration are permitted only when the capability matrix's provider/authority gates are also satisfied. Price manipulation, political persuasion, coordinated inauthentic amplification, and issuer impersonation are explicitly blocked.

This policy does not turn provider-required or authority-required capabilities into implemented services. Live external side effects remain disabled.
