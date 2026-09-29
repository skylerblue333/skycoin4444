# Core Journey Navigation

This integration pass makes the strongest SKYCOIN4444 beta paths visible from both the public launchpad and the authenticated dashboard.

## Canonical journey

The public launchpad now presents a simple five-step loop:

1. **Social** — participate through the account-aware social surface.
2. **Learn** — use SkySchool/course flows before acting.
3. **Play** — use bounded engineering-beta games for engagement.
4. **Help** — open SkyHope and create an impact-oriented action plan.
5. **Explore** — discover additional routed product areas.

HopeAI and SkyHope are also paired as an explicit planning handoff:

- **HopeAI** is the specialist reasoning/coaching workspace at `/hope-a-i`.
- **SkyHope** is the community-impact planning surface at `/charity`.

The signed-in dashboard exposes direct launch cards for Social, Gaming, SkySchool, HopeAI, SkyHope, and SkyLive.

## Integration boundary

This navigation layer only connects existing routed experiences. It does not itself execute donations, payments, custody, token transfers, blockchain writes, charity verification, beneficiary verification, tax receipts, emergency dispatch, or measured real-world impact.

SkyHope may evolve behind its canonical route without requiring the public and authenticated entry points to change. HopeAI provider/tool capabilities remain governed by their own runtime and integration boundaries.

## Verification

`tests/release/core-journey-navigation.test.ts` locks the primary routes, the five-step loop, the HopeAI → SkyHope handoff, and the non-financial truth boundary.
