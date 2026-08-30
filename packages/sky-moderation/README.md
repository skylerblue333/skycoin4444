# SkyModeration (#71)

Bounded engineering-beta moderation domain core for deterministic local text-rule evaluation.

## Capability

- validated review/block rules with deterministic normalization
- non-negative integer priorities and duplicate rule/term rejection
- deterministic matching order by priority then rule id
- explicit `allow` / `review` / `block` decisions with block precedence
- focused unit tests and package typecheck/test scripts
- provider-neutral event contract: `sky.moderation.decision.v1`

## Boundaries

This package does **not** provide live trust-and-safety operations, machine-learning classification, image/video analysis, user enforcement, appeals, durable case storage, tenant authorization, external provider integration, production deployment, or compliance certification. Decisions are deterministic process-local string-rule evaluations only.
