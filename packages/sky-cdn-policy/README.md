# SkyCDNPolicy

Wave 2 slot **#159** / Lane **09**.

SkyCDNPolicy is a bounded engineering-beta library for validating cache policy declarations and deterministically resolving the most specific path policy.

## Integration contract

`sky.cdn.policy.resolved.v1` describes the selected policy metadata for a request path. It is provider-neutral and suitable for future CDN, gateway, observability, or configuration adapters.

## Security and product boundaries

This package does **not** configure or purge a live CDN, contact Cloudflare/AWS/Fastly/Akamai, manage DNS/TLS, perform edge authorization, provide cache poisoning protection, guarantee origin security, or claim production deployment. Callers remain responsible for provider authentication, cache-key correctness, sensitive-response controls, tenant isolation, and operational rollout.
