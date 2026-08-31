# Idempotency audit

Scope: inspect write-like domain operations for duplicate-request and replay behavior, especially payments, billing, events, messaging, workflows, and control-plane actions.

Acceptance criteria:
- inventory existing idempotency keys or duplicate guards;
- flag operations vulnerable to repeat application;
- identify deterministic key requirements;
- define replay-focused regression tests;
- avoid implying exactly-once distributed delivery.
