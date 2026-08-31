# Integration smoke coverage audit

Scope: identify low-cost cross-product smoke tests proving that representative Wave-2 producer/consumer contracts can be composed without claiming deployed infrastructure.

Acceptance criteria:
- select representative identity, payments, AI, social, education, commerce, Web3, and control-plane flows;
- verify contract compatibility at module boundaries;
- avoid external-provider dependencies in baseline smoke tests;
- document missing adapters separately;
- require deterministic CI-friendly execution.
