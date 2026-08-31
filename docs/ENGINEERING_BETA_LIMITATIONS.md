# Engineering-Beta Limitations

SKYCOIN4444 is currently being prepared as an **engineering beta**. This label is intentionally narrower than production ready, generally available, compliant, certified, audited, or deployed.

## What current evidence supports

Current default-branch engineering evidence supports:

- a reproducible pnpm workspace;
- root and package TypeScript validation in CI;
- automated tests;
- a production-style client/server build;
- high-severity production dependency audit;
- many independently testable domain packages;
- a documented canonical runtime topology;
- at least one verified cross-product integration vertical with fail-closed security boundaries.

## What is not established

Unless a separate, current evidence record says otherwise, the repository does not establish:

- production cloud deployment or production uptime;
- validated DNS/TLS configuration;
- live OAuth/identity-provider operation;
- KYC/AML or identity-verification services;
- live banking or payment authorization/settlement;
- custody of customer funds, keys, or assets;
- live blockchain transaction execution or deployed-contract guarantees;
- regulatory approval, legal compliance certification, SOC/ISO/FedRAMP certification, or formal security audit;
- production-grade durable persistence, migration completion, backup/restore, disaster recovery, or HA;
- live AI/model-provider connectivity or model-quality guarantees;
- live email/SMS/push/webhook delivery;
- production monitoring, SIEM, incident response, or retention controls;
- end-to-end integration of every package and every UI page.

## Domain-core limitation

Many products are implemented as bounded domain cores, validators, planners, registries, or adapters. These are real code artifacts with tests, but they should not be described as full hosted services unless request-path exposure, persistence, providers, security enforcement, and operational behavior are independently verified.

## UI limitation

The client tree contains a very large set of pages, including historical/generated/demo-oriented surfaces. Page count is not a production-readiness metric. A UI is canonical only when its backing data/control contract and failure behavior are verified.

## Financial limitation

Payment, billing, ledger, treasury, staking, marketplace, and similar modules may plan or validate domain operations. They do not prove live funds movement, settlement, custody, exchange operation, money transmission, or regulated financial activity.

## Web3 limitation

DID, credential, staking, token, NFT, explorer, governance, and chain-monitoring code may provide domain validation/planning. It does not prove live chain deployment, transaction finality, custody, validator operation, or smart-contract audit status.

## Security limitation

Passing CI and dependency audit is necessary engineering evidence, not a security certification. Threat modeling, secret review, provider configuration, deployment controls, penetration testing, logging/monitoring, and incident response remain separate release concerns.

## Release evidence rule

Any stronger maturity claim should identify the exact default-branch or release-candidate commit, the exact CI evidence, the external configuration/deployment evidence involved, and the limitations that still remain.
