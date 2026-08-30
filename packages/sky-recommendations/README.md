# SkyRecommendations (#88)

Bounded engineering-beta recommendation ranking core for SKYCOIN4444 Wave 2.

`rankRecommendations` validates provider-supplied candidate features and produces a deterministic ranked list using a documented relevance/affinity weighting and stable ID tie-breaking. Integration contract: `sky.recommendations.ranked.v1`.

## Boundaries

This package does not collect behavioral data, train or call ML models, personalize from private profiles, fetch catalog content, persist recommendations, enforce authorization, provide fairness or quality guarantees, or claim production deployment. Callers remain responsible for candidate generation, consent, policy, and downstream decisions.
