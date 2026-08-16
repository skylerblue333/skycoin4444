# Staging Connection-Limit Test Plan

**Checkpoint:** `41316ef`  
**Status:** **BLOCKED — procedure prepared, execution requires approved staging access**

## Configuration to capture

The current `server/db.ts` creates a `mysql2/promise` pool from `DATABASE_URL` without explicit pool options in the repository. The provider-side connection limit and the effective application pool defaults must therefore be captured from the approved staging runtime before testing. No connection-limit claim may be inferred from local source inspection.

## Controlled test parameters

| Parameter | Required value |
|---|---|
| Environment | Isolated staging only |
| Provider connection limit | Capture from provider |
| Application pool maximum | Capture from runtime/library configuration |
| Requested concurrency | Owner-approved bounded value below provider capacity |
| Test duration | Owner-approved bounded duration |
| Failure/timeout threshold | Define before execution; no unexplained failures accepted |
| Recovery behavior | Confirm connections release and normal requests recover after test |

## Execution sequence

1. Record the original provider and application settings.
2. Use synthetic staging traffic only.
3. Request bounded concurrency below and near the approved limit, never production-scale load.
4. Record successful connections, rejected connections, errors, timeouts, latency, and recovery behavior.
5. Stop immediately if the environment shows instability outside the approved test envelope.
6. Restore original settings if any configuration is changed and record rollback evidence.

**Current result:** NOT EXECUTED. No approved staging database or runtime endpoint is available.
