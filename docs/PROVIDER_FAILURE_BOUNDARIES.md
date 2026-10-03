# Provider Failure Boundaries

SKYCOIN4444 treats configured AI, image, and Maps proxy providers as external dependencies rather than trusted in-process components.

## Runtime guarantees in this hardening pass

- Image generation and image-model discovery use bounded request timeouts.
- LLM requests use a bounded per-attempt timeout.
- LLM retries are limited to transient HTTP responses: 408, 425, 429, 500, 502, 503, and 504, plus transport errors.
- Deterministic authentication, validation, policy, and other non-transient 4xx responses are not retried.
- Provider error response bodies are not copied into application exceptions.
- Successful image responses are runtime-validated before decoding or storage.
- Generated-image MIME types are restricted to supported image formats.
- Generated decoded image payloads are capped at 32 MiB before storage.
- LLM chat/model responses and image-model lists must satisfy minimum runtime shapes before they are returned to callers.
- Maps proxy requests use a 15-second timeout that remains active while the response body is consumed.
- Maps endpoints are restricted to normalized proxy paths without query/fragment injection or parent traversal.
- Maps query parameters reject object/non-finite values and serialize arrays with `|` as documented by the integration contract.
- Maps provider error bodies are discarded rather than reflected through application exceptions.

## Security and product boundary

These controls reduce retry amplification, hanging provider calls, malformed-response crashes, unsafe content-type propagation, and accidental provider-error disclosure. They do **not** certify the external provider, guarantee availability, establish model correctness, or prove production security.

Configured provider credentials remain environment-managed. This pass does not add or expose provider secrets.

## Verification

Focused tests:

- `server/_core/imageGeneration.test.ts`
- `server/_core/llm.test.ts`
- `server/_core/map.test.ts`

The canonical PR must also pass the repository's exact-head CI and release-security gates before merge.
