# SKYCOIN4444 212-to-12 Consolidation Map

**Date:** 2026-08-22  
**Status:** Initial candidate map; migration requires repository-level validation before destructive changes.

## Scope correction

The GitHub REST inventory currently returned **194 visible repositories**, not 212. The supplied audit refers to 212, so the difference must be reconciled before claiming a complete 212-repository disposition. The current inventory contains 164 repositories at or below 50 KB, 16 between 51 KB and 5,000 KB, and 14 above 5,000 KB. Size is a triage signal only; it is not proof of quality.

## Proposed product set

| Target repository | Product boundary | Candidate source repositories | Disposition of source material |
|---|---|---|---|
| `skycoin4444` | Canonical platform, shared contracts, area registry, core application | `skycoin4444`, `skycoin4444-platform`, `skycoin-production` | Migrate only validated modules; retain source links and history notes |
| `frontendpages` | Frontend application and screen registry | `frontendpages`, `frontenedpages`, `skycoin44-frontend` | Keep one canonical frontend; classify generated and unreachable pages |
| `ShadowChat-Core` | Shared communication and AI-chat backend | `ShadowChat-Core`, `ShadowChat`, `ShadowChat-Legacy` | Extract functional services; isolate generated drafts and mock-only code |
| `ShadowChat-Pro-Edition` | User-facing ShadowChat product shell | `ShadowChat-Pro-Edition`, `ShadowChat-Final-Build`, `ShadowChat-production-` | Validate build and runtime contracts before accepting code |
| `skycoin4444-finance` | Portfolio, payments, market, exchange, and financial contracts | `skycoin4444-finance`, `Sky-Portfolio-Manager`, `skycoin4444-marketplace`, `skycoin4444-payments` | No live financial claims without verified providers and tests |
| `skycoin4444-wallet` | Wallet, custody boundaries, NFT, and chain-facing operations | `skycoin4444-wallet`, `skycoin-wallet`, `Skycoin-Reference-Implementation` | Never merge plaintext key handling or fake transaction paths |
| `Skycoin-Protocol-v44` | Versioned protocol and reference implementation | `Skycoin-Protocol-v44`, `Skycoin-Protocol-Upgrade`, `Skycoin-Next-Gen`, `Skycoin-Legacy-Core` | Preserve protocol history; require compatibility and security tests |
| `skycoin4444-ai` | HopeAI, AI control, model policy, and AI marketplace contracts | `skycoin4444-hopeai`, `skycoin4444hopeAIShadowchat`, `skycoin-ai`, `skycoin4444-ai-control-center`, `skycoin4444-ai-marketplace` | Separate deterministic contracts from unavailable model providers |
| `skycoin4444-skyschool` | Courses, quizzes, certification, and student workflows | `skycoin4444-skyschool`, `Sky-SkySchool` | Accept only tested curriculum and assessment logic |
| `skycoin4444-community` | Community, social, creator, dating, and engagement features | `skycoin4444-social`, `skycoin4444-community`, `sky-SkyCommunity`, `skycoin-creator` | Keep moderation, privacy, and authorization boundaries explicit |
| `skycoin4444-infrastructure` | Deployment, observability, security, load balancing, and operations | `skycoin4444-infrastructure`, `Go-Load-Balancer`, `enterprise-devops-infrastructure`, `skycoin-infrastructure` | Require reproducible CI and operational tests |
| `skycoin4444-security-crypto` | Cryptography, encryption, security controls, and compliance evidence | `skycoin4444-security`, `Rust-File-Encryptor`, `fedramp-security-hardening`, `nist-compliance-framework` | No certification claims; preserve auditable security tests |

## Separate archive and draft policy

Repositories that are primarily backups, generated screen libraries, personal profile material, experiments, songs, or one-line language demonstrations should not be forced into product repositories. They should receive an explicit `ARCHIVED`, `REFERENCE`, `DRAFT`, or `REQUIRES-VALIDATION` disposition with a pointer to the canonical target when appropriate. Deletion is out of scope until history, ownership, and recovery requirements are confirmed.

## Acceptance gate for migration

A source repository may enter a target product repository only when its code has a reproducible build or test command, its dependencies are understood, its license and ownership are recorded, its secrets are absent, its runtime claims match implementation evidence, and its imports or APIs can be integrated without silently changing behavior. Generated drafts may be retained in a clearly labeled archive directory but must not be counted as shippable screens or production functionality.

## Current conclusion

The target is **12 product repositories**, within the requested 10–15 range. This is a proposed consolidation boundary, not a completion claim. The next engineering pass should validate the high-value candidates—`skycoin4444`, `frontendpages`, `ShadowChat-Core`, `ShadowChat-Pro-Edition`, `Go-Load-Balancer`, `Rust-File-Encryptor`, and the protocol repositories—before migrating code from the 164 small repositories.

## References

[1]: https://github.com/skylerblue333/skycoin4444 "Canonical SKYCOIN4444 repository"
[2]: https://github.com/skylerblue333/frontendpages "Frontend pages repository"
[3]: https://github.com/skylerblue333/ShadowChat-Core "ShadowChat Core repository"
[4]: https://github.com/skylerblue333/Go-Load-Balancer "Go load balancer repository"
[5]: https://github.com/skylerblue333/Rust-File-Encryptor "Rust file encryptor repository"
