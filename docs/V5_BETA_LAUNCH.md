# SKYCOIN4444 V5 Engineering Beta Launch

## Launch channel

SKYCOIN4444 V5 is released as an **engineering beta**. The canonical application source is the protected `main` branch of `skylerblue333/skycoin4444`.

Primary hosted beta service:

- Railway service: `skycoin4444-beta-v5`
- Public origin: `https://skycoin4444-beta-v5-production.up.railway.app`
- Health/readiness contract: `/api/beta/readiness`

## Exact-release verification

A deployment is current only when all of the following are true:

1. protected `main` contains the intended merge;
2. the repository `validate` workflow is green for that exact `main` SHA;
3. Railway reports a terminal `SUCCESS` deployment for the V5 service;
4. the Railway deployment `commitHash` matches protected `main`;
5. `/api/beta/readiness` returns HTTP 200 and reports the same platform-injected `RAILWAY_GIT_COMMIT_SHA` through `releaseSha` with `releaseSource: "railway"`.

Do not call an old successful deployment current simply because the service is healthy.

## V5 product surface

The V5 hub promotes ten coherent flagship platform areas with product-first navigation, search, recents, favorites, and route-validated quick actions. Guided V4/V5 demo continuity and browser-local tester review remain available for structured evaluation.

The tester scorecard is the source of subjective quality feedback across clarity, usefulness, polish, trust, and return intent. A 10/10 score is a tester outcome, not a release label or engineering self-certification.

## Truth boundaries

The engineering beta does **not** by itself certify or imply:

- production readiness or availability guarantees;
- real-money settlement, banking, custody, or payment execution;
- live blockchain signing, broadcast, or asset custody;
- regulatory, KYC/AML, identity, privacy, or security certification;
- provider-backed AI where an external model/provider is not explicitly configured;
- accreditation, verified mastery, adoption, revenue, traffic, or market value.

Capabilities that are simulated, deterministic, browser-local, account-owned, or integration-contract-only must continue to be labeled as such.

## Launch rule

Merge only with exact-head CI green. After merge, verify protected `main`, post-merge CI, Railway deployment SHA, and readiness before recording the release as current.
