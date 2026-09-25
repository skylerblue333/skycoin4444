import { describe, expect, it } from "vitest";
import {
  buildSandboxBlock,
  planSandboxTransfer,
  probeOpenSourceNetworks,
  runHashingBenchmark,
} from "./cryptoLab";

describe("crypto engineering lab", () => {
  it("performs bounded real SHA-256 work without claiming a payout", async () => {
    const result = await runHashingBenchmark({
      iterations: 1_000,
      difficultyHexZeros: 1,
      seed: "sky4-test-seed",
    });

    expect(result.hashes).toBe(1_000);
    expect(result.bestHash).toMatch(/^[a-f0-9]{64}$/);
    expect(result.hashRateHps).toBeGreaterThan(0);
    expect(result.networkSubmission).toBe(false);
    expect(result.payout).toBeNull();
  });

  it("plans a transfer with deterministic accounting and no broadcast", () => {
    const result = planSandboxTransfer({
      sourceAccountId: "acct:alice",
      destination: "acct:bob",
      balance: "1000",
      amount: "100",
      fee: "2",
      nonce: "4",
    });

    expect(result.plan.amount).toBe("100");
    expect(result.plan.fee).toBe("2");
    expect(result.plan.nonce).toBe("4");
    expect(result.projectedAccount.balance).toBe("898");
    expect(result.projectedAccount.nextNonce).toBe("5");
    expect(result.broadcast).toBe(false);
    expect(result.custody).toBe(false);
  });

  it("builds deterministic local ledger blocks without consensus submission", () => {
    const input = {
      height: "1",
      previousHash: "0".repeat(64),
      transfers: [
        { from: "acct:alice", to: "acct:bob", amount: "25", nonce: "0" },
      ],
    };

    const first = buildSandboxBlock(input);
    const second = buildSandboxBlock(input);

    expect(first.block.hash).toMatch(/^[a-f0-9]{64}$/);
    expect(first.block.hash).toBe(second.block.hash);
    expect(first.consensusSubmitted).toBe(false);
    expect(first.broadcast).toBe(false);
  });

  it("keeps external node probes explicitly unconfigured without operator URLs", async () => {
    const networks = await probeOpenSourceNetworks({});
    expect(networks).toHaveLength(3);
    expect(networks.every(network => network.state === "unconfigured")).toBe(true);
  });

  it("rejects oversized hashing jobs and malformed local amounts", async () => {
    await expect(
      runHashingBenchmark({
        iterations: 200_001,
        difficultyHexZeros: 1,
        seed: "sky4-test-seed",
      }),
    ).rejects.toThrow("iterations");

    expect(() =>
      planSandboxTransfer({
        sourceAccountId: "acct:alice",
        destination: "acct:bob",
        balance: "1000",
        amount: "-1",
        fee: "0",
        nonce: "0",
      }),
    ).toThrow("amount");
  });
});
