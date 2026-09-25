import { createHash } from "node:crypto";
import type { Express, Request, Response } from "express";
import { sdk } from "./sdk";

const SAFE_ID = /^[A-Za-z0-9:_./-]{1,128}$/;
const CURRENCY = /^[A-Z0-9]{2,12}$/;
const DECIMAL_INTEGER = /^\d+$/;
const MAX_CART_LINES = 50;
const MAX_QUANTITY = 1_000_000n;
const BPS_SCALE = 10_000n;

type OrderSide = "buy" | "sell";

function requireSafeId(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(field + " is required");
  const normalized = value.trim();
  if (!SAFE_ID.test(normalized)) throw new Error(field + " contains unsupported characters");
  return normalized;
}

function requireCurrency(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(field + " is required");
  const normalized = value.trim().toUpperCase();
  if (!CURRENCY.test(normalized)) throw new Error(field + " must be a 2-12 character asset code");
  return normalized;
}

function requireUint(value: unknown, field: string, positive = false): bigint {
  if (typeof value !== "string" || !DECIMAL_INTEGER.test(value)) {
    throw new Error(field + " must be an unsigned integer string");
  }
  const parsed = BigInt(value);
  if (positive ? parsed <= 0n : parsed < 0n) {
    throw new Error(field + (positive ? " must be positive" : " must be non-negative"));
  }
  return parsed;
}

function requireBps(value: unknown, field: string, maximum = 5_000): bigint {
  const parsed = requireUint(String(value), field);
  if (parsed > BigInt(maximum)) {
    throw new Error(field + " must be at most " + maximum + " bps");
  }
  return parsed;
}

function stableId(prefix: string, payload: unknown): string {
  return (
    prefix +
    ":" +
    createHash("sha256").update(JSON.stringify(payload), "utf8").digest("hex")
  );
}

export function quoteConstantProductSwap(input: {
  tokenIn: unknown;
  tokenOut: unknown;
  reserveIn: unknown;
  reserveOut: unknown;
  amountIn: unknown;
  feeBps: unknown;
}) {
  const tokenIn = requireCurrency(input.tokenIn, "tokenIn");
  const tokenOut = requireCurrency(input.tokenOut, "tokenOut");
  if (tokenIn === tokenOut) throw new Error("tokenIn and tokenOut must differ");
  const reserveIn = requireUint(input.reserveIn, "reserveIn", true);
  const reserveOut = requireUint(input.reserveOut, "reserveOut", true);
  const amountIn = requireUint(input.amountIn, "amountIn", true);
  const feeBps = requireBps(input.feeBps, "feeBps", 1_000);

  const amountAfterFee = (amountIn * (BPS_SCALE - feeBps)) / BPS_SCALE;
  if (amountAfterFee <= 0n) throw new Error("amount after fee must be positive");

  const amountOut = (reserveOut * amountAfterFee) / (reserveIn + amountAfterFee);
  if (amountOut <= 0n || amountOut >= reserveOut) {
    throw new Error("swap output is invalid for the supplied reserves");
  }

  const spotNumerator = reserveOut * amountIn;
  const spotDenominator = reserveIn;
  const idealOut = spotNumerator / spotDenominator;
  const impactBps =
    idealOut > 0n && idealOut > amountOut
      ? ((idealOut - amountOut) * BPS_SCALE) / idealOut
      : 0n;

  const payload = {
    tokenIn,
    tokenOut,
    reserveIn: reserveIn.toString(),
    reserveOut: reserveOut.toString(),
    amountIn: amountIn.toString(),
    feeBps: feeBps.toString(),
    amountOut: amountOut.toString(),
  };

  return Object.freeze({
    contract: "sky.crypto.swap-quote.v1",
    quoteId: stableId("swap", payload),
    ...payload,
    priceImpactBps: impactBps.toString(),
    model: "constant-product-x*y=k",
    execution: "planning-only",
    liveLiquidityClaimed: false,
  });
}

export function planLiquidityDeposit(input: {
  tokenA: unknown;
  tokenB: unknown;
  reserveA: unknown;
  reserveB: unknown;
  amountA: unknown;
  amountB: unknown;
  totalShares: unknown;
}) {
  const tokenA = requireCurrency(input.tokenA, "tokenA");
  const tokenB = requireCurrency(input.tokenB, "tokenB");
  if (tokenA === tokenB) throw new Error("tokenA and tokenB must differ");
  const reserveA = requireUint(input.reserveA, "reserveA", true);
  const reserveB = requireUint(input.reserveB, "reserveB", true);
  const amountA = requireUint(input.amountA, "amountA", true);
  const amountB = requireUint(input.amountB, "amountB", true);
  const totalShares = requireUint(input.totalShares, "totalShares", true);

  const sharesFromA = (amountA * totalShares) / reserveA;
  const sharesFromB = (amountB * totalShares) / reserveB;
  const mintedShares = sharesFromA < sharesFromB ? sharesFromA : sharesFromB;
  if (mintedShares <= 0n) throw new Error("deposit is too small to mint a pool share");

  const usedA = (mintedShares * reserveA) / totalShares;
  const usedB = (mintedShares * reserveB) / totalShares;
  const unusedA = amountA - usedA;
  const unusedB = amountB - usedB;

  const payload = {
    tokenA,
    tokenB,
    reserveA: reserveA.toString(),
    reserveB: reserveB.toString(),
    amountA: amountA.toString(),
    amountB: amountB.toString(),
    totalShares: totalShares.toString(),
    mintedShares: mintedShares.toString(),
  };

  return Object.freeze({
    contract: "sky.crypto.liquidity-deposit-plan.v1",
    planId: stableId("liquidity", payload),
    ...payload,
    usedA: usedA.toString(),
    usedB: usedB.toString(),
    unusedA: unusedA.toString(),
    unusedB: unusedB.toString(),
    execution: "planning-only",
    livePoolClaimed: false,
  });
}

export function planLimitOrder(input: {
  market: unknown;
  side: unknown;
  quantityBaseUnits: unknown;
  limitPriceQuoteUnits: unknown;
}) {
  const market = requireSafeId(input.market, "market");
  if (input.side !== "buy" && input.side !== "sell") {
    throw new Error("side must be buy or sell");
  }
  const side = input.side as OrderSide;
  const quantityBaseUnits = requireUint(input.quantityBaseUnits, "quantityBaseUnits", true);
  const limitPriceQuoteUnits = requireUint(
    input.limitPriceQuoteUnits,
    "limitPriceQuoteUnits",
    true,
  );
  const maxQuoteUnits = quantityBaseUnits * limitPriceQuoteUnits;

  const payload = {
    market,
    side,
    quantityBaseUnits: quantityBaseUnits.toString(),
    limitPriceQuoteUnits: limitPriceQuoteUnits.toString(),
    maxQuoteUnits: maxQuoteUnits.toString(),
  };

  return Object.freeze({
    contract: "sky.crypto.limit-order-plan.v1",
    orderId: stableId("order", payload),
    ...payload,
    execution: "planning-only",
    venue: null,
    settlement: false,
  });
}

export function planStoreCheckout(input: {
  merchantId: unknown;
  settlementAsset: unknown;
  currencyMinor: unknown;
  lines: unknown;
}) {
  const merchantId = requireSafeId(input.merchantId, "merchantId");
  const settlementAsset = requireCurrency(input.settlementAsset, "settlementAsset");
  const currencyMinor = requireCurrency(input.currencyMinor, "currencyMinor");

  if (!Array.isArray(input.lines) || input.lines.length < 1 || input.lines.length > MAX_CART_LINES) {
    throw new Error("lines must contain 1-" + MAX_CART_LINES + " cart entries");
  }

  let totalMinor = 0n;
  const lines = input.lines.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
      throw new Error("line " + index + " must be an object");
    }
    const line = raw as Record<string, unknown>;
    const sku = requireSafeId(line.sku, "line.sku");
    const quantity = requireUint(line.quantity, "line.quantity", true);
    if (quantity > MAX_QUANTITY) throw new Error("line.quantity is too large");
    const unitAmountMinor = requireUint(line.unitAmountMinor, "line.unitAmountMinor", true);
    const lineTotalMinor = quantity * unitAmountMinor;
    totalMinor += lineTotalMinor;
    return {
      sku,
      quantity: quantity.toString(),
      unitAmountMinor: unitAmountMinor.toString(),
      lineTotalMinor: lineTotalMinor.toString(),
    };
  });

  const payload = {
    merchantId,
    settlementAsset,
    currencyMinor,
    totalMinor: totalMinor.toString(),
    lines,
  };

  return Object.freeze({
    contract: "sky.crypto.store-checkout-plan.v1",
    checkoutId: stableId("checkout", payload),
    ...payload,
    paymentRequest: {
      asset: settlementAsset,
      amountMinor: totalMinor.toString(),
      destination: null,
    },
    execution: "planning-only",
    paymentCreated: false,
    inventoryReserved: false,
  });
}

export function cryptoProductCapabilities() {
  return Object.freeze({
    contract: "sky.crypto.products-capabilities.v1",
    wallet: {
      browserNonCustodialEip1193: true,
      serverCustody: false,
      privateKeyCollection: false,
    },
    blockchain: {
      readOnlyNodeProbes: true,
      localLedgerBlocks: true,
      mainnetBroadcast: false,
      testnetBroadcast: "browser-wallet-only",
    },
    swap: {
      deterministicAmmQuote: true,
      liveDexExecution: false,
    },
    liquidityPools: {
      deterministicDepositPlan: true,
      liveLpDeposit: false,
    },
    trading: {
      limitOrderPlanning: true,
      liveVenueExecution: false,
      leverage: false,
    },
    store: {
      deterministicCheckoutPlan: true,
      liveSettlement: false,
    },
    mining: {
      boundedHashingBenchmark: true,
      stratumPoolSubmission: false,
      payouts: false,
    },
  });
}

async function requireUser(req: Request, res: Response) {
  try {
    return await sdk.authenticateRequest(req);
  } catch {
    res.status(401).json({ error: "authentication required" });
    return null;
  }
}

function badRequest(res: Response, error: unknown) {
  res.status(400).json({
    error: error instanceof Error ? error.message : "invalid request",
  });
}

export function registerCryptoProductRoutes(app: Express) {
  app.get("/api/crypto-products/capabilities", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json(cryptoProductCapabilities());
  });

  app.post("/api/crypto-products/swap/quote", async (req, res) => {
    if (!(await requireUser(req, res))) return;
    try {
      res.json(quoteConstantProductSwap(req.body ?? {}));
    } catch (error) {
      badRequest(res, error);
    }
  });

  app.post("/api/crypto-products/liquidity/deposit-plan", async (req, res) => {
    if (!(await requireUser(req, res))) return;
    try {
      res.json(planLiquidityDeposit(req.body ?? {}));
    } catch (error) {
      badRequest(res, error);
    }
  });

  app.post("/api/crypto-products/trade/order-plan", async (req, res) => {
    if (!(await requireUser(req, res))) return;
    try {
      res.json(planLimitOrder(req.body ?? {}));
    } catch (error) {
      badRequest(res, error);
    }
  });

  app.post("/api/crypto-products/store/checkout-plan", async (req, res) => {
    if (!(await requireUser(req, res))) return;
    try {
      res.json(planStoreCheckout(req.body ?? {}));
    } catch (error) {
      badRequest(res, error);
    }
  });
}
