import { describe, expect, it } from "vitest";
import { SkyTokenRegistry } from "./index";

describe("SkyTokenRegistry", () => {
  it("normalizes and snapshots registered tokens deterministically", () => {
    const registry = new SkyTokenRegistry();
    registry.register({ id: " token-b ", symbol: "usdc", name: " USD Coin ", network: "solana", decimals: 6 });
    registry.register({ id: "token-a", symbol: "sky", name: "SkyCoin", network: "skycoin", decimals: 8 });
    expect(registry.snapshot()).toEqual({
      type: "sky.token-registry.snapshot.v1",
      tokenCount: 2,
      tokens: [
        { id: "token-a", symbol: "SKY", name: "SkyCoin", network: "skycoin", decimals: 8 },
        { id: "token-b", symbol: "USDC", name: "USD Coin", network: "solana", decimals: 6 },
      ],
    });
  });

  it("rejects duplicate ids and duplicate network symbols", () => {
    const registry = new SkyTokenRegistry();
    registry.register({ id: "token-a", symbol: "sky", name: "SkyCoin", network: "skycoin", decimals: 8 });
    expect(() => registry.register({ id: "token-a", symbol: "other", name: "Other", network: "ethereum", decimals: 18 })).toThrow("duplicate token id: token-a");
    expect(() => registry.register({ id: "token-b", symbol: "SKY", name: "Other Sky", network: "skycoin", decimals: 8 })).toThrow("duplicate token symbol on network: skycoin:SKY");
  });

  it("validates bounded decimal metadata and blank contract addresses", () => {
    const registry = new SkyTokenRegistry();
    expect(() => registry.register({ id: "bad", symbol: "BAD", name: "Bad", network: "ethereum", decimals: 31 })).toThrow("token decimals must be an integer between 0 and 30");
    expect(() => registry.register({ id: "bad", symbol: "BAD", name: "Bad", network: "ethereum", decimals: 18, contractAddress: "   " })).toThrow("contract address cannot be blank");
  });
});
