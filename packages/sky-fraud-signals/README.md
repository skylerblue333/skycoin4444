# SkyFraudSignals — Wave 2 #85 (Lane 07)

SkyFraudSignals is an **engineering-beta defensive transaction-risk signal library**. It evaluates caller-supplied metadata with deterministic, explainable rules and returns an advisory score/band.

## Integration
`toFraudSignalEvent()` emits a bounded event that SkyPayments, SkyLedger, SkyAudit, or a human-review workflow can consume.

## Boundaries
This is not a trained fraud model, payment processor, identity verifier, sanctions screen, bank integration, or automatic blocking system. A score is not proof of fraud and must not be the sole basis for consequential decisions. Production systems must add authenticated data sources, calibration, monitoring, review/appeal controls, persistence, and policy governance.
