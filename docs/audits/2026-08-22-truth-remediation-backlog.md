# SKYCOIN4444 Truth-Based Remediation Backlog

**Date:** 2026-08-22  
**Author:** Manus AI

## Purpose

This backlog converts the supplied repository truth audit into engineering work that can be measured. Repository names, README claims, line counts, and production status must be verified from source, tests, build output, and deployment evidence. No repository will be described as enterprise-grade merely because it has a README, scaffold, or generated screens.

## Priority order

| Priority | Workstream | Acceptance evidence |
|---|---|---|
| P0 | Remove misleading production claims and label demo, draft, unavailable, and test states | README and UI copy agree with verified implementation status |
| P0 | Repair ShadowChat-Core build boundaries and separate generated draft screens from shippable code | Clean build, explicit route registry, tests for functional services |
| P0 | Replace the one-line Python ETL repository with a real, tested pipeline or mark it as a concept | Working ingestion, transformation, output, error handling, and tests |
| P1 | Complete Rust file encryptor CLI and test key handling, tamper detection, and file I/O | CLI help, round-trip tests, authentication-failure tests, no plaintext secret persistence |
| P1 | Revalidate Go load balancer behavior and operational controls | Unit/integration tests for health checks, round-robin, failure recovery, and trace propagation |
| P1 | Audit `frontendpages` screen inventory and route reachability | Source count, route count, build pass, and no unsupported 1,155-screen claim |
| P1 | Consolidate duplicate or low-value repositories into coherent area packages | Migration manifest, preserved history where needed, clean remote verification |
| P2 | Add CI checks across real repositories | Install, typecheck, tests, build, and dependency/security checks are reproducible |
| P2 | Add API, authentication, database, and observability hardening only where actual services exist | Contract tests and evidence-backed runtime behavior |

## Current verified facts

The `frontendpages` repository currently measures 1,086 files under `client/src/pages`, 1,062 lazy imports, and 1,067 route elements after wiring seven genuine standalone screens. Its TypeScript check and production build pass, with a large-chunk warning. This does not establish 1,155 distinct screens.

The supplied audit identifies the Python ETL repository as a one-line implementation, describes the Rust encryptor as functional but incomplete, and describes ShadowChat-Core as a mixed repository containing functional infrastructure plus non-shippable generated drafts. These claims are priorities for direct source validation before any valuation or production-readiness statement.

## Working rule

Every future checkpoint must include the exact repository, branch, commit SHA, validation commands, validation result, and remote verification result. Unavailable integrations must remain explicitly unavailable; mock data must be labeled; financial, blockchain, AI, and operational claims require authoritative evidence.
