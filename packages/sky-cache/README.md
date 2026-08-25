# SkyCache (#158)

SkyCache is an engineering-beta cache domain library for SKYCOIN4444. It provides a deterministic in-process key/value cache with optional TTL expiry and a stable cache-key helper.

## Integration
Instantiate `MemoryCache<T>` inside a process-local service, use explicit `now` values in deterministic tests, and use `stableCacheKey()` to namespace cache entries.

## Limitations
This is not Redis, Memcached, a distributed cache, durable storage, a consistency protocol, a CDN, or production cache infrastructure. Data is process-local and disappears when the process ends. There is no replication, eviction policy beyond TTL-on-read/size, encryption, persistence, tenant isolation, or network transport.
