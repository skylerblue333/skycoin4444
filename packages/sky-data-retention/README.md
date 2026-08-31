# SkyDataRetention — Slot #173

SkyDataRetention is an engineering-beta retention-policy evaluation core. It decides whether a caller-described record remains inside a deterministic retention window and supports an explicit legal-hold flag.

## SKYCOIN4444 integration contract

Audit, messaging, storage, privacy, and compliance adapters may evaluate records before archival or deletion workflows.

## Boundaries

This package does not delete data, determine legal obligations, create legal holds, discover records, persist policy, or prove regulatory compliance. Policy approval, authorization, durable storage, clock trust, and deletion execution remain integration responsibilities.
