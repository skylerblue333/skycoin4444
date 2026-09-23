import {
  OFFICIAL_TRUMP_TOKEN,
  SKYCOIN4444_OFFICIAL_CRYPTO_ASSET,
} from './officialTrump';

export type TrumpCapabilityCategory =
  | 'asset_identity'
  | 'wallets_keys'
  | 'transactions_network'
  | 'custody_security'
  | 'trading_liquidity'
  | 'payments_settlement'
  | 'compliance_legal'
  | 'accounting_tax'
  | 'treasury_enterprise'
  | 'consumer_social'
  | 'reliability_operations'
  | 'crosschain_ecosystem';

export type TrumpCapabilityMaturity =
  | 'implemented_contract'
  | 'engineering_planned'
  | 'provider_required'
  | 'authority_required';

export type TrumpCapabilityAvailability =
  | 'available_read_only'
  | 'available_planning_only'
  | 'gated'
  | 'external_only';

export type TrumpCapability = Readonly<{
  id: string;
  name: string;
  category: TrumpCapabilityCategory;
  maturity: TrumpCapabilityMaturity;
  availability: TrumpCapabilityAvailability;
  sideEffecting: boolean;
  description: string;
}>;

type CapabilitySeed = readonly [
  id: string,
  name: string,
  maturity: TrumpCapabilityMaturity,
  availability: TrumpCapabilityAvailability,
  sideEffecting: boolean,
  description: string,
];

const category = (
  categoryName: TrumpCapabilityCategory,
  entries: readonly CapabilitySeed[],
): readonly TrumpCapability[] =>
  entries.map(([id, name, maturity, availability, sideEffecting, description]) =>
    Object.freeze({
      id,
      name,
      category: categoryName,
      maturity,
      availability,
      sideEffecting,
      description,
    }),
  );

const assetIdentity = category('asset_identity', [
  ['asset-designation', 'SKYCOIN4444 primary external crypto-asset designation', 'implemented_contract', 'available_read_only', false, 'Internal SKYCOIN4444 designation for the configured TRUMP asset; no external affiliation or legal status is implied.'],
  ['solana-mint', 'Solana mint identity', 'implemented_contract', 'available_read_only', false, 'Configured Solana mainnet mint identity.'],
  ['token-symbol', 'Token symbol metadata', 'implemented_contract', 'available_read_only', false, 'TRUMP symbol metadata.'],
  ['token-name', 'Token name metadata', 'implemented_contract', 'available_read_only', false, 'Official Trump token name metadata.'],
  ['token-decimals', 'Token decimal metadata', 'implemented_contract', 'available_read_only', false, 'Six-decimal amount metadata used by validation.'],
  ['network-binding', 'Solana network binding', 'implemented_contract', 'available_read_only', false, 'Binds the current integration contract to Solana mainnet-beta.'],
  ['registry-snapshot', 'Versioned token registry snapshot', 'implemented_contract', 'available_read_only', false, 'Deterministic registry snapshot for integration consumers.'],
  ['asset-aliases', 'Asset aliases and display labels', 'engineering_planned', 'available_planning_only', false, 'Normalized display aliases without changing canonical identity.'],
  ['contract-verification', 'On-chain contract verification evidence', 'provider_required', 'gated', false, 'Requires live chain/provider evidence and independent verification.'],
  ['asset-provenance', 'Asset provenance evidence record', 'provider_required', 'gated', false, 'Tracks externally verified provenance and source evidence.'],
] as const);

const walletsKeys = category('wallets_keys', [
  ['wallet-connect', 'External wallet connection', 'provider_required', 'gated', true, 'Connect a user-controlled wallet without taking custody.'],
  ['wallet-account-discovery', 'Wallet account discovery', 'provider_required', 'gated', false, 'Read public wallet accounts through an approved provider.'],
  ['wallet-balance-read', 'TRUMP balance read', 'provider_required', 'gated', false, 'Read token balances from an approved RPC/provider.'],
  ['associated-token-account', 'Associated token account planning', 'engineering_planned', 'available_planning_only', false, 'Derive or plan required token accounts without creating them.'],
  ['hardware-wallet', 'Hardware wallet support', 'provider_required', 'gated', true, 'Integrate supported hardware wallet signing flows.'],
  ['mobile-wallet-deeplink', 'Mobile wallet deep links', 'provider_required', 'gated', true, 'Launch supported user-controlled mobile wallets.'],
  ['multisig-wallet', 'Multisignature wallet support', 'provider_required', 'gated', true, 'Coordinate externally controlled multisig authorization.'],
  ['social-recovery', 'Wallet social recovery integration', 'provider_required', 'gated', true, 'Provider-backed recovery without SKYCOIN4444 claiming custody.'],
  ['address-book', 'Trusted address book', 'engineering_planned', 'available_planning_only', false, 'Store user-reviewed destination labels and risk notes.'],
  ['wallet-permissions', 'Wallet permission scopes', 'engineering_planned', 'available_planning_only', false, 'Define least-privilege capabilities before any wallet integration.'],
] as const);

const transactionsNetwork = category('transactions_network', [
  ['address-validation', 'Solana public-key validation', 'implemented_contract', 'available_read_only', false, 'Reject malformed source and destination owner addresses.'],
  ['amount-precision', 'Token amount precision validation', 'implemented_contract', 'available_read_only', false, 'Reject amounts exceeding configured decimal precision.'],
  ['spl-u64-limit', 'SPL u64 amount bound', 'implemented_contract', 'available_read_only', false, 'Reject token amounts that cannot fit an SPL transfer instruction.'],
  ['transfer-acknowledgements', 'Explicit transfer acknowledgements', 'implemented_contract', 'available_read_only', false, 'Require mint, network, recipient, amount, and irreversibility acknowledgement.'],
  ['unsigned-transfer-intent', 'Unsigned transfer intent', 'implemented_contract', 'available_planning_only', false, 'Produce a deterministic intent without signing or broadcasting.'],
  ['fee-estimation', 'Network fee estimation', 'provider_required', 'gated', false, 'Requires current network/provider fee data.'],
  ['priority-fee', 'Priority-fee estimation', 'provider_required', 'gated', false, 'Requires live network conditions and provider data.'],
  ['transaction-simulation', 'Transaction simulation', 'provider_required', 'gated', false, 'Requires Solana RPC simulation against current chain state.'],
  ['live-broadcast', 'Live transaction broadcasting', 'provider_required', 'gated', true, 'Requires approved RPC infrastructure, wallet authorization, monitoring, and rollback/incident controls.'],
  ['confirmation-tracking', 'Confirmation and finality tracking', 'provider_required', 'gated', false, 'Requires chain monitoring to track submitted signatures to finality.'],
] as const);

const custodySecurity = category('custody_security', [
  ['custody', 'Asset custody', 'provider_required', 'gated', true, 'Requires a qualified custody model, legal review, key controls, operations, and external evidence.'],
  ['mpc-custody', 'MPC custody integration', 'provider_required', 'gated', true, 'Requires an external MPC/custody provider and operational controls.'],
  ['hsm-key-storage', 'HSM key storage', 'provider_required', 'gated', true, 'Requires managed hardware security modules and audited key procedures.'],
  ['key-generation', 'Production key generation', 'provider_required', 'gated', true, 'Requires approved entropy, isolation, access controls, and lifecycle procedures.'],
  ['key-rotation', 'Signing-key rotation', 'provider_required', 'gated', true, 'Requires production key ownership and tested rotation procedures.'],
  ['key-backup', 'Key backup and recovery', 'provider_required', 'gated', true, 'Requires secured backup media, access separation, and recovery testing.'],
  ['withdrawal-policy', 'Withdrawal policy engine', 'engineering_planned', 'available_planning_only', false, 'Define limits, holds, approvals, and destination controls.'],
  ['transaction-approvals', 'Multi-person transaction approvals', 'engineering_planned', 'available_planning_only', false, 'Require configurable approvals before high-risk actions.'],
  ['custody-insurance', 'Custody insurance evidence', 'provider_required', 'gated', false, 'Requires an actual insurer/provider policy and verified coverage terms.'],
  ['proof-of-reserves', 'Proof-of-reserves evidence', 'provider_required', 'gated', false, 'Requires real custodial balances, liabilities, and external attestation.'],
] as const);

const tradingLiquidity = category('trading_liquidity', [
  ['market-data', 'Live market data', 'provider_required', 'gated', false, 'Requires approved real-time price and venue data.'],
  ['dex-routing', 'DEX route discovery', 'provider_required', 'gated', false, 'Requires live venue/liquidity integrations.'],
  ['swap-quote', 'Swap quote generation', 'provider_required', 'gated', false, 'Requires real venue quotes and expiry semantics.'],
  ['slippage-controls', 'Slippage controls', 'engineering_planned', 'available_planning_only', false, 'Define user-visible maximum slippage and quote-expiry rules.'],
  ['market-order', 'Market-order execution', 'provider_required', 'gated', true, 'Requires live venue execution and transaction authorization.'],
  ['limit-order', 'Limit-order execution', 'provider_required', 'gated', true, 'Requires venue support, persistence, monitoring, and cancellation semantics.'],
  ['stop-order', 'Stop-order execution', 'provider_required', 'gated', true, 'Requires monitored triggers, venue execution, and failure handling.'],
  ['dca', 'Dollar-cost-averaging automation', 'provider_required', 'gated', true, 'Requires scheduling, balances, execution venues, authorization, and risk limits.'],
  ['twap', 'TWAP execution', 'provider_required', 'gated', true, 'Requires venue routing, execution scheduling, market data, and risk controls.'],
  ['automated-trading', 'Automated trading', 'provider_required', 'gated', true, 'Requires explicit user authorization, strategy controls, venues, monitoring, kill switches, and legal review.'],
] as const);

const paymentsSettlement = category('payments_settlement', [
  ['merchant-checkout', 'TRUMP merchant checkout', 'provider_required', 'gated', true, 'Requires wallet/payment rails, pricing, confirmation, refunds, and merchant operations.'],
  ['payment-links', 'Payment links', 'engineering_planned', 'available_planning_only', false, 'Create non-executing payment requests with amount and expiry metadata.'],
  ['qr-payments', 'QR payment requests', 'engineering_planned', 'available_planning_only', false, 'Encode user-reviewed payment request metadata.'],
  ['invoices', 'Crypto invoices', 'engineering_planned', 'available_planning_only', false, 'Issue invoice records without claiming settlement.'],
  ['subscriptions', 'Recurring crypto payments', 'provider_required', 'gated', true, 'Requires wallet authorization and recurring-payment provider semantics.'],
  ['refunds', 'Crypto refund workflow', 'provider_required', 'gated', true, 'Requires transaction execution, approvals, and reconciliation.'],
  ['escrow', 'Escrow workflow', 'provider_required', 'gated', true, 'Requires enforceable custody/contract design and dispute operations.'],
  ['settlement', 'Merchant or platform settlement', 'provider_required', 'gated', true, 'Requires actual counterparties, accounts, reconciliation, legal agreements, and operational controls.'],
  ['fiat-onramp', 'Fiat on-ramp integration', 'provider_required', 'gated', true, 'Requires licensed external provider relationships and KYC/AML controls.'],
  ['fiat-offramp', 'Fiat off-ramp integration', 'provider_required', 'gated', true, 'Requires licensed external provider relationships and banking/payment rails.'],
] as const);

const complianceLegal = category('compliance_legal', [
  ['kyc', 'KYC workflow', 'provider_required', 'gated', true, 'Requires an identity/KYC provider and jurisdiction-appropriate policy.'],
  ['aml', 'AML controls', 'provider_required', 'gated', true, 'Requires risk rules, monitoring, escalation, and compliance ownership.'],
  ['sanctions-screening', 'Sanctions screening', 'provider_required', 'gated', true, 'Requires current sanctions data/provider and documented escalation.'],
  ['kyt', 'Blockchain transaction monitoring', 'provider_required', 'gated', true, 'Requires blockchain analytics data and compliance review.'],
  ['travel-rule', 'Travel Rule workflow', 'provider_required', 'gated', true, 'Requires applicable regulated-entity status, counterparties, and compliant data exchange.'],
  ['geofencing', 'Jurisdiction geofencing', 'engineering_planned', 'available_planning_only', false, 'Define geography-based eligibility gates pending legal review.'],
  ['age-eligibility', 'Age/eligibility controls', 'engineering_planned', 'available_planning_only', false, 'Define eligibility policy and verification requirements.'],
  ['regulatory-approval', 'Regulatory approval or licensing', 'authority_required', 'external_only', false, 'Can only be claimed when the relevant regulator or authority actually grants it.'],
  ['legal-tender-status', 'Legal-tender status', 'authority_required', 'external_only', false, 'Can only exist if a competent government or legal authority establishes it; SKYCOIN4444 cannot self-declare it.'],
  ['issuer-partnership', 'Issuer partnership or endorsement', 'authority_required', 'external_only', false, 'Can only be claimed with a real documented agreement or public authorization from the relevant external party.'],
] as const);

const accountingTax = category('accounting_tax', [
  ['double-entry-ledger', 'Double-entry crypto ledger', 'engineering_planned', 'available_planning_only', false, 'Record debits, credits, asset units, and references deterministically.'],
  ['transaction-history', 'Transaction history', 'provider_required', 'gated', false, 'Requires chain/provider history plus normalized internal events.'],
  ['cost-basis', 'Cost-basis tracking', 'provider_required', 'gated', false, 'Requires complete acquisition/disposal history and tax-method configuration.'],
  ['realized-pnl', 'Realized P&L', 'provider_required', 'gated', false, 'Requires reliable pricing and cost-basis data.'],
  ['unrealized-pnl', 'Unrealized P&L', 'provider_required', 'gated', false, 'Requires live pricing and held-balance data.'],
  ['tax-lots', 'Tax-lot selection', 'engineering_planned', 'available_planning_only', false, 'Plan lot-selection rules without providing tax advice.'],
  ['tax-export', 'Tax data export', 'engineering_planned', 'available_planning_only', false, 'Export normalized transaction records for user/accountant review.'],
  ['reconciliation', 'Wallet/ledger reconciliation', 'provider_required', 'gated', false, 'Compare internal records against externally verified chain balances and history.'],
  ['valuation-snapshots', 'Historical valuation snapshots', 'provider_required', 'gated', false, 'Requires trusted historical pricing data.'],
  ['accounting-audit-trail', 'Accounting audit trail', 'engineering_planned', 'available_planning_only', false, 'Immutable-style event references and change history for accounting records.'],
] as const);

const treasuryEnterprise = category('treasury_enterprise', [
  ['treasury-dashboard', 'Treasury dashboard', 'engineering_planned', 'available_planning_only', false, 'Aggregate policy, balances, exposures, and pending actions once data sources exist.'],
  ['treasury-allowlists', 'Treasury destination allowlists', 'engineering_planned', 'available_planning_only', false, 'Control approved counterparties and wallet destinations.'],
  ['treasury-limits', 'Treasury transaction limits', 'engineering_planned', 'available_planning_only', false, 'Per-action, daily, and rolling value limits.'],
  ['treasury-approvals', 'Treasury approval chains', 'engineering_planned', 'available_planning_only', false, 'Role-based multi-step approvals for sensitive operations.'],
  ['vendor-payments', 'Vendor crypto payments', 'provider_required', 'gated', true, 'Requires counterparty onboarding, payment execution, and reconciliation.'],
  ['payroll', 'Crypto payroll', 'provider_required', 'gated', true, 'Requires employment, tax, payroll, custody/payment, and jurisdictional controls.'],
  ['corporate-cards', 'Crypto-linked corporate card integration', 'provider_required', 'gated', true, 'Requires an issuing/payment partner and program compliance.'],
  ['liquidity-policy', 'Treasury liquidity policy', 'engineering_planned', 'available_planning_only', false, 'Define target reserves, buffers, and rebalance thresholds.'],
  ['counterparty-risk', 'Counterparty risk registry', 'engineering_planned', 'available_planning_only', false, 'Track approved counterparties, evidence, limits, and review dates.'],
  ['enterprise-reporting', 'Enterprise crypto reporting', 'engineering_planned', 'available_planning_only', false, 'Generate internal operational reports from verified records.'],
] as const);

const consumerSocial = category('consumer_social', [
  ['tips', 'User-to-user tips', 'provider_required', 'gated', true, 'Requires wallet execution, abuse controls, limits, and confirmation handling.'],
  ['creator-tips', 'Creator tipping', 'provider_required', 'gated', true, 'Requires creator identity, wallet routing, moderation, and accounting.'],
  ['donations', 'Donation flows', 'provider_required', 'gated', true, 'Requires recipient eligibility, wallet/payment execution, disclosures, and reporting.'],
  ['rewards', 'TRUMP-denominated rewards', 'provider_required', 'gated', true, 'Requires funded inventory, distribution policy, eligibility, accounting, and legal review.'],
  ['loyalty', 'Loyalty points linked to TRUMP activity', 'engineering_planned', 'available_planning_only', false, 'Non-custodial loyalty accounting with explicit separation from asset ownership.'],
  ['gift-links', 'Gift links', 'provider_required', 'gated', true, 'Requires secure claim authorization and transfer execution.'],
  ['social-transfers', 'Social-handle payment requests', 'engineering_planned', 'available_planning_only', false, 'Map handles to user-reviewed wallet destinations without silent execution.'],
  ['commerce-discounts', 'Commerce discounts for eligible holders', 'provider_required', 'gated', false, 'Requires verified ownership proof and merchant policy.'],
  ['membership-gating', 'Token-gated membership', 'provider_required', 'gated', false, 'Requires wallet ownership verification and privacy-safe gating.'],
  ['gaming-rewards', 'Gaming-linked crypto rewards', 'provider_required', 'gated', true, 'Requires jurisdictional review, eligibility, funded rewards, anti-abuse controls, and execution rails.'],
] as const);

const reliabilityOperations = category('reliability_operations', [
  ['idempotency', 'Transaction-request idempotency', 'engineering_planned', 'available_planning_only', false, 'Prevent duplicate execution requests across retries.'],
  ['rate-limits', 'Crypto action rate limits', 'engineering_planned', 'available_planning_only', false, 'Bound sensitive action frequency per actor and risk tier.'],
  ['velocity-limits', 'Value velocity limits', 'engineering_planned', 'available_planning_only', false, 'Rolling amount/count limits before high-risk actions.'],
  ['fraud-signals', 'Fraud signal ingestion', 'provider_required', 'gated', false, 'Requires verified fraud/identity/transaction data.'],
  ['anomaly-detection', 'Transaction anomaly detection', 'provider_required', 'gated', false, 'Requires production telemetry and calibrated models/rules.'],
  ['kill-switch', 'Emergency transaction kill switch', 'engineering_planned', 'available_planning_only', false, 'Fail-closed control to disable side-effecting crypto actions.'],
  ['maintenance-mode', 'Crypto maintenance mode', 'engineering_planned', 'available_planning_only', false, 'Gracefully disable selected crypto surfaces during incidents.'],
  ['audit-events', 'Crypto audit events', 'engineering_planned', 'available_planning_only', false, 'Record actor, policy, decision, and correlation metadata without secrets.'],
  ['webhooks', 'Crypto event webhooks', 'provider_required', 'gated', true, 'Requires signed delivery, retries, dead-lettering, and endpoint security.'],
  ['incident-runbooks', 'Crypto incident runbooks', 'engineering_planned', 'available_planning_only', false, 'Document detection, containment, rollback, evidence, and communication procedures.'],
] as const);

const crosschainEcosystem = category('crosschain_ecosystem', [
  ['tron-identity', 'TRON TRUMP asset identity', 'provider_required', 'gated', false, 'Requires separately verified TRON contract metadata and provider integration.'],
  ['crosschain-identity-map', 'Cross-chain asset identity map', 'provider_required', 'gated', false, 'Relate independently verified network representations without assuming equivalence.'],
  ['bridge-discovery', 'Bridge discovery', 'provider_required', 'gated', false, 'Requires vetted bridge providers and current route data.'],
  ['bridge-execution', 'Cross-chain bridge execution', 'provider_required', 'gated', true, 'Requires audited bridge/provider selection, transaction execution, monitoring, and incident controls.'],
  ['solana-explorer', 'Solana explorer links and evidence', 'provider_required', 'gated', false, 'Generate verified explorer references from current network data.'],
  ['tron-explorer', 'TRON explorer links and evidence', 'provider_required', 'gated', false, 'Generate verified explorer references from current network data.'],
  ['chain-health', 'Blockchain/RPC health monitoring', 'provider_required', 'gated', false, 'Monitor approved RPC/provider health, lag, and error rates.'],
  ['token-account-monitoring', 'Token-account monitoring', 'provider_required', 'gated', false, 'Observe configured accounts without taking control of them.'],
  ['event-indexing', 'On-chain event indexing', 'provider_required', 'gated', false, 'Index verified chain events into normalized read models.'],
  ['ecosystem-api', 'External crypto integration API', 'engineering_planned', 'available_planning_only', false, 'Versioned API contracts for safe metadata, quote, policy, and status surfaces.'],
] as const);

export const OFFICIAL_TRUMP_CAPABILITIES: readonly TrumpCapability[] = Object.freeze([
  ...assetIdentity,
  ...walletsKeys,
  ...transactionsNetwork,
  ...custodySecurity,
  ...tradingLiquidity,
  ...paymentsSettlement,
  ...complianceLegal,
  ...accountingTax,
  ...treasuryEnterprise,
  ...consumerSocial,
  ...reliabilityOperations,
  ...crosschainEcosystem,
]);

export const OFFICIAL_TRUMP_CAPABILITY_COUNT = OFFICIAL_TRUMP_CAPABILITIES.length;

export const OFFICIAL_TRUMP_CAPABILITY_MANIFEST = Object.freeze({
  type: 'skycoin4444.trump-capability-manifest.v1',
  designation: SKYCOIN4444_OFFICIAL_CRYPTO_ASSET.designation,
  asset: OFFICIAL_TRUMP_TOKEN,
  capabilityCount: OFFICIAL_TRUMP_CAPABILITY_COUNT,
  liveSideEffectsEnabled: false,
  legalTenderClaimed: false,
  regulatoryApprovalClaimed: false,
  externalAffiliationClaimed: false,
  custodyClaimed: false,
  settlementClaimed: false,
  automatedTradingClaimed: false,
} as const);

export function getOfficialTrumpCapability(id: string): TrumpCapability | undefined {
  return OFFICIAL_TRUMP_CAPABILITIES.find(capability => capability.id === id);
}

export function listOfficialTrumpCapabilities(
  categoryName: TrumpCapabilityCategory,
): readonly TrumpCapability[] {
  return OFFICIAL_TRUMP_CAPABILITIES.filter(
    capability => capability.category === categoryName,
  );
}

export function assertTrumpCapabilityNotLive(id: string): TrumpCapability {
  const capability = getOfficialTrumpCapability(id);
  if (!capability) throw new Error(`unknown TRUMP capability: ${id}`);
  if (
    capability.availability === 'gated' ||
    capability.availability === 'external_only' ||
    capability.sideEffecting
  ) {
    throw new Error(
      `${id} is not live-enabled in the SKYCOIN4444 engineering beta`,
    );
  }
  return capability;
}
