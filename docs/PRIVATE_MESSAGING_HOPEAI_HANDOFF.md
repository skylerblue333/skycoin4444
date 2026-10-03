# Private Messaging ↔ HopeAI draft handoff

The flagship Messaging beta can pass a local draft into HopeAI and return a
user-selected HopeAI response to Messaging without placing message content in
the URL.

## Messaging to HopeAI

1. The user writes a draft in `/unified-messaging`.
2. **Polish with HopeAI** trims and caps the draft at 4,000 characters.
3. The draft is stored once in browser `sessionStorage`.
4. Navigation uses only `/hope-a-i?source=messaging`.
5. HopeAI consumes and deletes the one-time draft after the authenticated workspace loads.
6. The draft is only sent to the configured AI provider if the user explicitly submits it.

If browser session storage cannot be used, the handoff fails closed and the user is told to copy the draft instead.

## HopeAI to Messaging

1. The user explicitly chooses **Use in Messaging** on an assistant response.
2. The response is trimmed and checked against Messaging's 4,000-character
   local-draft limit.
3. Empty or oversized output is rejected without navigation or silent
   truncation; **Copy** remains available as the fallback.
4. Valid output is stored once in browser `sessionStorage`.
5. Navigation uses only `/unified-messaging?source=hopeai`.
6. Messaging consumes and deletes the one-time output, removes the source marker
   from browser history, and labels the restored content as an unsent local
   draft that requires review.

Storage failure or a missing, malformed, or oversized stored value fails closed.
No response is automatically transmitted.

## Why

Unlike a query-string prompt, one-time session storage avoids placing message
content in browser history, copied URLs, request paths, referrer data, or
ordinary access logs. The explicit return-size policy also avoids silently
cutting off a HopeAI response at the Messaging boundary.

## Boundary

This is browser-local navigation continuity only. It does not provide remote
message delivery, durable cross-device message storage, end-to-end encryption,
presence, delivery receipts, background work, or guaranteed AI-provider
availability. A real authenticated transport adapter, participant authorization,
durable retry/idempotency evidence, failure telemetry, and hosted-session
verification remain launch work.
