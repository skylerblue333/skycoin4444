# SkyReactions (#107)

Bounded engineering-beta reaction-domain core for deterministic per-actor reactions and aggregate summaries.

## Capability

- validates reaction subjects, actors, and supported reaction kinds
- enforces one current reaction per actor/subject pair through deterministic upsert semantics
- supports deterministic removal and aggregate summaries
- uses locale-independent code-unit ordering for stable output
- includes focused tests and package test/typecheck scripts
- exposes provider-neutral event identifier `sky.reaction.changed.v1`

## Boundaries

This package does **not** provide durable persistence, authentication, tenant authorization, abuse prevention, notification delivery, analytics pipelines, social-network ranking, production deployment, or compliance certification. State is supplied by the caller and processed deterministically in memory.
