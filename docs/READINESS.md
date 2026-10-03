# Dependency-Aware Readiness

## Purpose

SKYCOIN4444 now uses one shared dependency-readiness assessor for both the generic runtime readiness endpoint and the invitation-beta readiness endpoint.

The goal is to make readiness mean more than "the process is listening" without turning health checks into a production certification claim.

## Required readiness dependencies

The current required dependency set is:

1. production configuration, when NODE_ENV=production;
2. database reachability.

A readiness result is `ready` only when both required dependencies are healthy.

Configuration failures are reported by key only. Secret values and raw configuration messages are not emitted from readiness responses.

If production configuration is invalid, the database probe is skipped because the process is already not ready.

## Database probe timeout

The database probe is bounded by:

`READINESS_DATABASE_TIMEOUT_MS`

Default: 1500 ms.

A hung probe is reported as `timeout` instead of holding the readiness request open indefinitely.

## Readiness cache

Dependency results are cached for a short bounded interval:

`READINESS_CACHE_MS`

Default: 500 ms.

Concurrent readiness requests share the same in-flight assessment, reducing unnecessary database load during orchestrator or load-balancer probe bursts.

The cache is deliberately short and is not a substitute for monitoring.

## Optional event-dispatch state

The internal event-outbox dispatcher is currently an optional dependency.

Its readiness state includes a stable, privacy-safe reason code:

| Status | Reason | Meaning |
| --- | --- | --- |
| `disabled` | `not_configured` | No dispatcher probe is attached to this runtime. |
| `disabled` | `disabled` | The dispatcher is explicitly disabled. |
| `ok` | `healthy` | It is running, has a valid successful-cycle timestamp, and any failure is strictly older than that success. |
| `degraded` | `not_running` | It is enabled but not running. |
| `degraded` | `success_not_observed` | It is running, but no successful cycle has been proven. |
| `degraded` | `invalid_success_timestamp` | Its success timestamp is malformed. |
| `degraded` | `invalid_failure_timestamp` | Its recorded failure timestamp is malformed. |
| `degraded` | `failure_not_recovered` | Its latest failure is equal to or newer than its latest success. |
| `degraded` | `probe_failed` | Reading dispatcher state threw an exception. |

A degraded optional dispatcher does not force the required readiness result to 503. The response carries `degraded: true` so operators can distinguish "serving required beta dependencies" from "all optional subsystems healthy."

Reason codes expose no exception text, message body, destination, credential, or event payload. They support operator triage without turning the public readiness route into an internal-error disclosure surface.

This policy can be tightened later if internal event processing becomes a required user-journey dependency.

## Runtime readiness

`GET /api/runtime/ready`

Returns HTTP 200 only when:

- runtime lifecycle phase is `ready`; and
- required dependency readiness is `ready`.

During startup, draining, stopped state, invalid production configuration, database timeout, or database unavailability, the endpoint returns HTTP 503.

The response includes runtime/concurrency state plus the dependency snapshot.

## Beta readiness

`GET /api/beta/readiness`

Preserves the existing top-level beta contract:

- `status`;
- `database`;
- `configuration`;
- `configurationIssueKeys`.

It now also includes the shared `dependencyReadiness` snapshot.

This keeps deployment automation compatible while eliminating two independent readiness implementations.

## Failure behavior

Unexpected readiness-assessor failures fail closed.

The beta route returns HTTP 503 with a generic probe-unavailable marker. The runtime route also returns HTTP 503 without exposing internal exception messages.

## Truth boundaries

These endpoints are engineering runtime signals. They do not prove:

- external uptime;
- production deployment;
- database backup/recovery correctness;
- provider health beyond the dependencies actually probed;
- multi-region availability;
- SLA compliance;
- audited operational readiness.

Deployment evidence must still be recorded separately according to the beta release checklist.
