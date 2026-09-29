# Private Messaging → HopeAI handoff

The flagship Messaging beta can pass a local draft into HopeAI without putting user-authored message content in the URL.

## Flow

1. The user writes a draft in `/unified-messaging`.
2. **Polish with HopeAI** trims and caps the draft at 4,000 characters.
3. The draft is stored once in browser `sessionStorage`.
4. Navigation uses only `/hope-a-i?source=messaging`.
5. HopeAI consumes and deletes the one-time draft after the authenticated workspace loads.
6. The draft is only sent to the configured AI provider if the user explicitly submits it.

If browser session storage cannot be used, the handoff fails closed and the user is told to copy the draft instead.

## Why

Unlike a query-string prompt, one-time session storage avoids placing the message body in browser history, copied URLs, request paths, referrer data, or ordinary access logs.

## Boundary

This is browser-local navigation continuity only. It does not provide remote message delivery, durable cross-device message storage, end-to-end encryption, presence, delivery receipts, background work, or guaranteed AI-provider availability.
