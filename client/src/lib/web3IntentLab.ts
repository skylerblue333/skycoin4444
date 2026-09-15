export type Web3IntentNetwork = "local" | "testnet";
export type Web3IntentAsset = "SKY444" | "SKYTEST";
export type Web3IntentFeeScenario = "economy" | "standard" | "priority";
export type Web3IntentSafetyCheckId =
  | "recipient"
  | "network"
  | "amount"
  | "irreversible";

export const WEB3_INTENT_HISTORY_KEY = "sky4444.web3-intent-history.v1";
export const WEB3_INTENT_HISTORY_LIMIT = 8;

export const web3IntentAssets: ReadonlyArray<{
  symbol: Web3IntentAsset;
  network: Web3IntentNetwork;
  decimals: 8;
  label: string;
}> = [
  {
    symbol: "SKY444",
    network: "local",
    decimals: 8,
    label: "SKY444 local metadata fixture",
  },
  {
    symbol: "SKYTEST",
    network: "testnet",
    decimals: 8,
    label: "SKYTEST testnet metadata fixture",
  },
];

export const web3IntentFeeScenarios: ReadonlyArray<{
  id: Web3IntentFeeScenario;
  label: string;
  feeMinor: number;
  description: string;
}> = [
  {
    id: "economy",
    label: "Economy fixture",
    feeMinor: 10_000,
    description: "0.00010000 asset units — deterministic fixture, not provider data.",
  },
  {
    id: "standard",
    label: "Standard fixture",
    feeMinor: 50_000,
    description: "0.00050000 asset units — deterministic fixture, not provider data.",
  },
  {
    id: "priority",
    label: "Priority fixture",
    feeMinor: 200_000,
    description: "0.00200000 asset units — deterministic fixture, not provider data.",
  },
];

export const web3IntentSafetyChecks: ReadonlyArray<{
  id: Web3IntentSafetyCheckId;
  label: string;
}> = [
  { id: "recipient", label: "I independently checked the recipient reference." },
  { id: "network", label: "I confirmed the selected network matches the asset fixture." },
  { id: "amount", label: "I reviewed the display amount and fixture fee separately." },
  { id: "irreversible", label: "I understand a real crypto transfer could be irreversible." },
];

export type Web3IntentInput = Readonly<{
  asset: Web3IntentAsset;
  network: Web3IntentNetwork;
  recipientReference: string;
  amount: string;
  feeScenario: Web3IntentFeeScenario;
  acknowledgedChecks: readonly Web3IntentSafetyCheckId[];
}>;

export type Web3IntentAnalysis = Readonly<{
  normalizedRecipient: string;
  amountMinor: number | null;
  amountDisplay: string | null;
  feeMinor: number;
  feeDisplay: string;
  totalDisplay: string | null;
  blockers: readonly string[];
  warnings: readonly string[];
  canSimulate: boolean;
}>;

export type Web3IntentSimulationReceipt = Readonly<{
  contract: "sky.web3.intent-simulation.v1";
  id: string;
  asset: Web3IntentAsset;
  network: Web3IntentNetwork;
  recipientReference: string;
  amountMinor: number;
  amountDisplay: string;
  feeScenario: Web3IntentFeeScenario;
  feeMinor: number;
  feeDisplay: string;
  totalDisplay: string;
  acknowledgedChecks: readonly Web3IntentSafetyCheckId[];
  simulatedAt: string;
  signatureCreated: false;
  broadcastAttempted: false;
  custodyCreated: false;
  provenance: "deterministic-local-simulation";
}>;

const MAX_AMOUNT_MINOR = 100_000_000_000_000;
const SECRET_PATTERN = /\b(seed phrase|recovery phrase|private key|secret key|mnemonic)\b/i;
const VALID_ASSETS = new Set<Web3IntentAsset>(web3IntentAssets.map(asset => asset.symbol));
const VALID_NETWORKS = new Set<Web3IntentNetwork>(["local", "testnet"]);
const VALID_FEES = new Set<Web3IntentFeeScenario>(web3IntentFeeScenarios.map(item => item.id));
const VALID_CHECKS = new Set<Web3IntentSafetyCheckId>(web3IntentSafetyChecks.map(item => item.id));

function normalizeRecipient(value: string) {
  return value.trim().replace(/\s+/g, " ").slice(0, 120);
}

function parseAmountMinor(value: string) {
  const normalized = value.trim();
  if (!/^(?:0|[1-9]\d*)(?:\.\d{1,8})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const wholeMinor = Number(whole) * 100_000_000;
  const fractionMinor = Number((fraction + "00000000").slice(0, 8));
  const total = wholeMinor + fractionMinor;
  if (!Number.isSafeInteger(total) || total <= 0 || total > MAX_AMOUNT_MINOR) return null;
  return total;
}

export function formatWeb3Minor(value: number) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error("value must be a non-negative safe integer");
  }
  const whole = Math.floor(value / 100_000_000);
  const fraction = String(value % 100_000_000).padStart(8, "0");
  return `${whole}.${fraction}`;
}

export function normalizeWeb3SafetyChecks(value: unknown): Web3IntentSafetyCheckId[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(
      value.filter(
        (check): check is Web3IntentSafetyCheckId =>
          typeof check === "string" && VALID_CHECKS.has(check as Web3IntentSafetyCheckId)
      )
    )
  );
}

export function analyzeWeb3Intent(input: Web3IntentInput): Web3IntentAnalysis {
  const asset = web3IntentAssets.find(candidate => candidate.symbol === input.asset);
  const fee = web3IntentFeeScenarios.find(candidate => candidate.id === input.feeScenario)!;
  const normalizedRecipient = normalizeRecipient(input.recipientReference);
  const amountMinor = parseAmountMinor(input.amount);
  const acknowledged = new Set(normalizeWeb3SafetyChecks(input.acknowledgedChecks));
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (!asset) blockers.push("Choose a controlled asset fixture.");
  if (asset && asset.network !== input.network) {
    blockers.push(`Network mismatch: ${asset.symbol} is scoped to the ${asset.network} fixture environment.`);
  }
  if (normalizedRecipient.length < 3) {
    blockers.push("Add a recipient reference with at least 3 characters.");
  }
  if (SECRET_PATTERN.test(normalizedRecipient)) {
    blockers.push("Do not paste recovery material, private keys, or secret keys into a recipient field.");
  }
  if (normalizedRecipient.split(/\s+/).length >= 12) {
    blockers.push("Long word sequences are rejected because they could resemble recovery material.");
  }
  if (amountMinor === null) {
    blockers.push("Enter a positive display amount with no more than 8 decimal places and no more than 1,000,000 units.");
  }
  for (const check of web3IntentSafetyChecks) {
    if (!acknowledged.has(check.id)) blockers.push(`Confirm: ${check.label}`);
  }

  warnings.push("Recipient syntax is not chain-validated; this field is only a local reference for rehearsal.");
  warnings.push("The fee is a deterministic fixture and is not fetched from a wallet, node, RPC provider, or mempool.");
  warnings.push("No balance or affordability check is possible because this sandbox does not hold or query a wallet balance.");

  const amountDisplay = amountMinor === null ? null : formatWeb3Minor(amountMinor);
  const totalDisplay = amountMinor === null ? null : formatWeb3Minor(amountMinor + fee.feeMinor);

  return {
    normalizedRecipient,
    amountMinor,
    amountDisplay,
    feeMinor: fee.feeMinor,
    feeDisplay: formatWeb3Minor(fee.feeMinor),
    totalDisplay,
    blockers,
    warnings,
    canSimulate: blockers.length === 0,
  };
}

function stableSimulationId(input: Web3IntentInput, simulatedAt: string) {
  const source = [
    input.asset,
    input.network,
    normalizeRecipient(input.recipientReference),
    input.amount.trim(),
    input.feeScenario,
    simulatedAt,
  ].join("|");
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `web3-sim:${(hash >>> 0).toString(36)}`;
}

export function createWeb3IntentSimulation(
  input: Web3IntentInput,
  simulatedAt = new Date().toISOString()
): Web3IntentSimulationReceipt {
  const analysis = analyzeWeb3Intent(input);
  if (!analysis.canSimulate || analysis.amountMinor === null || !analysis.amountDisplay || !analysis.totalDisplay) {
    throw new Error(analysis.blockers[0] ?? "Intent is not ready for simulation.");
  }
  if (!Number.isFinite(Date.parse(simulatedAt))) {
    throw new Error("simulatedAt must be a valid timestamp");
  }

  return Object.freeze({
    contract: "sky.web3.intent-simulation.v1",
    id: stableSimulationId(input, simulatedAt),
    asset: input.asset,
    network: input.network,
    recipientReference: analysis.normalizedRecipient,
    amountMinor: analysis.amountMinor,
    amountDisplay: analysis.amountDisplay,
    feeScenario: input.feeScenario,
    feeMinor: analysis.feeMinor,
    feeDisplay: analysis.feeDisplay,
    totalDisplay: analysis.totalDisplay,
    acknowledgedChecks: Object.freeze(normalizeWeb3SafetyChecks(input.acknowledgedChecks)),
    simulatedAt,
    signatureCreated: false,
    broadcastAttempted: false,
    custodyCreated: false,
    provenance: "deterministic-local-simulation",
  });
}

function normalizeSimulation(value: unknown): Web3IntentSimulationReceipt | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const receipt = value as Record<string, unknown>;
  if (
    receipt.contract !== "sky.web3.intent-simulation.v1" ||
    typeof receipt.id !== "string" ||
    !receipt.id.startsWith("web3-sim:") ||
    !VALID_ASSETS.has(receipt.asset as Web3IntentAsset) ||
    !VALID_NETWORKS.has(receipt.network as Web3IntentNetwork) ||
    typeof receipt.recipientReference !== "string" ||
    receipt.recipientReference.trim().length < 3 ||
    !Number.isSafeInteger(receipt.amountMinor) ||
    Number(receipt.amountMinor) <= 0 ||
    typeof receipt.amountDisplay !== "string" ||
    !VALID_FEES.has(receipt.feeScenario as Web3IntentFeeScenario) ||
    !Number.isSafeInteger(receipt.feeMinor) ||
    typeof receipt.feeDisplay !== "string" ||
    typeof receipt.totalDisplay !== "string" ||
    typeof receipt.simulatedAt !== "string" ||
    !Number.isFinite(Date.parse(receipt.simulatedAt)) ||
    receipt.signatureCreated !== false ||
    receipt.broadcastAttempted !== false ||
    receipt.custodyCreated !== false ||
    receipt.provenance !== "deterministic-local-simulation"
  ) {
    return null;
  }

  const acknowledgedChecks = normalizeWeb3SafetyChecks(receipt.acknowledgedChecks);
  if (acknowledgedChecks.length !== web3IntentSafetyChecks.length) return null;

  return {
    contract: "sky.web3.intent-simulation.v1",
    id: receipt.id,
    asset: receipt.asset as Web3IntentAsset,
    network: receipt.network as Web3IntentNetwork,
    recipientReference: normalizeRecipient(receipt.recipientReference),
    amountMinor: Number(receipt.amountMinor),
    amountDisplay: receipt.amountDisplay,
    feeScenario: receipt.feeScenario as Web3IntentFeeScenario,
    feeMinor: Number(receipt.feeMinor),
    feeDisplay: receipt.feeDisplay,
    totalDisplay: receipt.totalDisplay,
    acknowledgedChecks,
    simulatedAt: receipt.simulatedAt,
    signatureCreated: false,
    broadcastAttempted: false,
    custodyCreated: false,
    provenance: "deterministic-local-simulation",
  };
}

export function normalizeWeb3IntentHistory(value: unknown): Web3IntentSimulationReceipt[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, Web3IntentSimulationReceipt>();
  for (const candidate of value) {
    const receipt = normalizeSimulation(candidate);
    if (!receipt || unique.has(receipt.id)) continue;
    unique.set(receipt.id, receipt);
  }
  return Array.from(unique.values())
    .sort((left, right) => right.simulatedAt.localeCompare(left.simulatedAt))
    .slice(0, WEB3_INTENT_HISTORY_LIMIT);
}

export function addWeb3IntentSimulation(
  history: readonly Web3IntentSimulationReceipt[],
  receipt: Web3IntentSimulationReceipt
) {
  return normalizeWeb3IntentHistory([receipt, ...history]);
}
