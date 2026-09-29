# SkyHope Impact Mission Control

SKYCOIN4444 now has a cross-product impact workflow that connects HopeAI, charity, education, social, gaming, and the global route/navigation layer without pretending that planning or local beta activity proves a real-world outcome.

## Product path

The new primary route is:

- `/impact-hub` — Impact Mission Control

A mission can intentionally move through:

1. **HopeAI** — structure goals, questions, risks, evidence, and next actions;
2. **SkySchool** — learn before asking other people to act;
3. **Social** — prepare a truthful community update and volunteer call;
4. **Gaming for Charity** — use demo-only game challenges for awareness/learning;
5. **SkyHope / Charity** — review beneficiary, evidence, provider, legal, and finance boundaries.

The top-level beta navigation now promotes HopeAI, Impact, and School directly. The SkyHope & Impact experience area uses the Impact Hub as its parent route so breadcrumb and area navigation lead users through the connected workflow rather than dropping them into scattered legacy screens.

## HopeAI mission planning

`server/features/impact-missions` adds a bounded HopeAI impact-coach contract. It creates a multi-specialist planning brief for:

- mission planning;
- teaching/learning;
- community coordination;
- impact analysis;
- safety review.

The planner asks for ordered actions, a learning checklist, a community draft, an evidence checklist, and risk/dependency notes.

The module does **not** call an AI provider itself. The generated brief is intended for the HopeAI workspace and remains marked `providerExecutionRequired: true` and `aiCallPerformed: false`.

This intentionally does not overlap the active HopeAI agent-runtime PR. The mission layer is a complementary domain contract and route/workflow surface.

## Charity and donation depth

The impact mission engine adds charity-readiness checks for:

- beneficiary verification;
- evidence-plan presence;
- finance-policy approval when money is requested;
- approved external-provider handoff when money is requested.

The existing `@skycoin/sky-donations` domain core was expanded with:

- idempotent local pledge orchestration;
- replay of identical pledge requests;
- conflict rejection when an idempotency key is reused with changed money/input;
- campaign-isolated listing;
- explicit record/cancel lifecycle;
- bounded in-memory snapshots;
- donation acknowledgements that explicitly state:
  - SKYCOIN4444 did not execute payment;
  - settlement is not verified;
  - the acknowledgement is not a tax receipt.

The donation ledger is a process-memory engineering-beta primitive, not durable payment accounting.

## Education depth

`@skycoin/sky-question-bank` now supports:

- deterministic seeded quiz-session construction;
- bounded tag-filtered question pools;
- public quiz payloads with answer keys removed;
- session grading against trusted caller-supplied question definitions;
- duplicate-submission and out-of-session rejection;
- review queues for missed questions.

A quiz score is not a credential, certification, or external proof of mastery.

## Social impact workflow

Impact Mission Control can generate a community share draft and route the user into the existing Social experience.

The draft is deliberately marked as a draft:

- it is not auto-posted;
- it does not invent views, volunteers, donors, reach, or engagement;
- it does not claim a donation or completed external outcome.

The active Facebook-style Social PR remains separately owned and is not overwritten by this work.

## Games for impact

The impact mission engine can create a bounded game challenge against approved demo-game routes. A challenge can define:

- a game route;
- a target score;
- an educational/reflection prompt.

Every challenge states:

- `financialReward: false`;
- `wagerCreated: false`;
- `donationTriggered: false`.

The existing Gaming for Charity page now routes into Impact Mission Control so users can build the wider mission before entering the demo challenge.

## Evidence model

Local mission evidence can be recorded as:

- learning completion;
- volunteer confirmation;
- community response;
- game score;
- donation record;
- external reference.

Evidence records retain their trust source but are always `externallyVerified: false` inside this domain core. The mission dashboard will not upgrade local records into verified external impact or financial settlement.

## Truth boundaries

This upgrade does not claim:

- live AI provider execution from the mission planner;
- autonomous background agents;
- beneficiary verification;
- card/payment processing;
- donation settlement;
- tax-receipt issuance;
- custody or blockchain settlement;
- social auto-posting;
- real-money wagering or game payouts;
- educational accreditation;
- externally verified impact;
- compliance certification or production certification.

Those claims require their own providers, authorization, durable evidence, deployment, and review gates.
