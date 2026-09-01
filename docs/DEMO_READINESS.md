# SKYCOIN4444 Demo Readiness

Status: **engineering-beta demo candidate**

This document defines what can be demonstrated from the repository without overstating production readiness.

## Verified repository gates

The canonical CI workflow must pass before a demo-readiness change is merged. The gate includes TypeScript checks, package typecheck, canonical lint, credential-pattern scanning, engineering-beta marker audit, unit/package tests, engineering-beta integration tests, production build, and high-severity production dependency audit.

## Recommended demo path

1. Open the application shell and explain that SKYCOIN4444 is an engineering-beta platform.
2. Demonstrate the authored learning experience through Course Catalog: browse a track, inspect lesson objectives and summaries, answer an assessment, and mark a lesson complete. Progress in this surface is session-local unless a server-backed learner record is explicitly configured and verified.
3. Demonstrate Arcade Lab: use the local deterministic game experiences and distinguish them from the pre-existing routed game surfaces. Do not describe simulations as real-money wagering or blockchain settlement.
4. Demonstrate Dating Profile Setup: enter profile data, exercise validation, choose interests, add local image previews, and save the draft for the browser session. This does not claim durable server persistence, identity verification, production matchmaking, or uploaded photo storage.
5. Show CI evidence and explain that build/test success is repository evidence, not proof of a deployed production service.

## Demo truth boundaries

The demo must not claim any of the following unless separately configured and verified with external evidence:

- production deployment or uptime;
- durable database persistence across all product surfaces;
- live payment execution, banking, wagering, token payouts, or custody;
- blockchain transaction settlement;
- production multiplayer infrastructure;
- external identity/KYC verification;
- regulatory or compliance certification;
- production AI/model-provider connectivity;
- production cloud resources or security guarantees.

## Demo acceptance checklist

A demo candidate is acceptable when:

- canonical CI is green at the exact PR head;
- the production build gate succeeds;
- the learning, gaming, and dating-profile regression/integration tests pass;
- user-visible beta limitations remain explicit;
- no failing gate is bypassed for merge.

## Current scope

This readiness contract covers the recently verified learning/gaming and dating-profile demo flows. It does **not** certify every historical page or product in the wider repository as production-ready.
