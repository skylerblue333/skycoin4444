export type TrumpEcosystemDisposition =
  | 'local_candidate'
  | 'provider_required'
  | 'blocked_beta'
  | 'research_only';

export type TrumpEcosystemSurface =
  | 'asset'
  | 'portfolio'
  | 'wallet'
  | 'market'
  | 'community'
  | 'creator'
  | 'commerce'
  | 'education'
  | 'developer'
  | 'safety';

export interface TrumpEcosystemCapability {
  readonly id: string;
  readonly name: string;
  readonly surface: TrumpEcosystemSurface;
  readonly disposition: TrumpEcosystemDisposition;
  readonly provider: string | null;
  readonly externalSideEffect: boolean;
  readonly boundary: string;
}

export interface TrumpEcosystemSource {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly sourceType: 'official-project';
}

const capability = (
  id: string,
  name: string,
  surface: TrumpEcosystemSurface,
  disposition: TrumpEcosystemDisposition,
  boundary: string,
  provider: string | null = null,
  externalSideEffect = false,
): TrumpEcosystemCapability =>
  Object.freeze({
    id,
    name,
    surface,
    disposition,
    provider,
    externalSideEffect,
    boundary,
  });

/**
 * External source directory reviewed on 2026-09-23.
 * These are references only. SKYCOIN4444 does not claim ownership, endorsement,
 * partnership, or authority over the linked project or its programs.
 */
export const TRUMP_ECOSYSTEM_SOURCES: readonly TrumpEcosystemSource[] = Object.freeze([
  Object.freeze({
    id: 'official-site',
    label: 'Official TRUMP project website',
    url: 'https://gettrumpmemes.com/',
    sourceType: 'official-project' as const,
  }),
  Object.freeze({
    id: 'terms',
    label: 'Official project terms',
    url: 'https://gettrumpmemes.com/terms',
    sourceType: 'official-project' as const,
  }),
  Object.freeze({
    id: 'coin-club-terms',
    label: 'Coin Club terms',
    url: 'https://gettrumpmemes.com/terms-coin-club',
    sourceType: 'official-project' as const,
  }),
  Object.freeze({
    id: 'reward-points',
    label: 'Reward points information',
    url: 'https://gettrumpmemes.com/reward-points',
    sourceType: 'official-project' as const,
  }),
  Object.freeze({
    id: 'market-update',
    label: 'Market and ecosystem update',
    url: 'https://gettrumpmemes.com/market-update',
    sourceType: 'official-project' as const,
  }),
  Object.freeze({
    id: 'coin-club',
    label: 'Coin Club',
    url: 'https://trumpclub.gettrumpmemes.com/',
    sourceType: 'official-project' as const,
  }),
]);

/**
 * 100 concrete productization candidates and gates.
 *
 * A "local_candidate" is a capability SKYCOIN4444 can productize without an
 * external financial/provider side effect. It does not mean a finished UI
 * already exists. "provider_required" means live data or action must remain
 * unavailable until a real provider is integrated and verified.
 */
export const TRUMP_ECOSYSTEM_CAPABILITIES: readonly TrumpEcosystemCapability[] =
  Object.freeze([
    // Asset identity and discovery (1-10)
    capability('asset-identity-card', 'Asset identity card', 'asset', 'local_candidate', 'Display configured symbol, network, decimals, and mint without price or endorsement claims.'),
    capability('contract-copy-guard', 'Contract copy guard', 'asset', 'local_candidate', 'Copy only the configured mint and label the network beside it.'),
    capability('network-badge', 'Network badge', 'asset', 'local_candidate', 'Show Solana mainnet context without implying chain execution.'),
    capability('official-source-directory', 'Official source directory', 'asset', 'local_candidate', 'Expose reviewed external-source links with a no-affiliation boundary.'),
    capability('terms-link-center', 'Terms and disclosure link center', 'asset', 'local_candidate', 'Link users to external terms rather than restating eligibility or legal conclusions.'),
    capability('supply-disclosure-link', 'Supply disclosure link', 'asset', 'local_candidate', 'Surface the official source for supply/allocation information; do not calculate investment merit.'),
    capability('unlock-schedule-link', 'Unlock schedule source link', 'asset', 'local_candidate', 'Link to source material and label it external and changeable.'),
    capability('asset-risk-panel', 'Asset risk panel', 'asset', 'local_candidate', 'Explain volatility, irreversible transfers, source verification, and no-investment-advice boundaries.'),
    capability('source-freshness-stamp', 'Source freshness stamp', 'asset', 'local_candidate', 'Record when external links were last reviewed without claiming continuous monitoring.'),
    capability('asset-deep-link', 'Asset deep link', 'asset', 'local_candidate', 'Provide a stable SKYCOIN4444 internal route for the configured asset.'),

    // Portfolio and watchlist (11-20)
    capability('watchlist-toggle', 'Local watchlist toggle', 'portfolio', 'local_candidate', 'Browser/account preference only; no trading instruction.'),
    capability('manual-holdings-note', 'Manual holdings note', 'portfolio', 'local_candidate', 'User-entered informational quantity only; not chain-verified.'),
    capability('manual-cost-basis-note', 'Manual cost-basis note', 'portfolio', 'local_candidate', 'User-entered note only; not tax or investment advice.'),
    capability('allocation-view', 'Portfolio allocation view', 'portfolio', 'local_candidate', 'Calculate user-entered allocation without recommending a target allocation.'),
    capability('exposure-band-view', 'Exposure band view', 'portfolio', 'local_candidate', 'Show descriptive concentration bands without buy/sell recommendations.'),
    capability('portfolio-export', 'Portfolio CSV export contract', 'portfolio', 'local_candidate', 'Export user-entered or provider-backed data with provenance labels.'),
    capability('wallet-balance-read', 'Read-only wallet balance', 'portfolio', 'provider_required', 'Requires verified Solana RPC/wallet adapter; no custody.', 'solana-rpc'),
    capability('holdings-snapshot', 'Provider-backed holdings snapshot', 'portfolio', 'provider_required', 'Requires a verified read-only chain/indexer provider.', 'chain-indexer'),
    capability('price-aware-pnl', 'Price-aware P&L view', 'portfolio', 'provider_required', 'Requires trusted market data and must remain descriptive, not advisory.', 'market-data'),
    capability('portfolio-alerts', 'Portfolio threshold alerts', 'portfolio', 'provider_required', 'Requires durable notification and market/balance providers; user-defined thresholds only.', 'market-data-notifications'),

    // Wallet safety and transaction preparation (21-30)
    capability('public-address-validator', 'Public address validator', 'wallet', 'local_candidate', 'Validate public-key shape only; never accept seed phrases or private keys.'),
    capability('unsigned-transfer-intent', 'Unsigned transfer intent', 'wallet', 'local_candidate', 'Prepare reviewed intent only; signing and broadcast remain outside SKYCOIN4444.'),
    capability('base-unit-formatter', 'Token base-unit formatter', 'wallet', 'local_candidate', 'Use exact bigint conversion and SPL u64 bounds.'),
    capability('destination-book', 'Local destination address book', 'wallet', 'local_candidate', 'Store public addresses only; no secrets or automatic transfers.'),
    capability('transfer-review-checklist', 'Transfer review checklist', 'wallet', 'local_candidate', 'Require explicit mint, network, recipient, amount, and irreversibility confirmation.'),
    capability('transaction-note', 'Transaction note', 'wallet', 'local_candidate', 'Local informational note with no on-chain effect.'),
    capability('wallet-connect', 'Wallet connection', 'wallet', 'provider_required', 'Requires a reviewed wallet-adapter integration and origin controls.', 'wallet-adapter'),
    capability('live-token-balance', 'Live token balance', 'wallet', 'provider_required', 'Requires read-only RPC/indexer evidence.', 'solana-rpc'),
    capability('transaction-simulation', 'Transaction simulation', 'wallet', 'provider_required', 'Requires a trusted simulation/RPC provider; simulation is not execution.', 'solana-rpc'),
    capability('signed-transfer-broadcast', 'Signed transfer broadcast', 'wallet', 'blocked_beta', 'Live token transfer execution remains disabled in the engineering beta.', 'wallet-rpc', true),

    // Market intelligence (31-40)
    capability('venue-directory', 'Market venue directory', 'market', 'local_candidate', 'Directory metadata only; no ranking or recommendation of venues.'),
    capability('unlock-calendar', 'Source-linked unlock calendar', 'market', 'research_only', 'Requires ongoing source review before dates are presented as current.'),
    capability('spot-price', 'Spot price display', 'market', 'provider_required', 'Requires a verified market-data provider and timestamps.', 'market-data'),
    capability('ohlc-chart', 'OHLC chart', 'market', 'provider_required', 'Requires verified historical market data.', 'market-data'),
    capability('volume-view', 'Volume view', 'market', 'provider_required', 'Requires provider provenance and timestamping.', 'market-data'),
    capability('liquidity-view', 'Liquidity view', 'market', 'provider_required', 'Requires venue/provider data and clear methodology.', 'market-data'),
    capability('spread-comparison', 'Venue spread comparison', 'market', 'provider_required', 'Requires comparable live venue data; informational only.', 'market-data'),
    capability('market-alerts', 'Market alerts', 'market', 'provider_required', 'User-defined thresholds only; no predictive signals.', 'market-data-notifications'),
    capability('market-news-feed', 'Source-attributed market news feed', 'market', 'provider_required', 'Requires a news/data provider and visible attribution.', 'news-data'),
    capability('automated-token-trading', 'Automated token trading', 'market', 'blocked_beta', 'No autonomous purchase, sale, swap, market making, or execution.', 'trading-provider', true),

    // Community (41-50)
    capability('token-community-hub', 'Token community hub', 'community', 'local_candidate', 'Community discussion must be moderated and must not impersonate an official issuer channel.'),
    capability('discussion-threads', 'Discussion threads', 'community', 'local_candidate', 'User-generated discussion with moderation and reporting.'),
    capability('product-feedback-polls', 'Product feedback polls', 'community', 'local_candidate', 'Poll SKYCOIN4444 product experience, not voting behavior or political persuasion.'),
    capability('community-event-board', 'Community event board', 'community', 'local_candidate', 'User-posted events with source and moderation fields; not issuer-certified by default.'),
    capability('coin-club-source-link', 'Coin Club source link', 'community', 'local_candidate', 'Link to the external program without claiming membership eligibility.'),
    capability('reward-program-source-link', 'Reward program source link', 'community', 'local_candidate', 'Link to external reward information without calculating eligibility.'),
    capability('leaderboard-source-link', 'Leaderboard source link', 'community', 'local_candidate', 'External link only; SKYCOIN4444 does not reproduce or influence official ranking.'),
    capability('watch-rooms', 'Community watch rooms', 'community', 'local_candidate', 'Real-time discussion feature subject to moderation; no coordinated trading prompts.'),
    capability('community-moderation-filters', 'Community moderation filters', 'community', 'local_candidate', 'Filter scams, impersonation, harassment, and prohibited financial solicitations.'),
    capability('political-microtargeting', 'Political microtargeting', 'community', 'blocked_beta', 'No targeting users to influence political opinions, voting, or civic participation.', null, true),

    // Creator and content (51-60)
    capability('token-content-card', 'Token content card', 'creator', 'local_candidate', 'Reusable neutral asset/source card with explicit provenance.'),
    capability('share-link-builder', 'Share link builder', 'creator', 'local_candidate', 'Share product/source pages without autogenerated persuasion or price claims.'),
    capability('disclosure-badge', 'Disclosure badge', 'creator', 'local_candidate', 'Mark unofficial community content and external sources clearly.'),
    capability('creator-profile-linking', 'Creator profile linking', 'creator', 'local_candidate', 'Link user profiles to authored content; no issuer verification claim.'),
    capability('livestream-token-tag', 'Livestream token tag', 'creator', 'local_candidate', 'Categorization tag only; streams remain user content.'),
    capability('video-source-metadata', 'Video source metadata', 'creator', 'local_candidate', 'Attach source URLs and timestamps to informational media.'),
    capability('user-explainer-pages', 'User-authored explainer pages', 'creator', 'local_candidate', 'Require community-content labeling and moderation.'),
    capability('citation-required-posts', 'Citation-required research posts', 'creator', 'local_candidate', 'Support claims with links and timestamps; do not certify truth automatically.'),
    capability('sponsorship-disclosure-field', 'Sponsorship disclosure field', 'creator', 'local_candidate', 'Allow creators to disclose compensation or relationships.'),
    capability('coordinated-hype-bots', 'Coordinated hype bot automation', 'creator', 'blocked_beta', 'No automated amplification intended to manipulate price, sentiment, or political views.', null, true),

    // Commerce, rewards, and membership handoffs (61-70)
    capability('merchandise-source-directory', 'Merchandise source directory', 'commerce', 'local_candidate', 'Link to external merchants/programs with no authenticity guarantee beyond source labeling.'),
    capability('merchant-offer-directory', 'Merchant offer directory', 'commerce', 'research_only', 'Offers change; current availability must be verified before display.'),
    capability('external-discount-display', 'External discount display', 'commerce', 'provider_required', 'Requires current merchant/program data and eligibility rules.', 'merchant-program'),
    capability('checkout-handoff', 'External checkout handoff', 'commerce', 'provider_required', 'Redirect/handoff only after provider and security review; SKYCOIN4444 does not settle funds.', 'merchant-checkout'),
    capability('purchase-intent', 'Local purchase intent', 'commerce', 'local_candidate', 'Create a local quote/request object only; no payment or order placement.'),
    capability('order-status-read', 'External order status read', 'commerce', 'provider_required', 'Requires authenticated merchant/provider integration.', 'merchant-orders'),
    capability('loyalty-points-read', 'External loyalty points read', 'commerce', 'provider_required', 'Requires official program API/authorization; no fabricated balances.', 'rewards-provider'),
    capability('reward-eligibility-read', 'External reward eligibility read', 'commerce', 'provider_required', 'Requires current official program rules and authorization.', 'rewards-provider'),
    capability('crypto-payment-settlement', 'Crypto payment settlement', 'commerce', 'blocked_beta', 'No live payment settlement or token transfer execution.', 'payment-provider', true),
    capability('custodial-checkout-balance', 'Custodial checkout balance', 'commerce', 'blocked_beta', 'No platform custody of user crypto for commerce.', 'custody-provider', true),

    // Education and user support (71-80)
    capability('token-101-lesson', 'TRUMP token 101 lesson', 'education', 'local_candidate', 'Explain identity, source verification, and boundaries without advocacy or investment recommendation.'),
    capability('solana-safety-lesson', 'Solana transaction safety lesson', 'education', 'local_candidate', 'Teach network, public address, fees, and irreversibility concepts.'),
    capability('wallet-safety-checklist', 'Wallet safety checklist', 'education', 'local_candidate', 'Teach seed/private-key protection and phishing resistance.'),
    capability('scam-detection-lesson', 'Scam detection lesson', 'education', 'local_candidate', 'Teach contract/source verification and impersonation warning signs.'),
    capability('terms-explainer', 'Terms source explainer', 'education', 'local_candidate', 'Summarize navigation to source documents; do not give legal advice.'),
    capability('unlock-schedule-explainer', 'Unlock schedule explainer', 'education', 'research_only', 'Needs current source verification before presenting dated schedules.'),
    capability('coin-club-explainer', 'Coin Club source explainer', 'education', 'research_only', 'Program eligibility and benefits can change; link to current official terms.'),
    capability('market-risk-quiz', 'Market risk quiz', 'education', 'local_candidate', 'Educational risk comprehension only; no personalized investment recommendation.'),
    capability('crypto-glossary', 'Crypto glossary', 'education', 'local_candidate', 'Neutral definitions for wallets, liquidity, slippage, custody, and settlement.'),
    capability('source-verification-quiz', 'Source verification quiz', 'education', 'local_candidate', 'Teach users to verify contract addresses and official disclosure channels.'),

    // Developer, integration, and operations (81-90)
    capability('token-registry-contract', 'Token registry contract', 'developer', 'local_candidate', 'Expose deterministic configured asset metadata.'),
    capability('ecosystem-readiness-snapshot', 'Ecosystem readiness snapshot', 'developer', 'local_candidate', 'Expose dispositions and source provenance without claiming live integrations.'),
    capability('capability-export', 'Capability JSON export', 'developer', 'local_candidate', 'Serialize the control-plane registry for UI and test consumers.'),
    capability('source-export', 'Source directory export', 'developer', 'local_candidate', 'Serialize reviewed source links and review date.'),
    capability('market-data-adapter-contract', 'Market data adapter contract', 'developer', 'local_candidate', 'Define a provider boundary without fabricating live data.'),
    capability('wallet-adapter-contract', 'Wallet adapter contract', 'developer', 'local_candidate', 'Define connect/read/simulate interfaces while keeping signing outside the core.'),
    capability('analytics-event-schema', 'Analytics event schema', 'developer', 'local_candidate', 'Measure product usage without inferring political preference.'),
    capability('feature-flags', 'Ecosystem feature flags', 'developer', 'local_candidate', 'Fail closed for provider-backed or high-risk surfaces.'),
    capability('external-webhooks', 'External ecosystem webhooks', 'developer', 'provider_required', 'Requires authenticated official/provider endpoints and replay protection.', 'external-webhook-provider'),
    capability('integration-health', 'External integration health', 'developer', 'provider_required', 'Requires real provider connectivity, monitoring, and error budgets.', 'provider-monitoring'),

    // Safety, trust, compliance, and anti-manipulation controls (91-100)
    capability('secret-input-guard', 'Secret input guard', 'safety', 'local_candidate', 'Reject seed phrases/private-key-like input from token workflows.'),
    capability('phishing-warning', 'Phishing warning surfaces', 'safety', 'local_candidate', 'Warn users to verify domains, wallet prompts, and contract addresses.'),
    capability('public-address-allowlist', 'Optional public-address allowlist', 'safety', 'local_candidate', 'User-managed public addresses only; no guarantees of ownership.'),
    capability('high-risk-confirmation', 'High-risk action confirmation', 'safety', 'local_candidate', 'Require explicit review before any future provider handoff.'),
    capability('identity-kyc', 'Identity/KYC verification', 'safety', 'provider_required', 'Requires an authorized identity/compliance provider; no self-certification.', 'identity-provider'),
    capability('sanctions-screening', 'Sanctions screening', 'safety', 'provider_required', 'Requires an authorized compliance provider and documented policy.', 'compliance-provider'),
    capability('custodial-key-storage', 'Custodial private-key storage', 'safety', 'blocked_beta', 'SKYCOIN4444 engineering beta must not custody private keys.', 'custody-provider', true),
    capability('live-financial-settlement', 'Live financial settlement', 'safety', 'blocked_beta', 'No banking, card, crypto settlement, or guaranteed fulfillment without verified providers.', 'settlement-provider', true),
    capability('price-manipulation-campaigns', 'Price manipulation campaigns', 'safety', 'blocked_beta', 'No coordinated pump, wash-trading, deceptive liquidity, or price-manipulation tooling.', null, true),
    capability('political-persuasion-campaigns', 'Political persuasion campaigns', 'safety', 'blocked_beta', 'No product feature may target or persuade users about voting, candidates, parties, or civic participation.', null, true),
  ]);

const capabilityById = new Map(
  TRUMP_ECOSYSTEM_CAPABILITIES.map(item => [item.id, item] as const),
);

if (capabilityById.size !== TRUMP_ECOSYSTEM_CAPABILITIES.length) {
  throw new Error('duplicate TRUMP ecosystem capability id');
}

export function getTrumpEcosystemCapability(
  id: string,
): TrumpEcosystemCapability | undefined {
  return capabilityById.get(id.trim());
}

export function listTrumpEcosystemCapabilities(
  disposition?: TrumpEcosystemDisposition,
): readonly TrumpEcosystemCapability[] {
  if (!disposition) return TRUMP_ECOSYSTEM_CAPABILITIES;
  return TRUMP_ECOSYSTEM_CAPABILITIES.filter(
    item => item.disposition === disposition,
  );
}

export function summarizeTrumpEcosystemReadiness() {
  const byDisposition: Record<TrumpEcosystemDisposition, number> = {
    local_candidate: 0,
    provider_required: 0,
    blocked_beta: 0,
    research_only: 0,
  };

  for (const item of TRUMP_ECOSYSTEM_CAPABILITIES) {
    byDisposition[item.disposition] += 1;
  }

  return Object.freeze({
    type: 'skycoin4444.trump-ecosystem-readiness-summary.v1',
    totalCapabilities: TRUMP_ECOSYSTEM_CAPABILITIES.length,
    byDisposition: Object.freeze(byDisposition),
    providerRequired: byDisposition.provider_required,
    blockedBeta: byDisposition.blocked_beta,
    externalSideEffectGates: TRUMP_ECOSYSTEM_CAPABILITIES.filter(
      item => item.externalSideEffect,
    ).length,
  } as const);
}

export function assertTrumpCapabilityMayRunLocally(
  id: string,
): TrumpEcosystemCapability {
  const item = getTrumpEcosystemCapability(id);
  if (!item) throw new Error(`unknown TRUMP ecosystem capability: ${id}`);
  if (item.disposition !== 'local_candidate' || item.externalSideEffect) {
    throw new Error(
      `TRUMP ecosystem capability ${id} is not approved for local execution`,
    );
  }
  return item;
}

export function createTrumpEcosystemSnapshot() {
  return Object.freeze({
    type: 'skycoin4444.trump-ecosystem-readiness.v1',
    reviewedAt: '2026-09-23',
    scope: 'skycoin4444-engineering-beta',
    externalAffiliationClaimed: false,
    priceManipulationEnabled: false,
    politicalPersuasionEnabled: false,
    custodyEnabled: false,
    automatedTradingEnabled: false,
    sources: TRUMP_ECOSYSTEM_SOURCES,
    capabilities: TRUMP_ECOSYSTEM_CAPABILITIES,
    summary: summarizeTrumpEcosystemReadiness(),
  } as const);
}
