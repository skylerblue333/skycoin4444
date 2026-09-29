# Flagship learning and impact paths

## Scope

This upgrade makes the current SKYCOIN4444 engineering beta easier to navigate as one product without replacing the owned HopeAI, Social, Gaming, or SkyHope implementations.

The persistent navigation now promotes **SkySchool** and **SkyHope** alongside Social, Chat, Gaming, HopeAI, and Live. The persisted SkySchool course catalog also exposes clear next paths into HopeAI, SkyHope, Gaming, and Social.

## User journey

1. Open **SkySchool** at `/course-catalog` and use the existing authored lessons and account-owned progress.
2. Move a difficult learning question into **HopeAI** at `/hope-a-i`.
3. Continue into **SkyHope** at `/charity` to explore the charity/impact area.
4. Practice in the flagship **Gaming** surface at `/gaming`.
5. Share a bounded contribution in **Social** at `/activity-feed`.

The durable beta activation journey remains separate from these optional cross-area paths so account-owned evidence is not confused with navigation or preview activity.

## Truth boundaries

- HopeAI provider availability is not guaranteed by navigation; the assistant remains subject to configured provider and runtime gates.
- Opening SkyHope does not process a donation, payment, bank transfer, token transfer, or external settlement.
- Gaming links do not create real-money wagering, payouts, or token rewards.
- SkySchool progress does not automatically become a credential, certificate, financial reward, or shared state in another module.
- Cross-area links do not claim that separate feature stores share persistence.

## Verification

`tests/release/flagship-learning-impact-navigation.test.ts` locks the primary-route wiring and the explicit provider/financial truth boundaries.
