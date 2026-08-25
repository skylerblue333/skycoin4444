import { describe, expect, it } from "vitest";
import { canTransition, createEscrow, transitionEscrow } from "./index";

describe("SkyEscrow domain core", () => {
  const draft = () => createEscrow({ id: "escrow-1", buyerId: "buyer:1", sellerId: "seller:1", amountMinor: 1250n, currency: "usd" });

  it("normalizes currency and starts in draft", () => {
    expect(draft()).toMatchObject({ currency: "USD", state: "draft", amountMinor: 1250n });
  });

  it("supports the funded release path", () => {
    const funded = transitionEscrow(draft(), "fund");
    expect(funded.state).toBe("funded");
    expect(transitionEscrow(funded, "release").state).toBe("released");
  });

  it("supports dispute resolution without pretending money moves", () => {
    const disputed = transitionEscrow(transitionEscrow(draft(), "fund"), "dispute");
    expect(disputed.state).toBe("disputed");
    expect(canTransition("disputed", "cancel")).toBe(true);
  });

  it("rejects illegal terminal transitions", () => {
    const released = transitionEscrow(transitionEscrow(draft(), "fund"), "release");
    expect(() => transitionEscrow(released, "cancel")).toThrow();
  });

  it("rejects invalid economic inputs", () => {
    expect(() => createEscrow({ id: "e", buyerId: "same", sellerId: "same", amountMinor: 1n, currency: "USD" })).toThrow();
    expect(() => createEscrow({ id: "e", buyerId: "b", sellerId: "s", amountMinor: 0n, currency: "USD" })).toThrow();
    expect(() => createEscrow({ id: "e", buyerId: "b", sellerId: "s", amountMinor: 1n, currency: "US" })).toThrow();
  });
});
