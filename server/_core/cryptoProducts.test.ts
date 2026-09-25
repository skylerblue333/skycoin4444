import { describe, expect, it } from "vitest";
import {
  cryptoProductCapabilities,
  planLimitOrder,
  planLiquidityDeposit,
  planStoreCheckout,
  quoteConstantProductSwap,
} from "./cryptoProducts";

describe("crypto product domain contracts", () => {
  it("quotes a constant-product swap deterministically", () => {
    const input = {
      tokenIn: "ETH",
      tokenOut: "USDC",
      reserveIn: "1000000",
      reserveOut: "2000000000",
      amountIn: "10000",
      feeBps: "30",
    };
    const first = quoteConstantProductSwap(input);
    const second = quoteConstantProductSwap(input);
    expect(first.quoteId).toBe(second.quoteId);
    expect(BigInt(first.amountOut)).toBeGreaterThan(0n);
    expect(first.liveLiquidityClaimed).toBe(false);
    expect(first.execution).toBe("planning-only");
  });

  it("plans proportional liquidity deposits without inventing pool state", () => {
    const result = planLiquidityDeposit({
      tokenA: "ETH",
      tokenB: "USDC",
      reserveA: "1000",
      reserveB: "2000000",
      amountA: "100",
      amountB: "250000",
      totalShares: "10000",
    });
    expect(result.mintedShares).toBe("1000");
    expect(result.unusedA).toBe("0");
    expect(result.unusedB).toBe("50000");
    expect(result.livePoolClaimed).toBe(false);
  });

  it("creates a deterministic limit-order plan with no venue execution", () => {
    const result = planLimitOrder({
      market: "ETH-USDC",
      side: "buy",
      quantityBaseUnits: "250",
      limitPriceQuoteUnits: "2000",
    });
    expect(result.maxQuoteUnits).toBe("500000");
    expect(result.venue).toBeNull();
    expect(result.settlement).toBe(false);
  });

  it("creates a deterministic store checkout plan without claiming payment", () => {
    const result = planStoreCheckout({
      merchantId: "merchant:sky-store",
      settlementAsset: "USDC",
      currencyMinor: "USD",
      lines: [
        { sku: "hoodie", quantity: "2", unitAmountMinor: "4900" },
        { sku: "mug", quantity: "1", unitAmountMinor: "1500" },
      ],
    });
    expect(result.totalMinor).toBe("11300");
    expect(result.paymentCreated).toBe(false);
    expect(result.inventoryReserved).toBe(false);
  });

  it("keeps custody, mainnet broadcast, trading execution and payouts fail-closed", () => {
    const capabilities = cryptoProductCapabilities();
    expect(capabilities.wallet.serverCustody).toBe(false);
    expect(capabilities.blockchain.mainnetBroadcast).toBe(false);
    expect(capabilities.trading.liveVenueExecution).toBe(false);
    expect(capabilities.store.liveSettlement).toBe(false);
    expect(capabilities.mining.payouts).toBe(false);
  });

  it("rejects invalid assets, amounts and cart shapes", () => {
    expect(() =>
      quoteConstantProductSwap({
        tokenIn: "ETH",
        tokenOut: "ETH",
        reserveIn: "1",
        reserveOut: "1",
        amountIn: "1",
        feeBps: "30",
      }),
    ).toThrow("must differ");

    expect(() =>
      planLimitOrder({
        market: "ETH-USDC",
        side: "hold",
        quantityBaseUnits: "1",
        limitPriceQuoteUnits: "1",
      }),
    ).toThrow("side");

    expect(() =>
      planStoreCheckout({
        merchantId: "merchant:sky-store",
        settlementAsset: "USDC",
        currencyMinor: "USD",
        lines: [],
      }),
    ).toThrow("lines");
  });
});
