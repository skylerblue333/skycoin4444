# SkyPromptRegistry (#91)

Bounded engineering-beta prompt registry domain core for deterministic prompt definitions, lifecycle transitions, declared variables, and local rendering.

## Capability

- validated prompt identity/name/template fields
- immutable version increments on activation, revision, and retirement
- draft -> active -> retired lifecycle with retirement terminality
- declared variable validation with duplicate rejection
- deterministic local rendering for active prompts only
- provider-neutral event contract name: `sky.prompt.registry.changed.v1`

## Boundaries

This package does **not** provide live model/provider connectivity, prompt hosting, persistent storage, tenant authorization, secret management, evaluation quality guarantees, production deployment, or compliance certification. Rendering is process-local deterministic string substitution only.
