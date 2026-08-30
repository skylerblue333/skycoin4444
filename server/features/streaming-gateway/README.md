# SkyStreamingGateway (#111)

SkyStreamingGateway is a bounded provider-neutral stream-route selection core for SKYCOIN4444. It selects healthy HLS/DASH/WebRTC route metadata deterministically using protocol, preferred region, priority, and stable identifier ordering, and emits the `sky.streaming.route.v1` integration decision contract.

## Boundaries

This engineering-beta module does not ingest, transcode, relay, host, encrypt, moderate, record, or deliver live media. It has no CDN/media-provider credentials, no durable route registry, no auth/tenant isolation, no SLA guarantee, and no verified production deployment. Callers remain responsible for live provider integrations, access control, capacity, observability, failover execution, and media compliance.
