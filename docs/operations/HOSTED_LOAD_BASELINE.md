# Hosted Load Baseline

This runbook defines a bounded engineering-beta load baseline for the canonical SKYCOIN4444 V5 hosted service.

## What it measures

`scripts/hosted-load-baseline.mjs` performs a preflight and then a short concurrent read-only request set against:

- `/api/beta/readiness`
- `/api/beta/health`
- `/api/beta/auth`

The preflight requires:

- HTTP 200 JSON from all three routes;
- readiness status `ready`;
- database and configuration status `ok`;
- Railway-sourced release identity with a full 40-character release SHA;
- invitation auth configured.

The measured run records total duration, requests/second, error rate, p50/p95/p99 latency, HTTP status counts, per-route latency, the deployed release SHA, and whether exact-release identity was enforced.

Manual `workflow_dispatch` runs bind `HOSTED_LOAD_EXPECTED_SHA` to the workflow revision. A healthy but stale deployment therefore fails before load evidence is accepted. Pull-request runs remain deployment-agnostic because PR heads are not expected to be deployed.

## Canonical PR baseline

The pull-request workflow uses:

- 180 measured requests;
- concurrency 6;
- 12 warmup requests;
- 10-second per-request timeout;
- zero allowed request errors;
- p95 limit 1,500 ms;
- p99 limit 3,000 ms.

These limits are release-regression guardrails for this small probe, **not** production capacity targets or an SLA/SLO.

## Safety boundary

The baseline is intentionally read-only. It does not:

- authenticate a user;
- create or mutate records;
- submit payments;
- sign or broadcast blockchain transactions;
- exercise custody;
- invoke external AI/payment/streaming providers;
- prove autoscaling, multi-region failover, sustained throughput, database recovery, or dependency-outage recovery.

The pull-request job is restricted to branches from this repository so a fork cannot use the workflow to generate traffic against the hosted beta. Pull-request results validate the harness and current hosted service but are not exact-release performance evidence; use a manual run from the intended protected-main release for that claim.

## Evidence

The workflow writes `artifacts/hosted-load-baseline.json` and retains it for 30 days. For release evidence, require all of the following:

- the workflow concluded successfully;
- `release.exactReleaseMatchVerified: true`;
- `release.runReleaseConsistencyVerified: true`;
- `release.releaseSha` equals the intended protected-main SHA;
- `gate.passed: true` and `gate.failures` is empty.

Failed runs retain their metrics and explicit gate failures for diagnosis, but their artifacts are not passing release evidence. Pair a passing artifact with Railway application/database resource metrics from the same time window when evaluating the launch-resilience gate.
