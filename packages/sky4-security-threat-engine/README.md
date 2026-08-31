# Sky4 Security Threat Engine

Engineering-beta deterministic threat-signal scoring core tracked by Issue #146.

## Capability

- validates bounded signal identifiers, categories, severities and confidence values;
- rejects duplicate signal IDs and out-of-range inputs;
- derives a deterministic confidence-weighted risk score and severity level;
- returns explicit accepted-signal counts for downstream policy handling.

## Integration contract

Import `assessThreat` from `src/index.ts`. Callers provide already-collected signals and own telemetry collection, identity, response and enforcement policies.

## Security and product boundary

This package does **not** detect real attacks by itself, ingest live telemetry, block traffic, authenticate actors, guarantee threat accuracy, replace incident response/SIEM/EDR, certify security, or provide production protection. It is a deterministic scoring domain core only.
