# SkyWebhookHub (#166)

Provider-neutral webhook subscription normalization and delivery planning for SKYCOIN4444 Wave 2. It validates HTTPS endpoints, normalizes event subscriptions, and deterministically produces downstream delivery plans.

Integration contract: `sky.webhook.delivery-plan.v1`, explicitly reporting `httpDeliveryPerformed: false`.

Boundaries: no live HTTP delivery, signing/secrets, retries, queue persistence, auth/tenant isolation, rate limiting, or production deployment. HTTPS URL validation is not a complete SSRF defense; any network adapter must independently enforce DNS/IP/destination policy before connecting.
