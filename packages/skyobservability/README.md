# SkyObservability — Wave 2 Slot #151

SkyObservability is an **engineering-beta telemetry contract library** for normalized log/event attributes and metric naming. It produces deterministic local event objects; it is not a telemetry collector or monitoring backend.

## SKYCOIN4444 integration contract

Services can call `createTelemetryEvent` at their application boundary and hand the returned object to whichever logging/metrics/tracing adapter they actually configure. The library canonicalizes timestamps, service/event identifiers and trace IDs, and strips attribute names that obviously look like passwords, secrets, tokens, authorization headers, or cookies.

## Boundaries

This package does not ship logs, scrape metrics, create dashboards, retain telemetry, guarantee secret detection, provide distributed tracing propagation, or connect OpenTelemetry/Datadog/CloudWatch/another provider. The attribute filter is a defense-in-depth convenience, not a data-loss-prevention system. Callers must avoid putting sensitive data into telemetry in the first place.

## Validation

```sh
pnpm --filter @skycoin/skyobservability test
pnpm run check:packages
pnpm --filter @skycoin/skyobservability format:check
```
