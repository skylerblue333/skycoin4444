# SkyNotificationsHub (#112)

SkyNotificationsHub is a provider-neutral notification planning core for SKYCOIN4444 Wave 2. It validates recipient/template/channel inputs, de-duplicates channels, and produces deterministic delivery plans for downstream adapters.

## Integration contract

`sky.notifications.plan.v1` contains normalized identifiers, a template key, ordered unique channels, and deterministic variables for downstream email/SMS/push/in-app adapters.

## Boundaries

This package does **not** send email, SMS, push notifications, or in-app messages. It has no live provider credentials, delivery guarantees, retries, persistence, authorization, tenant isolation, preference/consent enforcement, rate limiting, compliance certification, or production deployment claims.

## Verification

Focused tests cover normalization, de-duplication, malformed identifiers/templates, empty channels, and unsupported channel rejection. Dedicated CI runs package typecheck, focused tests, and critical dependency audit.
