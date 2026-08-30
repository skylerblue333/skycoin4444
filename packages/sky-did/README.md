# SkyDID

Bounded engineering-beta DID domain core for SKYCOIN4444 Wave-2 slot #143.

Capabilities: validates a deliberately small DID-method allowlist (`did:key`, `did:web`, `did:pkh`), creates deterministic in-memory DID-document metadata, normalizes HTTPS aliases, and exposes versioned resolution request/result contracts for integration with credential products.

Truth boundary: this package does **not** perform DID resolution, network requests, key generation or custody, signing, identity proofing, blockchain writes, registry operations, durable persistence, authentication, authorization, compliance certification, or production deployment. `planResolution` explicitly reports `resolutionPerformed: false` and `networkRequestPerformed: false`.
