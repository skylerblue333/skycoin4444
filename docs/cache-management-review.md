# Cache management review

## Selected screen

The next untouched screen is `/cache-management`. It currently contains placeholder feature cards, fake platform metrics, unsupported real-time claims, and missing icon imports.

## Upgrade scope

Replace the placeholder with a transparent local cache-preferences and diagnostics surface. It will show what this UI can actually inspect, provide a local clear-preview action with confirmation, expose a preference for automatic refresh hints, and explain that server caches, CDN state, and database data cannot be purged from this screen. No fabricated cache size, hit rate, latency, or successful backend purge will be presented.

## Visual and interaction checkpoint

**Route:** `/cache-management`

**Initial screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-37-13_7104.webp`

The upgraded screen renders transparent local diagnostics: preview state is available, application cache is `Not connected`, and data freshness is `Not measured`. The scope warning explicitly rejects fake cache size, hit rate, latency, and backend purge claims.

Selecting `Clear local preview` updates only the local preview state to `Cleared for this session`, announces `Local preview state cleared.`, and shows a toast stating that server, CDN, and database caches were not purged.

**Clear-state screenshot:** `/home/ubuntu/screenshots/127_0_0_1_2026-08-17_09-37-23_4074.webp`
