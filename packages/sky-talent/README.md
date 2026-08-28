# SkyTalent

SkyTalent is a bounded engineering-beta talent profile and deterministic matching core for SKYCOIN4444.

## Capability

- validates and normalizes talent profiles;
- deduplicates skills deterministically;
- filters by declared availability/location;
- ranks matches by simple declared-skill overlap with deterministic tie-breaking;
- emits the provider-neutral `sky.talent.match.requested.v1` contract;
- includes focused tests.

## Integration

`sky.talent.match.requested.v1` can be consumed by future jobs, mentorship, CRM, or workflow adapters after caller-side authorization and policy checks.

## Security and product boundaries

This package is advisory only. It does **not** make hiring/employment decisions, verify identity, education, employment history, credentials, background, legal work status, or skill proficiency. It has no external job board, ATS, employer, AI/model, payments, messaging, durable persistence, production deployment, anti-discrimination guarantee, or compliance certification. Callers must apply appropriate human review, authorization, privacy, accessibility, and employment-law controls and must not use the score as the sole basis for consequential decisions.
