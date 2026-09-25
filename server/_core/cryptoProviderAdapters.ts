import { createHash, randomUUID } from "node:crypto";
import net from "node:net";
import tls from "node:tls";
import type { Express, Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { sdk } from "./sdk";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";

const DEFAULT_TIMEOUT_MS = 5_000;
const ADDRESS_RE = /^0x[a-fA-F0-9]{40}$/;
const HASH_32_RE = /^0x[a-fA-F0-9]{64}$/;
const HEX_RE = /^[a-fA-F0-9]+$/;
const DECIMAL_RE = /^\d+$/;
const SAFE_REF_RE = /^[A-Za-z0-9:_./-]{1,255}$/;
const ASSET_RE = /^[A-Z0-9._-]{2,20}$/;
const BPS_MAX = 10_000n;

type JsonRecord = Record<string, unknown>;

type ProviderEventInput = Readonly<{
  userId?: string | null;
  provider: string;
  eventType: string;
  asset?: string | null;
  amountAtomic?: string | null;
  externalRef?: string | null;
  txHash?: string | null;
  status: string;
  metadata?: JsonRecord | null;
}>;

type StratumConfig = Readonly<{
  host: string;
  port: number;
  username: string;
  password: string;
  useTls: boolean;
  submitEnabled: boolean;
}>;

type MiningPayout = Readonly<{
  id: string;
  asset: string;
  amountAtomic: string;
  txHash: string | null;
  status: string;
  createdAt: string | null;
}>;

type MainnetPolicyInput = Readonly<{
  chainId: number;
  to: string;
  valueWei: bigint;
  purpose: "transfer" | "dex-swap";
}>;

function envTrue(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

function splitCsv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}

function requirePositiveInteger(value: unknown, field: string, maximum = 2_147_483_647): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string" && DECIMAL_RE.test(value)
        ? Number(value)
        : Number.NaN;
  if (!Number.isSafeInteger(parsed) || parsed < 1 || parsed > maximum) {
    throw new Error(field + " must be a positive integer");
  }
  return parsed;
}

function requireDecimal(value: unknown, field: string, positive = false): bigint {
  if (typeof value !== "string" || !DECIMAL_RE.test(value)) {
    throw new Error(field + " must be an unsigned integer string");
  }
  const parsed = BigInt(value);
  if (positive ? parsed <= 0n : parsed < 0n) {
    throw new Error(field + (positive ? " must be positive" : " must be non-negative"));
  }
  return parsed;
}

function requireAddress(value: unknown, field: string): string {
  if (typeof value !== "string" || !ADDRESS_RE.test(value.trim())) {
    throw new Error(field + " must be a 20-byte EVM address");
  }
  return value.trim();
}

function requireHash32(value: unknown, field: string): string {
  if (typeof value !== "string" || !HASH_32_RE.test(value.trim())) {
    throw new Error(field + " must be a 32-byte 0x-prefixed hash");
  }
  return value.trim();
}

function requireSafeRef(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(field + " is required");
  const normalized = value.trim();
  if (!SAFE_REF_RE.test(normalized)) {
    throw new Error(field + " contains unsupported characters");
  }
  return normalized;
}

function requireAsset(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(field + " is required");
  const normalized = value.trim().toUpperCase();
  if (!ASSET_RE.test(normalized)) throw new Error(field + " is invalid");
  return normalized;
}

function timeoutMs(env: NodeJS.ProcessEnv = process.env): number {
  const raw = env.CRYPTO_PROVIDER_TIMEOUT_MS?.trim();
  if (!raw) return DEFAULT_TIMEOUT_MS;
  const parsed = Number(raw);
  return Number.isInteger(parsed) && parsed >= 500 && parsed <= 30_000
    ? parsed
    : DEFAULT_TIMEOUT_MS;
}

function abortAfter(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
}

function normalizeBaseUrl(raw: string, field: string): URL {
  const url = new URL(raw);
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(field + " must use http:// or https://");
  }
  return url;
}

function stableHash(prefix: string, value: unknown): string {
  return (
    prefix +
    ":" +
    createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex")
  );
}

function redactMetadata(metadata: JsonRecord | null | undefined): string | null {
  if (!metadata) return null;
  const serialized = JSON.stringify(metadata);
  return serialized.length <= 8_000 ? serialized : serialized.slice(0, 8_000);
}

export async function persistProviderEvent(input: ProviderEventInput): Promise<boolean> {
  try {
    const database = await getDb();
    const externalRef = input.externalRef ?? null;
    const existing = externalRef
      ? await database.query.cryptoProviderEvents.findFirst({
          where: and(
            eq(schema.cryptoProviderEvents.provider, input.provider),
            eq(schema.cryptoProviderEvents.externalRef, externalRef),
          ),
        })
      : null;

    const values = {
      userId: input.userId ?? null,
      provider: input.provider,
      eventType: input.eventType,
      asset: input.asset ?? null,
      amountAtomic: input.amountAtomic ?? null,
      externalRef,
      txHash: input.txHash ?? null,
      status: input.status,
      metadata: redactMetadata(input.metadata),
      updatedAt: new Date(),
    };

    if (existing) {
      await database
        .update(schema.cryptoProviderEvents)
        .set(values)
        .where(eq(schema.cryptoProviderEvents.id, existing.id));
    } else {
      await database.insert(schema.cryptoProviderEvents).values({
        id: randomUUID(),
        ...values,
        createdAt: new Date(),
      });
    }
    return true;
  } catch {
    return false;
  }
}

export function cryptoProviderConfigSnapshot(env: NodeJS.ProcessEnv = process.env) {
  let stratumConfigured = false;
  try {
    stratumConfigured = Boolean(readStratumConfig(env));
  } catch {
    stratumConfigured = false;
  }

  return Object.freeze({
    contract: "sky.crypto.provider-runtime.v1",
    stratum: {
      configured: stratumConfigured,
      shareSubmissionEnabled: envTrue(env.STRATUM_SHARE_SUBMISSION_ENABLED),
    },
    miningPayouts: {
      configured: Boolean(env.MINING_PAYOUT_API_URL?.trim()),
    },
    dex: {
      provider: "0x-swap-api-v2",
      configured: Boolean(env.ZEROX_API_KEY?.trim()),
      liveQuoteEnabled: Boolean(env.ZEROX_API_KEY?.trim()),
      serverExecutionEnabled: false,
    },
    mainnetPolicy: {
      enabled: envTrue(env.CRYPTO_MAINNET_ENABLED),
      allowedChainIds: splitCsv(env.CRYPTO_MAINNET_ALLOWED_CHAIN_IDS),
      destinationAllowlistCount: splitCsv(env.CRYPTO_MAINNET_DESTINATION_ALLOWLIST).length,
    },
    custody: {
      openBaoConfigured: Boolean(
        env.OPENBAO_URL?.trim() &&
          env.OPENBAO_TOKEN?.trim() &&
          env.OPENBAO_TRANSIT_KEY?.trim(),
      ),
      openBaoSigningEnabled: envTrue(env.OPENBAO_SIGNING_ENABLED),
      mpcGatewayConfigured: Boolean(
        env.MPC_SIGNER_URL?.trim() &&
          env.MPC_SIGNER_TOKEN?.trim() &&
          env.MPC_KEY_ID?.trim(),
      ),
      mpcSigningEnabled: envTrue(env.MPC_SIGNING_ENABLED),
    },
    reconciliation: {
      evmRpcConfigured: Boolean(env.ETHEREUM_RPC_URL?.trim() || env.EVM_RPC_URLS_JSON?.trim()),
      solanaRpcConfigured: Boolean(env.SOLANA_RPC_URL?.trim()),
      bitcoinRpcConfigured: Boolean(env.BITCOIN_RPC_URL?.trim()),
      durableEventLedgerConfigured: Boolean(env.DATABASE_URL?.trim()),
    },
  });
}

function readStratumConfig(env: NodeJS.ProcessEnv = process.env): StratumConfig | null {
  const host = env.STRATUM_HOST?.trim();
  const portRaw = env.STRATUM_PORT?.trim();
  const username = env.STRATUM_USERNAME?.trim();
  const password = env.STRATUM_PASSWORD ?? "";
  if (!host && !portRaw && !username) return null;
  if (!host || !portRaw || !username) {
    throw new Error("STRATUM_HOST, STRATUM_PORT, and STRATUM_USERNAME must be configured together");
  }
  if (host.length > 255 || /\s/.test(host)) throw new Error("STRATUM_HOST is invalid");
  const port = Number(portRaw);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("STRATUM_PORT must be a valid TCP port");
  }
  return Object.freeze({
    host,
    port,
    username,
    password,
    useTls: envTrue(env.STRATUM_TLS),
    submitEnabled: envTrue(env.STRATUM_SHARE_SUBMISSION_ENABLED),
  });
}

type StratumSocket = net.Socket | tls.TLSSocket;

function connectStratum(config: StratumConfig, ms: number): Promise<StratumSocket> {
  return new Promise((resolve, reject) => {
    const socket = config.useTls
      ? tls.connect({
          host: config.host,
          port: config.port,
          servername: config.host,
          rejectUnauthorized: true,
        })
      : net.createConnection({ host: config.host, port: config.port });

    const timer = setTimeout(() => {
      socket.destroy(new Error("Stratum connection timed out"));
    }, ms);

    const cleanup = () => clearTimeout(timer);
    socket.once("error", error => {
      cleanup();
      reject(error);
    });
    const event = config.useTls ? "secureConnect" : "connect";
    socket.once(event, () => {
      cleanup();
      socket.setEncoding("utf8");
      resolve(socket);
    });
  });
}

function stratumRequest(
  socket: StratumSocket,
  id: number,
  method: string,
  params: readonly unknown[],
  ms: number,
): Promise<JsonRecord> {
  return new Promise((resolve, reject) => {
    let buffer = "";
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Stratum request timed out: " + method));
    }, ms);

    const onData = (chunk: string | Buffer) => {
      buffer += chunk.toString();
      while (buffer.includes("\n")) {
        const index = buffer.indexOf("\n");
        const line = buffer.slice(0, index).trim();
        buffer = buffer.slice(index + 1);
        if (!line) continue;
        let parsed: unknown;
        try {
          parsed = JSON.parse(line);
        } catch {
          continue;
        }
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
        const record = parsed as JsonRecord;
        if (record.id === id) {
          cleanup();
          if (record.error) {
            reject(new Error("Stratum " + method + " rejected: " + JSON.stringify(record.error)));
          } else {
            resolve(record);
          }
          return;
        }
      }
    };

    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error("Stratum connection closed before response: " + method));
    };
    const cleanup = () => {
      clearTimeout(timer);
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    socket.on("data", onData);
    socket.once("error", onError);
    socket.once("close", onClose);
    socket.write(JSON.stringify({ id, method, params }) + "\n");
  });
}

async function withAuthorizedStratum<T>(
  env: NodeJS.ProcessEnv,
  operation: (socket: StratumSocket, config: StratumConfig) => Promise<T>,
): Promise<T> {
  const config = readStratumConfig(env);
  if (!config) throw new Error("Stratum pool is not configured");
  const ms = timeoutMs(env);
  const socket = await connectStratum(config, ms);
  try {
    await stratumRequest(socket, 1, "mining.subscribe", ["SKYCOIN4444/1.0"], ms);
    const authorize = await stratumRequest(
      socket,
      2,
      "mining.authorize",
      [config.username, config.password],
      ms,
    );
    if (authorize.result !== true) {
      throw new Error("Stratum credentials were not authorized by the pool");
    }
    return await operation(socket, config);
  } finally {
    socket.end();
    socket.destroy();
  }
}

export async function probeStratumPool(env: NodeJS.ProcessEnv = process.env) {
  const config = readStratumConfig(env);
  if (!config) {
    return Object.freeze({
      configured: false,
      connected: false,
      authorized: false,
      shareSubmissionEnabled: false,
    });
  }
  const started = Date.now();
  return withAuthorizedStratum(env, async () =>
    Object.freeze({
      configured: true,
      connected: true,
      authorized: true,
      tls: config.useTls,
      host: config.host,
      port: config.port,
      latencyMs: Date.now() - started,
      shareSubmissionEnabled: config.submitEnabled,
    }),
  );
}

export async function submitStratumShare(
  input: {
    jobId: unknown;
    extraNonce2: unknown;
    ntime: unknown;
    nonce: unknown;
  },
  env: NodeJS.ProcessEnv = process.env,
) {
  const config = readStratumConfig(env);
  if (!config) throw new Error("Stratum pool is not configured");
  if (!config.submitEnabled) {
    throw new Error("Stratum share submission is disabled by operator policy");
  }

  const jobId = requireSafeRef(input.jobId, "jobId");
  const extraNonce2 = requireSafeRef(input.extraNonce2, "extraNonce2");
  const ntime = requireSafeRef(input.ntime, "ntime");
  const nonce = requireSafeRef(input.nonce, "nonce");
  if (!HEX_RE.test(extraNonce2) || extraNonce2.length > 64) {
    throw new Error("extraNonce2 must be hexadecimal");
  }
  if (!/^[a-fA-F0-9]{8}$/.test(ntime)) throw new Error("ntime must be 8 hex characters");
  if (!/^[a-fA-F0-9]{8}$/.test(nonce)) throw new Error("nonce must be 8 hex characters");

  const started = Date.now();
  const response = await withAuthorizedStratum(env, (socket, authorizedConfig) =>
    stratumRequest(
      socket,
      3,
      "mining.submit",
      [authorizedConfig.username, jobId, extraNonce2, ntime, nonce],
      timeoutMs(env),
    ),
  );

  return Object.freeze({
    provider: "stratum-v1",
    submitted: true,
    accepted: response.result === true,
    poolResponse: response.result ?? null,
    latencyMs: Date.now() - started,
    shareRef: stableHash("share", { jobId, extraNonce2, ntime, nonce }),
  });
}

function miningPayoutConfig(env: NodeJS.ProcessEnv) {
  const rawUrl = env.MINING_PAYOUT_API_URL?.trim();
  if (!rawUrl) return null;
  const url = normalizeBaseUrl(rawUrl, "MINING_PAYOUT_API_URL");
  return {
    url,
    token: env.MINING_PAYOUT_API_TOKEN?.trim() || null,
    provider: env.MINING_PAYOUT_PROVIDER?.trim() || "mining-pool",
  };
}

function parsePayout(raw: unknown, index: number): MiningPayout {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("payout " + index + " must be an object");
  }
  const payout = raw as JsonRecord;
  const id = requireSafeRef(payout.id, "payout.id");
  const asset = requireAsset(payout.asset, "payout.asset");
  const amountAtomic = requireDecimal(payout.amountAtomic, "payout.amountAtomic").toString();
  const txHash =
    payout.txHash === null || payout.txHash === undefined
      ? null
      : requireSafeRef(payout.txHash, "payout.txHash");
  const status = requireSafeRef(payout.status, "payout.status");
  const createdAt =
    typeof payout.createdAt === "string" && payout.createdAt.length <= 64
      ? payout.createdAt
      : null;
  return Object.freeze({ id, asset, amountAtomic, txHash, status, createdAt });
}

export async function fetchMiningPayouts(env: NodeJS.ProcessEnv = process.env) {
  const config = miningPayoutConfig(env);
  if (!config) throw new Error("MINING_PAYOUT_API_URL is not configured");
  const { controller, timer } = abortAfter(timeoutMs(env));
  try {
    const response = await fetch(config.url, {
      headers: config.token ? { authorization: "Bearer " + config.token } : {},
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Mining payout provider returned HTTP " + response.status);
    const payload = (await response.json()) as unknown;
    const payoutArray =
      Array.isArray(payload)
        ? payload
        : payload && typeof payload === "object" && Array.isArray((payload as JsonRecord).payouts)
          ? ((payload as JsonRecord).payouts as unknown[])
          : null;
    if (!payoutArray) throw new Error("Mining payout provider response must contain payouts[]");
    if (payoutArray.length > 500) throw new Error("Mining payout provider returned too many records");
    return Object.freeze({
      provider: config.provider,
      payouts: payoutArray.map(parsePayout),
    });
  } finally {
    clearTimeout(timer);
  }
}

export function reconcileMiningPayouts(
  expectedAtomic: unknown,
  payouts: readonly MiningPayout[],
) {
  const expected = requireDecimal(expectedAtomic, "expectedAtomic");
  const settledStatuses = new Set(["paid", "settled", "confirmed", "complete", "completed"]);
  let observed = 0n;
  let pending = 0n;
  for (const payout of payouts) {
    const amount = BigInt(payout.amountAtomic);
    if (settledStatuses.has(payout.status.toLowerCase())) observed += amount;
    else pending += amount;
  }
  return Object.freeze({
    expectedAtomic: expected.toString(),
    settledAtomic: observed.toString(),
    pendingAtomic: pending.toString(),
    varianceAtomic: (observed - expected).toString(),
    balanced: observed === expected,
  });
}

type ZeroExQuoteInput = Readonly<{
  chainId: number;
  sellToken: string;
  buyToken: string;
  sellAmount: string;
  taker: string;
  slippageBps: number;
}>;

function zeroExConfig(env: NodeJS.ProcessEnv) {
  const apiKey = env.ZEROX_API_KEY?.trim();
  if (!apiKey) return null;
  const baseUrl = normalizeBaseUrl(
    env.ZEROX_API_URL?.trim() || "https://api.0x.org",
    "ZEROX_API_URL",
  );
  return { apiKey, baseUrl };
}

function parseZeroExQuote(payload: unknown, input: ZeroExQuoteInput) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error("0x quote response is invalid");
  }
  const quote = payload as JsonRecord;
  if (quote.liquidityAvailable === false) throw new Error("0x reports no available liquidity");
  const buyAmount = requireDecimal(quote.buyAmount, "0x.buyAmount", true).toString();
  const minBuyAmount =
    typeof quote.minBuyAmount === "string" && DECIMAL_RE.test(quote.minBuyAmount)
      ? quote.minBuyAmount
      : null;
  const transaction =
    quote.transaction && typeof quote.transaction === "object" && !Array.isArray(quote.transaction)
      ? (quote.transaction as JsonRecord)
      : null;
  if (!transaction) throw new Error("0x quote did not include an executable transaction");
  const to = requireAddress(transaction.to, "0x.transaction.to");
  const data =
    typeof transaction.data === "string" && /^0x[a-fA-F0-9]*$/.test(transaction.data)
      ? transaction.data
      : (() => {
          throw new Error("0x.transaction.data is invalid");
        })();
  const value =
    typeof transaction.value === "string" && DECIMAL_RE.test(transaction.value)
      ? transaction.value
      : "0";
  const gas =
    typeof transaction.gas === "string" && DECIMAL_RE.test(transaction.gas)
      ? transaction.gas
      : null;

  return Object.freeze({
    provider: "0x-swap-api-v2",
    quoteId: stableHash("0xquote", {
      chainId: input.chainId,
      sellToken: input.sellToken,
      buyToken: input.buyToken,
      sellAmount: input.sellAmount,
      taker: input.taker,
      buyAmount,
      to,
      dataHash: createHash("sha256").update(data).digest("hex"),
    }),
    chainId: input.chainId,
    sellToken: input.sellToken,
    buyToken: input.buyToken,
    sellAmount: input.sellAmount,
    buyAmount,
    minBuyAmount,
    taker: input.taker,
    allowanceTarget:
      typeof quote.allowanceTarget === "string" && ADDRESS_RE.test(quote.allowanceTarget)
        ? quote.allowanceTarget
        : null,
    issues: quote.issues ?? null,
    fees: quote.fees ?? null,
    route: quote.route ?? null,
    transaction: { to, data, value, gas },
    executableByWallet: true,
    serverBroadcast: false,
  });
}

export async function fetchZeroExQuote(
  input: {
    chainId: unknown;
    sellToken: unknown;
    buyToken: unknown;
    sellAmount: unknown;
    taker: unknown;
    slippageBps?: unknown;
  },
  env: NodeJS.ProcessEnv = process.env,
) {
  const config = zeroExConfig(env);
  if (!config) throw new Error("ZEROX_API_KEY is not configured");
  const chainId = requirePositiveInteger(input.chainId, "chainId");
  const sellToken = requireAddress(input.sellToken, "sellToken");
  const buyToken = requireAddress(input.buyToken, "buyToken");
  if (sellToken.toLowerCase() === buyToken.toLowerCase()) {
    throw new Error("sellToken and buyToken must differ");
  }
  const sellAmount = requireDecimal(input.sellAmount, "sellAmount", true).toString();
  const taker = requireAddress(input.taker, "taker");
  const slippageBps =
    input.slippageBps === undefined
      ? 100
      : requirePositiveInteger(input.slippageBps, "slippageBps", 2_000);

  const url = new URL("/swap/allowance-holder/quote", config.baseUrl);
  url.searchParams.set("chainId", String(chainId));
  url.searchParams.set("sellToken", sellToken);
  url.searchParams.set("buyToken", buyToken);
  url.searchParams.set("sellAmount", sellAmount);
  url.searchParams.set("taker", taker);
  url.searchParams.set("slippageBps", String(slippageBps));

  const { controller, timer } = abortAfter(timeoutMs(env));
  try {
    const response = await fetch(url, {
      headers: {
        "0x-api-key": config.apiKey,
        "0x-version": "v2",
        accept: "application/json",
      },
      signal: controller.signal,
    });
    const payload = (await response.json()) as unknown;
    if (!response.ok) {
      throw new Error("0x quote failed with HTTP " + response.status);
    }
    return parseZeroExQuote(payload, {
      chainId,
      sellToken,
      buyToken,
      sellAmount,
      taker,
      slippageBps,
    });
  } finally {
    clearTimeout(timer);
  }
}

function parseMainnetPolicy(env: NodeJS.ProcessEnv) {
  const chainIds = new Set(
    splitCsv(env.CRYPTO_MAINNET_ALLOWED_CHAIN_IDS)
      .map(value => Number(value))
      .filter(value => Number.isInteger(value) && value > 0),
  );
  const destinations = new Set(
    splitCsv(env.CRYPTO_MAINNET_DESTINATION_ALLOWLIST)
      .filter(value => ADDRESS_RE.test(value))
      .map(value => value.toLowerCase()),
  );
  const maxNativeWei =
    env.CRYPTO_MAINNET_MAX_NATIVE_WEI && DECIMAL_RE.test(env.CRYPTO_MAINNET_MAX_NATIVE_WEI)
      ? BigInt(env.CRYPTO_MAINNET_MAX_NATIVE_WEI)
      : 0n;
  return {
    enabled: envTrue(env.CRYPTO_MAINNET_ENABLED),
    chainIds,
    destinations,
    maxNativeWei,
  };
}

export function evaluateMainnetWalletPolicy(
  input: {
    chainId: unknown;
    to: unknown;
    valueWei: unknown;
    purpose: unknown;
  },
  env: NodeJS.ProcessEnv = process.env,
) {
  const parsed: MainnetPolicyInput = {
    chainId: requirePositiveInteger(input.chainId, "chainId"),
    to: requireAddress(input.to, "to"),
    valueWei: requireDecimal(input.valueWei, "valueWei"),
    purpose:
      input.purpose === "dex-swap"
        ? "dex-swap"
        : input.purpose === "transfer"
          ? "transfer"
          : (() => {
              throw new Error("purpose must be transfer or dex-swap");
            })(),
  };
  const policy = parseMainnetPolicy(env);
  const reasons: string[] = [];
  if (!policy.enabled) reasons.push("mainnet execution is disabled");
  if (!policy.chainIds.has(parsed.chainId)) reasons.push("chain is not allowlisted");
  if (!policy.destinations.has(parsed.to.toLowerCase())) {
    reasons.push("destination is not allowlisted");
  }
  if (policy.maxNativeWei <= 0n) reasons.push("maximum native value is not configured");
  if (parsed.valueWei > policy.maxNativeWei) reasons.push("native value exceeds configured maximum");

  return Object.freeze({
    contract: "sky.crypto.mainnet-policy.v1",
    allowed: reasons.length === 0,
    reasons,
    policyId: stableHash("mainnet-policy", {
      chainId: parsed.chainId,
      to: parsed.to.toLowerCase(),
      valueWei: parsed.valueWei.toString(),
      purpose: parsed.purpose,
      enabled: policy.enabled,
      chains: [...policy.chainIds].sort((a, b) => a - b),
      destinationCount: policy.destinations.size,
      maxNativeWei: policy.maxNativeWei.toString(),
    }),
    chainId: parsed.chainId,
    to: parsed.to,
    valueWei: parsed.valueWei.toString(),
    purpose: parsed.purpose,
    operatorApprovalStillRequired: true,
  });
}

async function jsonRpc<T>(
  urlRaw: string,
  method: string,
  params: readonly unknown[],
  env: NodeJS.ProcessEnv,
  headers: Record<string, string> = {},
): Promise<T> {
  const url = normalizeBaseUrl(urlRaw, "RPC URL");
  const { controller, timer } = abortAfter(timeoutMs(env));
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", ...headers },
      body: JSON.stringify({ jsonrpc: "2.0", id: "skycoin4444", method, params }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(method + " returned HTTP " + response.status);
    const body = (await response.json()) as JsonRecord;
    if (body.error) throw new Error(method + " failed: " + JSON.stringify(body.error));
    return body.result as T;
  } finally {
    clearTimeout(timer);
  }
}

function evmRpcForChain(chainId: number, env: NodeJS.ProcessEnv): string {
  if (env.EVM_RPC_URLS_JSON?.trim()) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(env.EVM_RPC_URLS_JSON);
    } catch {
      throw new Error("EVM_RPC_URLS_JSON is invalid JSON");
    }
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const url = (parsed as JsonRecord)[String(chainId)];
      if (typeof url === "string" && url.trim()) return url.trim();
    }
  }
  if (chainId === 1 && env.ETHEREUM_RPC_URL?.trim()) return env.ETHEREUM_RPC_URL.trim();
  throw new Error("No EVM RPC URL is configured for chain " + chainId);
}

function bitcoinAuthHeaders(env: NodeJS.ProcessEnv): Record<string, string> {
  if (env.BITCOIN_RPC_USER && env.BITCOIN_RPC_PASSWORD) {
    return {
      authorization:
        "Basic " +
        Buffer.from(env.BITCOIN_RPC_USER + ":" + env.BITCOIN_RPC_PASSWORD, "utf8").toString(
          "base64",
        ),
    };
  }
  return {};
}

export async function reconcileTransaction(
  input: {
    network: unknown;
    txHash: unknown;
    chainId?: unknown;
    minConfirmations?: unknown;
  },
  env: NodeJS.ProcessEnv = process.env,
) {
  const network =
    input.network === "evm" || input.network === "solana" || input.network === "bitcoin"
      ? input.network
      : (() => {
          throw new Error("network must be evm, solana, or bitcoin");
        })();
  const minConfirmations =
    input.minConfirmations === undefined
      ? requirePositiveInteger(env.CRYPTO_CONFIRMATIONS_REQUIRED || "2", "minConfirmations", 10_000)
      : requirePositiveInteger(input.minConfirmations, "minConfirmations", 10_000);

  if (network === "evm") {
    const chainId = requirePositiveInteger(input.chainId, "chainId");
    const txHash = requireHash32(input.txHash, "txHash");
    const rpc = evmRpcForChain(chainId, env);
    const [receipt, currentBlockHex] = await Promise.all([
      jsonRpc<JsonRecord | null>(rpc, "eth_getTransactionReceipt", [txHash], env),
      jsonRpc<string>(rpc, "eth_blockNumber", [], env),
    ]);
    if (!receipt) {
      return Object.freeze({
        network,
        chainId,
        txHash,
        status: "pending",
        confirmations: 0,
        confirmed: false,
        blockNumber: null,
      });
    }
    const blockHex = typeof receipt.blockNumber === "string" ? receipt.blockNumber : null;
    const blockNumber = blockHex ? Number(BigInt(blockHex)) : null;
    const current = Number(BigInt(currentBlockHex));
    const confirmations = blockNumber === null ? 0 : Math.max(0, current - blockNumber + 1);
    const succeeded = receipt.status === "0x1";
    const status = succeeded
      ? confirmations >= minConfirmations
        ? "confirmed"
        : "confirming"
      : "failed";
    return Object.freeze({
      network,
      chainId,
      txHash,
      status,
      confirmations,
      confirmed: status === "confirmed",
      blockNumber,
    });
  }

  if (network === "solana") {
    const txHash = requireSafeRef(input.txHash, "txHash");
    const rpc = env.SOLANA_RPC_URL?.trim();
    if (!rpc) throw new Error("SOLANA_RPC_URL is not configured");
    const result = await jsonRpc<{ value?: Array<JsonRecord | null> }>(
      rpc,
      "getSignatureStatuses",
      [[txHash], { searchTransactionHistory: true }],
      env,
    );
    const status = result.value?.[0] ?? null;
    if (!status) {
      return Object.freeze({
        network,
        txHash,
        status: "pending",
        confirmations: 0,
        confirmed: false,
      });
    }
    const confirmationStatus =
      typeof status.confirmationStatus === "string" ? status.confirmationStatus : "processed";
    const failed = status.err !== null && status.err !== undefined;
    const confirmations =
      typeof status.confirmations === "number"
        ? status.confirmations
        : confirmationStatus === "finalized"
          ? minConfirmations
          : 0;
    const reconciledStatus = failed
      ? "failed"
      : confirmationStatus === "finalized" || confirmations >= minConfirmations
        ? "confirmed"
        : "confirming";
    return Object.freeze({
      network,
      txHash,
      status: reconciledStatus,
      confirmations,
      confirmed: reconciledStatus === "confirmed",
      confirmationStatus,
    });
  }

  const txHash = requireSafeRef(input.txHash, "txHash");
  const rpc = env.BITCOIN_RPC_URL?.trim();
  if (!rpc) throw new Error("BITCOIN_RPC_URL is not configured");
  try {
    const transaction = await jsonRpc<JsonRecord>(
      rpc,
      "getrawtransaction",
      [txHash, true],
      env,
      bitcoinAuthHeaders(env),
    );
    const confirmations =
      typeof transaction.confirmations === "number" ? transaction.confirmations : 0;
    const status =
      confirmations >= minConfirmations
        ? "confirmed"
        : confirmations > 0
          ? "confirming"
          : "pending";
    return Object.freeze({
      network,
      txHash,
      status,
      confirmations,
      confirmed: status === "confirmed",
      blockHash: typeof transaction.blockhash === "string" ? transaction.blockhash : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bitcoin RPC reconciliation failed";
    if (/not found|No such mempool|Invalid or non-wallet transaction/i.test(message)) {
      return Object.freeze({
        network,
        txHash,
        status: "unknown",
        confirmations: 0,
        confirmed: false,
      });
    }
    throw error;
  }
}

function openBaoConfig(env: NodeJS.ProcessEnv) {
  const urlRaw = env.OPENBAO_URL?.trim();
  const token = env.OPENBAO_TOKEN?.trim();
  const key = env.OPENBAO_TRANSIT_KEY?.trim();
  if (!urlRaw && !token && !key) return null;
  if (!urlRaw || !token || !key) {
    throw new Error("OPENBAO_URL, OPENBAO_TOKEN, and OPENBAO_TRANSIT_KEY must be configured together");
  }
  if (!/^[A-Za-z0-9._-]{1,128}$/.test(key)) throw new Error("OPENBAO_TRANSIT_KEY is invalid");
  const mount = env.OPENBAO_TRANSIT_MOUNT?.trim() || "transit";
  if (!/^[A-Za-z0-9._-]{1,64}$/.test(mount)) throw new Error("OPENBAO_TRANSIT_MOUNT is invalid");
  return {
    baseUrl: normalizeBaseUrl(urlRaw, "OPENBAO_URL"),
    token,
    key,
    mount,
    namespace: env.OPENBAO_NAMESPACE?.trim() || null,
    enabled: envTrue(env.OPENBAO_SIGNING_ENABLED),
  };
}

export async function signDigestWithOpenBao(
  input: { digestHex: unknown },
  env: NodeJS.ProcessEnv = process.env,
) {
  const config = openBaoConfig(env);
  if (!config) throw new Error("OpenBao Transit is not configured");
  if (!config.enabled) throw new Error("OpenBao signing is disabled by operator policy");
  const digestHex =
    typeof input.digestHex === "string" && /^[a-fA-F0-9]{64}$/.test(input.digestHex)
      ? input.digestHex.toLowerCase()
      : (() => {
          throw new Error("digestHex must be a 32-byte hexadecimal digest");
        })();

  const url = new URL(
    "/v1/" +
      encodeURIComponent(config.mount) +
      "/sign/" +
      encodeURIComponent(config.key) +
      "/sha2-256",
    config.baseUrl,
  );
  const headers: Record<string, string> = {
    "content-type": "application/json",
    "x-vault-token": config.token,
  };
  if (config.namespace) headers["x-vault-namespace"] = config.namespace;

  const { controller, timer } = abortAfter(timeoutMs(env));
  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        input: Buffer.from(digestHex, "hex").toString("base64"),
        prehashed: true,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("OpenBao signing returned HTTP " + response.status);
    const payload = (await response.json()) as JsonRecord;
    const data =
      payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)
        ? (payload.data as JsonRecord)
        : null;
    const signature = typeof data?.signature === "string" ? data.signature : null;
    if (!signature) throw new Error("OpenBao response did not include a signature");
    return Object.freeze({
      provider: "openbao-transit",
      keyRef: config.key,
      digestHex,
      signature,
      privateKeyExposed: false,
    });
  } finally {
    clearTimeout(timer);
  }
}

function mpcConfig(env: NodeJS.ProcessEnv) {
  const urlRaw = env.MPC_SIGNER_URL?.trim();
  const token = env.MPC_SIGNER_TOKEN?.trim();
  const keyId = env.MPC_KEY_ID?.trim();
  if (!urlRaw && !token && !keyId) return null;
  if (!urlRaw || !token || !keyId) {
    throw new Error("MPC_SIGNER_URL, MPC_SIGNER_TOKEN, and MPC_KEY_ID must be configured together");
  }
  if (!SAFE_REF_RE.test(keyId)) throw new Error("MPC_KEY_ID is invalid");
  return {
    url: normalizeBaseUrl(urlRaw, "MPC_SIGNER_URL"),
    token,
    keyId,
    enabled: envTrue(env.MPC_SIGNING_ENABLED),
  };
}

export async function signDigestWithMpcGateway(
  input: { digestHex: unknown; algorithm?: unknown },
  env: NodeJS.ProcessEnv = process.env,
) {
  const config = mpcConfig(env);
  if (!config) throw new Error("MPC signer gateway is not configured");
  if (!config.enabled) throw new Error("MPC signing is disabled by operator policy");
  const digestHex =
    typeof input.digestHex === "string" && /^[a-fA-F0-9]{64}$/.test(input.digestHex)
      ? input.digestHex.toLowerCase()
      : (() => {
          throw new Error("digestHex must be a 32-byte hexadecimal digest");
        })();
  const algorithm =
    input.algorithm === undefined
      ? "secp256k1-sha256"
      : requireSafeRef(input.algorithm, "algorithm");
  const requestId = randomUUID();
  const { controller, timer } = abortAfter(timeoutMs(env));
  try {
    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        authorization: "Bearer " + config.token,
        "content-type": "application/json",
        "idempotency-key": requestId,
      },
      body: JSON.stringify({
        requestId,
        keyId: config.keyId,
        digestHex,
        algorithm,
      }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("MPC signer returned HTTP " + response.status);
    const payload = (await response.json()) as JsonRecord;
    const signature = typeof payload.signature === "string" ? payload.signature : null;
    if (!signature) throw new Error("MPC signer response did not include signature");
    return Object.freeze({
      provider: "mpc-signer-gateway",
      requestId:
        typeof payload.requestId === "string" ? payload.requestId : requestId,
      keyRef: config.keyId,
      digestHex,
      algorithm,
      signature,
      privateKeyExposed: false,
    });
  } finally {
    clearTimeout(timer);
  }
}

async function requireUser(req: Request, res: Response) {
  try {
    return await sdk.authenticateRequest(req);
  } catch {
    res.status(401).json({ error: "authentication required" });
    return null;
  }
}

async function requireAdmin(req: Request, res: Response) {
  const user = await requireUser(req, res);
  if (!user) return null;
  if (user.role !== "admin") {
    res.status(403).json({ error: "administrator role required" });
    return null;
  }
  return user;
}

function badRequest(res: Response, error: unknown) {
  res.status(400).json({
    error: error instanceof Error ? error.message : "invalid request",
  });
}

function unavailable(res: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "provider unavailable";
  res.status(503).json({ error: message });
}

export function registerCryptoProviderRoutes(app: Express) {
  app.get("/api/crypto-provider/status", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(cryptoProviderConfigSnapshot());
  });

  app.post("/api/crypto-provider/dex/0x/quote", async (req, res) => {
    const user = await requireUser(req, res);
    if (!user) return;
    try {
      const quote = await fetchZeroExQuote(req.body ?? {});
      const persisted = await persistProviderEvent({
        userId: user.id,
        provider: "0x-swap-api-v2",
        eventType: "dex_quote",
        externalRef: quote.quoteId,
        status: "quoted",
        metadata: {
          chainId: quote.chainId,
          sellToken: quote.sellToken,
          buyToken: quote.buyToken,
          sellAmount: quote.sellAmount,
          buyAmount: quote.buyAmount,
          transactionTo: quote.transaction.to,
        },
      });
      res.json({ ...quote, persisted });
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.post("/api/crypto-provider/wallet/mainnet-policy", async (req, res) => {
    if (!(await requireUser(req, res))) return;
    try {
      res.json(evaluateMainnetWalletPolicy(req.body ?? {}));
    } catch (error) {
      badRequest(res, error);
    }
  });

  app.post("/api/crypto-provider/tx/reconcile", async (req, res) => {
    const user = await requireUser(req, res);
    if (!user) return;
    try {
      const result = await reconcileTransaction(req.body ?? {});
      const persisted = await persistProviderEvent({
        userId: user.id,
        provider: String(result.network),
        eventType: "transaction_reconciliation",
        externalRef: String(result.txHash),
        txHash: String(result.txHash),
        status: String(result.status),
        metadata: { ...result },
      });
      res.json({ ...result, persisted });
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.post("/api/crypto-provider/stratum/probe", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      res.json(await probeStratumPool());
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.post("/api/crypto-provider/stratum/submit-share", async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;
    try {
      const result = await submitStratumShare(req.body ?? {});
      const persisted = await persistProviderEvent({
        userId: user.id,
        provider: "stratum-v1",
        eventType: "share_submission",
        externalRef: result.shareRef,
        status: result.accepted ? "accepted" : "rejected",
        metadata: {
          accepted: result.accepted,
          latencyMs: result.latencyMs,
        },
      });
      res.json({ ...result, persisted });
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.get("/api/crypto-provider/mining/payouts", async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;
    try {
      const result = await fetchMiningPayouts();
      let persistedCount = 0;
      for (const payout of result.payouts) {
        const persisted = await persistProviderEvent({
          userId: user.id,
          provider: result.provider,
          eventType: "mining_payout",
          asset: payout.asset,
          amountAtomic: payout.amountAtomic,
          externalRef: payout.id,
          txHash: payout.txHash,
          status: payout.status,
          metadata: payout.createdAt ? { createdAt: payout.createdAt } : null,
        });
        if (persisted) persistedCount += 1;
      }
      res.json({ ...result, persistedCount });
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.post("/api/crypto-provider/mining/reconcile-payouts", async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    try {
      const provider = await fetchMiningPayouts();
      res.json({
        provider: provider.provider,
        reconciliation: reconcileMiningPayouts(req.body?.expectedAtomic, provider.payouts),
        payouts: provider.payouts,
      });
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.post("/api/crypto-provider/custody/openbao/sign", async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;
    try {
      const result = await signDigestWithOpenBao(req.body ?? {});
      const persisted = await persistProviderEvent({
        userId: user.id,
        provider: "openbao-transit",
        eventType: "digest_signature",
        externalRef: stableHash("openbao-sign", {
          digestHex: result.digestHex,
          signature: result.signature,
        }),
        status: "signed",
        metadata: {
          keyRef: result.keyRef,
          digestHex: result.digestHex,
          privateKeyExposed: false,
        },
      });
      res.json({ ...result, persisted });
    } catch (error) {
      unavailable(res, error);
    }
  });

  app.post("/api/crypto-provider/custody/mpc/sign", async (req, res) => {
    const user = await requireAdmin(req, res);
    if (!user) return;
    try {
      const result = await signDigestWithMpcGateway(req.body ?? {});
      const persisted = await persistProviderEvent({
        userId: user.id,
        provider: "mpc-signer-gateway",
        eventType: "digest_signature",
        externalRef: result.requestId,
        status: "signed",
        metadata: {
          keyRef: result.keyRef,
          digestHex: result.digestHex,
          algorithm: result.algorithm,
          privateKeyExposed: false,
        },
      });
      res.json({ ...result, persisted });
    } catch (error) {
      unavailable(res, error);
    }
  });
}
