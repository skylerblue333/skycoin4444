import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { tokenAllocationDraft } from "../../client/src/data/investorReadiness";

const read = (path: string) => fs.readFileSync(path, "utf8");

const ico = read("client/src/pages/ICOLaunchpad.tsx");
const portal = read("client/src/pages/InvestorPortal.tsx");
const metrics = read("client/src/pages/InvestorMetrics.tsx");
const pitch = read("client/src/pages/InvestorPitch.tsx");
const room = read("client/src/pages/InvestorRoom.tsx");
const tokenMetrics = read("client/src/pages/TokenMetrics.tsx");
const calculator = read("client/src/pages/TokenomicsCalculator.tsx");

describe("investor and ICO capital-readiness surfaces", () => {
  it("replaces the fake live ICO purchase flow with gated launch readiness", () => {
    expect(ico).toContain("Launch Readiness Lab");
    expect(ico).toContain("No live offering");
    expect(ico).toContain("does not accept");
    expect(ico).toContain("KYC/AML");

    for (const forbidden of [
      "PRE-SALE LIVE",
      "Connect Wallet & Buy",
      "CertiK",
      "Sumsub",
      "Trail of Bits",
      "5-of-9 signers",
      "Total Raised",
      "Participants",
    ]) {
      expect(ico).not.toContain(forbidden);
    }
  });

  it("keeps investor metrics evidence-based instead of publishing synthetic KPIs", () => {
    expect(metrics).toContain("No synthetic KPIs");
    expect(metrics).toContain("Evidence not connected");
    expect(metrics).toContain("named source");

    for (const forbidden of [
      "5,340",
      "19,500",
      "$125M",
      "$500M+",
      "$150K",
      "Real-time platform analytics",
    ]) {
      expect(metrics).not.toContain(forbidden);
    }
  });

  it("turns the pitch and room into diligence surfaces without fabricated financing claims", () => {
    expect(pitch).toContain("Evidence-first deck");
    expect(pitch).toContain("no fabricated raise amount");
    expect(room).toContain("Due diligence workspace");
    expect(room).toContain("does not invent");

    for (const forbidden of [
      "$2M seed round",
      "$15M pre-money",
      "$1.59T",
      "$2.3B",
      "first fully integrated AI-powered Web3 social ecosystem",
      "private sale allocation",
      "SKY444 token launch",
      "4,444,444,444",
      "tokenomicsData",
      "trpc.investor",
    ]) {
      expect(pitch + room).not.toContain(forbidden);
    }
  });

  it("keeps token metrics and tokenomics clearly separated from live market claims", () => {
    expect(tokenMetrics).toContain("Evidence not connected");
    expect(tokenMetrics).toContain("verified contract");
    expect(calculator).toContain("Draft math only");
    expect(calculator).toContain("Allocation total");
    expect(calculator).toContain("does not");

    expect(tokenMetrics).not.toContain("Fully functional token metrics page with live data");
    expect(calculator).not.toContain("No data available. Start by creating a new item.");
  });

  it("keeps the starter allocation internally consistent and visibly draft", () => {
    expect(
      tokenAllocationDraft.reduce((total, row) => total + row.percentage, 0)
    ).toBe(100);
    expect(tokenAllocationDraft).toHaveLength(6);
    expect(tokenAllocationDraft.every(row => /Draft planning allocation/.test(row.note))).toBe(true);
    expect(portal).toContain("Planning only");
    expect(portal).toContain("not a live");
  });
});
