# Enterprise foundation reuse

SKYCOIN4444 now reuses proven code from existing public MIT-licensed repositories in the same portfolio instead of rebuilding equivalent domain primitives.

## Version-pinned source inputs

| Source | Commit | Reused capability |
| --- | --- | --- |
| `skylerblue333/Sky-SkyEnterprise` | `d64edb7f7787393229de99cd9393e4542fecc490` | organizations, membership roles, projects, contracts |
| `skylerblue333/skycoin-security` | `be04350399870257e60702819cc931d1e76f990c` | default-deny policy evaluation, AES-256-GCM envelopes |
| `skylerblue333/skycoin-analytics` | `170b5f197a618880d36160c2947de147511413da` | bounded analytics aggregation |

The imported code is tracked by `ENTERPRISE_FOUNDATION_PROVENANCE` so later source upgrades can be reviewed deliberately instead of copied ad hoc.

## Relationship to enterprise adapters

`@skycoin/sky-enterprise-adapters` answers which external providers and capabilities exist, whether required configuration names are present, and how to construct bounded non-executing commands.

`@skycoin/sky-enterprise-foundation` supplies reusable local controls around those integrations:

- organization and membership policy;
- project ownership/lifecycle;
- contract metadata/lifecycle;
- default-deny authorization decisions;
- authenticated local encryption envelopes for caller-managed keys;
- bounded analytics aggregation.

A release contract composes both packages to prove that an authorized organization actor can create a provider command, record non-secret local telemetry, and keep external execution explicitly false.

## Security and product limitations

The AES-GCM primitive does not provide key storage, rotation, HSM/KMS integration, tenant authorization, or secret distribution. Policy decisions do not perform enforcement. Organization/project/contract registries are process-memory primitives. Analytics is bounded and in-memory. Contract objects do not establish legal validity or perform signatures.

External provider operations remain fail-closed until a provider-specific executor, credentials, network policy, deployment, and smoke evidence exist.
