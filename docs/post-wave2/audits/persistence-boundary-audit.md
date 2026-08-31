# Persistence boundary audit

Scope: distinguish in-memory/domain-library behavior from durable storage guarantees across completed Wave-2 products.

Acceptance criteria:
- inventory persistence assumptions;
- flag wording that implies durable storage where none exists;
- identify idempotency/restart risks caused by ephemeral state;
- define persistence-adapter contract gaps;
- preserve explicit no-database/no-deployment boundaries where applicable.
