# HopeAI Cross-Module Launch Contract

The invitation-only engineering beta supports bounded, user-visible handoffs into the canonical HopeAI workspace.

## Existing SkyHope contract

SkyHope planning surfaces already link into HopeAI with a bounded query contract:

```
/hope-a-i?source=skyhope&prompt=<url-encoded prompt>
```

The canonical HopeAI workspace consumes the prompt after the authenticated workspace loads, selects **Impact** mode for the `skyhope` source, removes the consumed query context from browser history, and leaves provider execution user-initiated.

## Messaging extension

The flagship Messaging beta remains a local drafting workspace with no remote-send claim. When a draft exists, its HopeAI handoff now uses the same bounded prompt contract:

```
/hope-a-i?source=messaging&prompt=<url-encoded draft>
```

The workspace treats `messaging` as general mode, prefills the draft, and waits for the user to explicitly submit it. Empty drafts continue to link to the plain HopeAI workspace.

## Boundaries

This handoff is navigation and prefill only. It does not establish background work, remote message delivery, charity payment execution, beneficiary verification, custody, settlement, or provider availability.
