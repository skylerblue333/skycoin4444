import { createHash } from "node:crypto";
import type { Express, Request, Response } from "express";
import {
  createBlock,
  type LedgerTransfer,
} from "../../packages/sky4-core-ledger/src/index";
import {
  applyPlannedDebit,
  planTransfer,
} from "../../packages/sky4-wallet-engine/src/index";
import { sdk } from "./sdk";

type NetworkState = "online" | "offline" | "unconfigured";

export type NetworkProbe = Readonly<{
  id: "bitcoin-core" | "ethereum-json-rpc" | "solana-agave";
  label: string;
  openSourceRuntime: string;
  configured: boolean;
  state: NetworkState;
  detail: string;
  height?: string;
  chain?: string;
  version?: string;
}>;

type JsonRpcResponse<T> = {
  result?: T;
  error?: { code?: number; message?: string };
};

const SAFE_ID = /^[A-Za-z0-9:_-]{3,128}$/;
const HASH_RE = /^[a-f0-9]{64}$/;
const DECIMAL_RE = /^\d+$/;
const DEFAULT_RPC_TIMEOUT_MS = 3_500;

function parseBoundedInteger(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+$/.test(value)
        ? Number(value)
        : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(field + " must be an integer from " + minimum + " to " + maximum);
  }
  return parsed;
}

function parseUnsignedBigInt(value: unknown, field: string, positive = false): bigint {
  if (typeof value !== "string" || !DECIMAL_RE.test(value)) {
    throw new Error(field + " must be an unsigned decimal string");
  }
  const parsed = BigInt(value);
  if (positive ? parsed <= 0n : parsed < 0n) {
    throw new Error(field + (positive ? " must be positive" : " must be non-negative"));
  }
  return parsed;
}

function requireSafeId(value: unknown, field: string): string {
  if (typeof value !== "string" || !SAFE_ID.test(value.trim())) {
    throw new Error(field + " must be 3-128 safe characters");
  }
  return value.trim();
}

function requireHash(value: unknown, field: string): string {
  if (typeof value !== "string" || !HASH_RE.test(value)) {
    throw new Error(field + " must be a lowercase SHA-256 digest");
  }
  return value;
}

function leadingZeroNibbles(hash: string): number {
  let count = 0;
  while (count < hash.length && hash[count] === "0") count += 1;
  return count;
}

export async function runHashingBenchmark(input: {
  iterations: unknown;
  difficultyHexZeros: unknown;
  seed: unknown;
}) {
  const iterations = parseBoundedInteger(input.iterations, "iterations", 1_000, 200_000);
  const difficultyHexZeros = parseBoundedInteger(
    input.difficultyHexZeros,
    "difficultyHexZeros",
    1,
    5,
  );
  if (typeof input.seed !== "string" || input.seed.trim().length < 3 || input.seed.length > 128) {
    throw new Error("seed must be 3-128 characters");
  }

  const seed = input.seed.trim();
  const targetPrefix = "0".repeat(difficultyHexZeros);
  const startedAt = process.hrtime.bigint();
  let shares = 0;
  let bestHash = "f".repeat(64);
  let bestNonce = 0;
  let bestScore = -1;

  for (let nonce = 0; nonce < iterations; nonce += 1) {
    const hash = createHash("sha256")
      .update(seed + ":" + nonce, "utf8")
      .digest("hex");
    if (hash.startsWith(targetPrefix)) shares += 1;
    const score = leadingZeroNibbles(hash);
    if (score > bestScore || (score === bestScore && hash < bestHash)) {
      bestScore = score;
      bestHash = hash;
      bestNonce = nonce;
    }
    if (nonce > 0 && nonce % 5_000 === 0) {
      await new Promise<void>(resolve => setImmediate(resolve));
    }
  }

  const elapsedNs = process.hrtime.bigint() - startedAt;
  const elapsedMs = Math.max(1, Number(elapsedNs / 1_000_000n));
  const hashRateHps = Math.round(iterations / (elapsedMs / 1_000));

  return Object.freeze({
    mode: "local-sha256-benchmark",
    hashes: iterations,
    difficultyHexZeros,
    shares,
    bestNonce,
    bestHash,
    bestLeadingHexZeros: bestScore,
    elapsedMs,
    hashRateHps,
    payout: null,
    networkSubmission: false,
    note:
      "Real SHA-256 work was performed by this server process. This is a bounded engineering benchmark, not pooled mining and not a claim of coin rewards.",
  });
}

export function planSandboxTransfer(input: {
  sourceAccountId: unknown;
  destination: unknown;
  balance: unknown;
  amount: unknown;
  fee: unknown;
  nonce: unknown;
}) {
  const sourceAccountId = requireSafeId(input.sourceAccountId, "sourceAccountId");
  const destination = requireSafeId(input.destination, "destination");
  const balance = parseUnsignedBigInt(input.balance, "balance");
  const amount = parseUnsignedBigInt(input.amount, "amount", true);
  const fee = parseUnsignedBigInt(input.fee, "fee");
  const nonce = parseUnsignedBigInt(input.nonce, "nonce");
  const publicKey = createHash("sha256")
    .update("sky4-local-wallet:" + sourceAccountId, "utf8")
    .digest("hex");

  const account = {
    accountId: sourceAccountId,
    publicKey,
    balance,
    nextNonce: nonce,
  } as const;
  const plan = planTransfer({ account, destination, amount, fee });
  const nextAccount = applyPlannedDebit(account, plan);

  return Object.freeze({
    mode: "local-transfer-plan",
    plan: {
      accountId: plan.accountId,
      destination: plan.destination,
      amount: plan.amount.toString(),
      fee: plan.fee.toString(),
      nonce: plan.nonce.toString(),
      planId: plan.planId,
    },
    projectedAccount: {
      accountId: nextAccount.accountId,
      balance: nextAccount.balance.toString(),
      nextNonce: nextAccount.nextNonce.toString(),
    },
    signed: false,
    broadcast: false,
    custody: false,
  });
}

export function buildSandboxBlock(input: {
  height: unknown;
  previousHash: unknown;
  transfers: unknown;
}) {
  const height = parseUnsignedBigInt(input.height, "height");
  const previousHash = requireHash(input.previousHash, "previousHash");
  if (!Array.isArray(input.transfers) || input.transfers.length < 1 || input.transfers.length > 100) {
    throw new Error("transfers must contain 1-100 items");
  }

  const transfers: LedgerTransfer[] = input.transfers.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("transfer " + index + " must be an object");
    }
    const transfer = item as Record<string, unknown>;
    return {
      from: requireSafeId(transfer.from, "transfer.from"),
      to: requireSafeId(transfer.to, "transfer.to"),
      amount: parseUnsignedBigInt(transfer.amount, "transfer.amount", true),
      nonce: parseUnsignedBigInt(transfer.nonce, "transfer.nonce"),
    };
  });

  const block = createBlock({ height, previousHash, transfers });
  return Object.freeze({
    mode: "local-ledger-block",
    block: {
      height: block.height.toString(),
      previousHash: block.previousHash,
      transfers: block.transfers.map(transfer => ({
        from: transfer.from,
        to: transfer.to,
        amount: transfer.amount.toString(),
        nonce: transfer.nonce.toString(),
      })),
      hash: block.hash,
    },
    consensusSubmitted: false,
    broadcast: false,
  });
}

async function rpcCall<T>(
  url: string,
  method: string,
  params: readonly unknown[] = [],
  headers: Record<string, string> = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_RPC_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ jsonrpc: "2.0", id: "skycoin4444", method, params }),
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }
    const payload = (await response.json()) as JsonRpcResponse<T>;
    if (payload.error) {
      throw new Error(payload.error.message || "JSON-RPC error");
    }
    if (payload.result === undefined) {
      throw new Error("JSON-RPC response did not include result");
    }
    return payload.result;
  } finally {
    clearTimeout(timeout);
  }
}

function configuredUrl(value: string | undefined): string | null {
  if (!value?.trim()) return null;
  const url = new URL(value.trim());
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("RPC URL must use http:// or https://");
  }
  return url.toString();
}

async function probeBitcoin(env: NodeJS.ProcessEnv): Promise<NetworkProbe> {
  let url: string | null;
  try {
    url = configuredUrl(env.BITCOIN_RPC_URL);
  } catch (error) {
    return {
      id: "bitcoin-core",
      label: "Bitcoin",
      openSourceRuntime: "Bitcoin Core (MIT)",
      configured: true,
      state: "offline",
      detail: error instanceof Error ? error.message : "Invalid Bitcoin RPC URL",
    };
  }
  if (!url) {
    return {
      id: "bitcoin-core",
      label: "Bitcoin",
      openSourceRuntime: "Bitcoin Core (MIT)",
      configured: false,
      state: "unconfigured",
      detail: "Set BITCOIN_RPC_URL and optional BITCOIN_RPC_USER/BITCOIN_RPC_PASSWORD.",
    };
  }
  try {
    const auth =
      env.BITCOIN_RPC_USER && env.BITCOIN_RPC_PASSWORD
        ? {
            authorization:
              "Basic " +
              Buffer.from(
                env.BITCOIN_RPC_USER + ":" + env.BITCOIN_RPC_PASSWORD,
                "utf8",
              ).toString("base64"),
          }
        : {};
    const info = await rpcCall<{
      chain?: string;
      blocks?: number;
      headers?: number;
      bestblockhash?: string;
    }>(url, "getblockchaininfo", [], auth);
    return {
      id: "bitcoin-core",
      label: "Bitcoin",
      openSourceRuntime: "Bitcoin Core (MIT)",
      configured: true,
      state: "online",
      detail: "Read-only node probe succeeded.",
      height: String(info.blocks ?? "unknown"),
      chain: info.chain ?? "unknown",
      version: info.bestblockhash ? "best block " + info.bestblockhash.slice(0, 12) + "…" : undefined,
    };
  } catch (error) {
    return {
      id: "bitcoin-core",
      label: "Bitcoin",
      openSourceRuntime: "Bitcoin Core (MIT)",
      configured: true,
      state: "offline",
      detail: error instanceof Error ? error.message : "Bitcoin RPC probe failed",
    };
  }
}

async function probeEthereum(env: NodeJS.ProcessEnv): Promise<NetworkProbe> {
  let url: string | null;
  try {
    url = configuredUrl(env.ETHEREUM_RPC_URL);
  } catch (error) {
    return {
      id: "ethereum-json-rpc",
      label: "Ethereum / EVM",
      openSourceRuntime: "Standard EVM JSON-RPC (viem-compatible)",
      configured: true,
      state: "offline",
      detail: error instanceof Error ? error.message : "Invalid Ethereum RPC URL",
    };
  }
  if (!url) {
    return {
      id: "ethereum-json-rpc",
      label: "Ethereum / EVM",
      openSourceRuntime: "Standard EVM JSON-RPC (viem-compatible)",
      configured: false,
      state: "unconfigured",
      detail: "Set ETHEREUM_RPC_URL to a trusted EVM node.",
    };
  }
  try {
    const [chainId, blockNumber] = await Promise.all([
      rpcCall<string>(url, "eth_chainId"),
      rpcCall<string>(url, "eth_blockNumber"),
    ]);
    return {
      id: "ethereum-json-rpc",
      label: "Ethereum / EVM",
      openSourceRuntime: "Standard EVM JSON-RPC (viem-compatible)",
      configured: true,
      state: "online",
      detail: "Read-only node probe succeeded.",
      height: BigInt(blockNumber).toString(),
      chain: BigInt(chainId).toString(),
    };
  } catch (error) {
    return {
      id: "ethereum-json-rpc",
      label: "Ethereum / EVM",
      openSourceRuntime: "Standard EVM JSON-RPC (viem-compatible)",
      configured: true,
      state: "offline",
      detail: error instanceof Error ? error.message : "Ethereum RPC probe failed",
    };
  }
}

async function probeSolana(env: NodeJS.ProcessEnv): Promise<NetworkProbe> {
  let url: string | null;
  try {
    url = configuredUrl(env.SOLANA_RPC_URL);
  } catch (error) {
    return {
      id: "solana-agave",
      label: "Solana",
      openSourceRuntime: "Agave validator (Apache-2.0)",
      configured: true,
      state: "offline",
      detail: error instanceof Error ? error.message : "Invalid Solana RPC URL",
    };
  }
  if (!url) {
    return {
      id: "solana-agave",
      label: "Solana",
      openSourceRuntime: "Agave validator (Apache-2.0)",
      configured: false,
      state: "unconfigured",
      detail: "Set SOLANA_RPC_URL to a trusted Agave/Solana RPC node.",
    };
  }
  try {
    const [health, slot, version] = await Promise.all([
      rpcCall<string>(url, "getHealth"),
      rpcCall<number>(url, "getSlot"),
      rpcCall<Record<string, string>>(url, "getVersion"),
    ]);
    return {
      id: "solana-agave",
      label: "Solana",
      openSourceRuntime: "Agave validator (Apache-2.0)",
      configured: true,
      state: health === "ok" ? "online" : "offline",
      detail: health === "ok" ? "Read-only node probe succeeded." : "Node health returned " + health,
      height: String(slot),
      chain: "solana",
      version: version["solana-core"] ?? version["feature-set"],
    };
  } catch (error) {
    return {
      id: "solana-agave",
      label: "Solana",
      openSourceRuntime: "Agave validator (Apache-2.0)",
      configured: true,
      state: "offline",
      detail: error instanceof Error ? error.message : "Solana RPC probe failed",
    };
  }
}

export async function probeOpenSourceNetworks(
  env: NodeJS.ProcessEnv = process.env,
): Promise<readonly NetworkProbe[]> {
  return Promise.all([probeBitcoin(env), probeEthereum(env), probeSolana(env)]);
}

async function requireAuthenticatedUser(req: Request, res: Response) {
  try {
    return await sdk.authenticateRequest(req);
  } catch {
    res.status(401).json({ error: "authentication required" });
    return null;
  }
}

function sendValidationError(res: Response, error: unknown) {
  res.status(400).json({
    error: error instanceof Error ? error.message : "invalid request",
  });
}

export function registerCryptoLabRoutes(app: Express) {
  app.get("/api/crypto-lab/status", (_req, res) => {
    res.json({
      mode: "engineering-beta",
      liveSigning: false,
      liveBroadcast: false,
      custody: false,
      capabilities: [
        "bounded SHA-256 server benchmark",
        "read-only open-source node probes",
        "deterministic local wallet transfer planning",
        "deterministic local ledger block construction",
      ],
    });
  });

  app.get("/api/crypto-lab/networks", async (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ networks: await probeOpenSourceNetworks() });
  });

  app.post("/api/crypto-lab/mining/benchmark", async (req, res) => {
    if (!(await requireAuthenticatedUser(req, res))) return;
    try {
      res.json(await runHashingBenchmark(req.body ?? {}));
    } catch (error) {
      sendValidationError(res, error);
    }
  });

  app.post("/api/crypto-lab/transfer/plan", async (req, res) => {
    if (!(await requireAuthenticatedUser(req, res))) return;
    try {
      res.json(planSandboxTransfer(req.body ?? {}));
    } catch (error) {
      sendValidationError(res, error);
    }
  });

  app.post("/api/crypto-lab/block/build", async (req, res) => {
    if (!(await requireAuthenticatedUser(req, res))) return;
    try {
      res.json(buildSandboxBlock(req.body ?? {}));
    } catch (error) {
      sendValidationError(res, error);
    }
  });
}
