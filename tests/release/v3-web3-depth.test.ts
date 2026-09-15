import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  analyzeWeb3Intent,
  createWeb3IntentSimulation,
  web3IntentSafetyChecks,
} from "../../client/src/lib/web3IntentLab";

const web3Source = fs.readFileSync(
  "client/src/pages/BetaWeb3Sandbox.tsx",
  "utf8"
);

const allChecks = web3IntentSafetyChecks.map(check => check.id);

describe("V3 Web3 product-depth release contract", () => {
  it("keeps evidence inspection and intent rehearsal in one product loop", () => {
    expect(web3Source).toMatch(/Inspect evidence, rehearse intent, never write to a chain/);
    expect(web3Source).toMatch(/Intent safety gate/);
    expect(web3Source).toMatch(/Transaction-intent simulator/);
    expect(web3Source).toMatch(/Recent local simulations/);
    expect(web3Source).toMatch(/Indexed NFT fixtures/);
  });

  it("requires four safety acknowledgements before simulation", () => {
    expect(web3IntentSafetyChecks).toHaveLength(4);
    const blocked = analyzeWeb3Intent({
      asset: "SKYTEST",
      network: "testnet",
      recipientReference: "recipient:test-alpha",
      amount: "1",
      feeScenario: "standard",
      acknowledgedChecks: [],
    });
    expect(blocked.canSimulate).toBe(false);
    expect(blocked.blockers.filter(message => message.startsWith("Confirm:"))).toHaveLength(4);
  });

  it("makes successful simulation structurally incapable of claiming execution", () => {
    const receipt = createWeb3IntentSimulation(
      {
        asset: "SKYTEST",
        network: "testnet",
        recipientReference: "recipient:test-alpha",
        amount: "1",
        feeScenario: "standard",
        acknowledgedChecks: allChecks,
      },
      "2026-09-15T18:00:00.000Z"
    );
    expect(receipt).toMatchObject({
      contract: "sky.web3.intent-simulation.v1",
      signatureCreated: false,
      broadcastAttempted: false,
      custodyCreated: false,
      provenance: "deterministic-local-simulation",
    });
  });

  it("preserves explicit wallet, provider, balance, and write boundaries", () => {
    expect(web3Source).toMatch(/does not connect wallets/);
    expect(web3Source).toMatch(/query a real balance/);
    expect(web3Source).toMatch(/never signs, broadcasts, changes a balance/);
    expect(web3Source).toMatch(/No wallet connection or private-key handling/);
    expect(web3Source).toMatch(/No token transfer, custody, or settlement/);
    expect(web3Source).toMatch(/No mainnet provider or production protocol write/);
  });
});
