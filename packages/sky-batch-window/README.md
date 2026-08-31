# SkyBatchWindow — Wave 1 slot #28 recovery assignment

Issue #27's historical audit could not recover an authoritative original repository/product identity for #28. This is a newly assigned recovery product created during the #1–#144 audit; it does not claim historical provenance.

SkyBatchWindow deterministically partitions bounded weighted work items into execution windows using maximum-item and maximum-weight constraints, with duplicate and malformed-input rejection and a canonical SHA-256 plan digest.

Integration contract: `planBatchWindows(items, maxItems, maxWeight)` returns immutable ordered windows and a deterministic digest.

Truth boundary: this is an engineering-beta planning library. It does not schedule or execute jobs, provide distributed coordination, queues, retries, persistence, authorization, worker infrastructure, timing guarantees, or production deployment.