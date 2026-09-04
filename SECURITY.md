# Security Policy

## Current status

SKYCOIN4444 is being prepared as an **engineering beta**. Passing CI, tests, and dependency audit is engineering evidence, not a security certification or production deployment guarantee.

## Reporting a vulnerability

Please report suspected security issues privately through GitHub's security-reporting mechanisms when available, or contact the repository owner/maintainers privately before public disclosure. Do not include live credentials, private keys, tokens, personal data, or exploit details in a public issue.

A useful private report should include:

- affected repository path or component;
- impact and preconditions;
- minimal reproduction steps;
- whether the issue crosses authentication, authorization, financial, persistence, provider, or Web3 boundaries;
- suggested remediation if known.

## Threat boundaries

Treat the following as security-sensitive and high-risk change surfaces:

- authentication, session, MFA, identity, and permission decisions;
- secrets, privacy, consent, audit, and policy handling;
- payment, billing, ledger, accounting, treasury, marketplace, and custody-adjacent logic;
- blockchain/Web3 transaction, key, token, credential, staking, NFT, governance, and explorer paths;
- database configuration, schema/migrations, storage and recovery paths;
- CI/release configuration, dependency manifests, lockfiles, and provider credentials;
- external AI, OAuth, notification, webhook, storage, payment, and other provider adapters.

Security-sensitive boundaries should fail closed when required preconditions are missing or invalid. Unavailable providers must not be represented as successful authentication, settlement, delivery, persistence, chain execution, or model inference.

## Current controls in repository CI

The default CI pipeline currently enforces:

- frozen-lockfile dependency installation;
- root TypeScript validation;
- package-workspace TypeScript validation;
- canonical lint;
- current-tree credential-pattern scanning;
- engineering-beta marker auditing;
- automated tests and integration tests;
- production client/server build;
- high-severity production dependency audit.

The canonical server also has a fail-closed same-origin boundary for cookie-authenticated unsafe browser requests. In production, POST/PUT/PATCH/DELETE requests carrying the session cookie must match the configured `BETA_PUBLIC_ORIGIN`, and browser requests marked `Sec-Fetch-Site: cross-site` are rejected. Production session cookies are always `Secure`. See `docs/REQUEST_SECURITY.md`.

These controls do not replace threat modeling, dedicated historical secret scanning, penetration testing, provider hardening, deployment controls, monitoring, incident response, backup/recovery exercises, or third-party security review.

## Secrets and credentials

Do not commit live secrets, API keys, access tokens, passwords, private keys, seed phrases, connection strings containing credentials, or production certificates. Use environment/configuration mechanisms appropriate to the deployment platform. If a secret is exposed, rotate/revoke it; removing it from the latest commit alone may not remove it from Git history.

## Financial and Web3 limitations

Domain validation/planning for payments, ledgers, staking, tokens, NFTs, governance, or blockchain data is not evidence of custody, settlement, transaction finality, audited smart contracts, or regulatory approval.

## External-provider limitations

Provider helper code does not prove that OAuth, AI/model, email/SMS/push, payment, banking, storage, blockchain, identity-verification, or other external services are configured or secure in production.

## Security release work still expected

Before stronger production claims, independently verify at minimum:

- secret/credential-pattern review and remediation;
- dependency and supply-chain posture;
- authorization and session threat modeling;
- persistence/migration security and backup/recovery behavior;
- external-provider configuration and least privilege;
- logging/monitoring and incident-response paths;
- financial/Web3 threat boundaries where applicable;
- deployment/network/TLS controls;
- targeted penetration/security testing appropriate to exposed services.

See `docs/ENGINEERING_BETA_LIMITATIONS.md` for broader maturity boundaries.
