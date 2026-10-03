# HopeAI legacy route convergence

## Why

SKYCOIN4444 now has a provider-backed HopeAI workspace with explicit beta capability
boundaries. Several older public routes still rendered prototype screens that simulated
or advertised capabilities such as autonomous trading, mining optimization, image/video
generation, web search, agent fleets, security monitoring, performance multipliers, and
other behaviors that were not backed by the current integration.

## Current route policy

The following legacy page modules remain in place only for URL/import compatibility and
delegate to `HopeAIWorkspace`:

- `HopeAIPage.tsx`
- `HopeAIUpgrades.tsx`
- `HopeAIMeta.tsx`
- `HOPEAIControl.tsx`

The canonical routes remain:

- `/hope-a-i` — provider-backed HopeAI workspace
- `/hope-a-i-coach` — deterministic account-evidence coach

Legacy URLs continue to resolve, but users now land on the same truthful HopeAI
workspace rather than an unsupported prototype.

## Boundary

This convergence does not claim web browsing, autonomous trading, mining optimization,
image/video generation, external security monitoring, background autonomous agents, or
other provider/tool capabilities unless they are explicitly configured and surfaced by
the canonical workspace runtime.
