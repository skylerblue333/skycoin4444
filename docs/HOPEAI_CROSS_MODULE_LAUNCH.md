# HopeAI Cross-Module Launch Contract

The invitation-only engineering beta supports bounded, user-visible handoffs into the canonical HopeAI workspace.

## SkyHope

`DonationProcessing` and `FundraiserTools` may link to:

```
/hope-a-i?source=skyhope&prompt=<url-encoded prompt>
```

HopeAI consumes the prompt when the authenticated workspace loads, selects the **Impact** mode, and chooses that mode's mapped specialist. Prompt input is capped at 4,000 characters before it reaches the workspace.

## Messaging

The flagship Messaging beta remains a local drafting workspace with no remote-send claim. When a draft exists, its HopeAI handoff uses:

```
/hope-a-i?source=messaging&prompt=<url-encoded draft>
```

HopeAI opens in the general mode with the draft prefilled so the user can explicitly choose whether to send it to the configured provider.

## Boundaries

This handoff is navigation and prefill only. It does not establish background work, remote message delivery, charity payment execution, beneficiary verification, custody, settlement, or provider availability.
