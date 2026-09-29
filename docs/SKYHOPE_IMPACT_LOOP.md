# SkyHope Impact Loop

## Purpose

SkyHope is the charity/community-impact area of the SKYCOIN4444 engineering beta.

This release replaces the old charity surface that visually implied token donations, DAO allocation, named external partnerships, donor rankings, and on-chain verification. The canonical charity namespace now exposes a bounded impact-mission and finance-readiness policy API instead of fake donation execution.

The current product intentionally does something smaller and real: it helps a user create a bounded action plan, keep device-local commitments, move between learning/gaming/HopeAI surfaces, and understand what evidence would be needed before a real-world impact claim could be made.

## Delivered

- packaged personal impact programs for shelter support, learning access, community technology, and disaster readiness;
- server-backed impact missions spanning SkySchool, HopeAI, games, and creator workflows;
- server-side finance readiness evaluation that remains provider-handoff-only and never executes value;
- deterministic action-plan generation with bounded volunteer-hour and supply-kit inputs;
- device-local commitment persistence on the Charity/SkyHope page;
- removal of synthetic donor leaderboards, live-donation feeds, regional totals, and beneficiary counts from legacy charity routes;
- explicit evidence checklists and verification boundaries;
- cross-area SkyHope rails in SkySchool, Gaming, and Gaming for Charity;
- first-class SkyHope and School links in the shared beta navigation;
- release-contract tests that prevent a return to fake donation/on-chain claims.

## HopeAI boundary

SkyHope links users into HopeAI as a coaching surface. This release does not claim that HopeAI has verified an external organization, legal status, emergency guidance, beneficiary identity, donation receipt, or measured outcome.

The active HopeAI agent/tool implementation is developed separately. SkyHope therefore avoids coupling its correctness to unmerged provider/tool work.

## Financial boundary

This release does not execute:

- donations;
- payment settlement;
- token transfers;
- custody;
- blockchain writes;
- tax receipts;
- charity disbursements;
- real-money wagering;
- redeemable game rewards.

A future financial integration must use verified beneficiaries, approved providers, auditable receipts/idempotency, failure/refund behavior, and applicable legal/compliance gates before the UI may describe money as moved.

## Evidence boundary

A plan or browser-local commitment is not impact evidence.

Real-world claims require evidence appropriate to the activity, such as a public organization contact, dated volunteer record, approved receipt/confirmation, authored resource, or official public-agency source. Sensitive recipient data should not be copied into SKYCOIN4444 merely to make the dashboard look complete.
