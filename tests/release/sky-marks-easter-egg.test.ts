import fs from "node:fs";
import { describe, expect, it } from "vitest";

const component = fs.readFileSync(
  "client/src/components/SkyMarkEasterEgg.tsx",
  "utf8"
);
const workspace = fs.readFileSync("client/src/pages/BetaWorkspace.tsx", "utf8");
const discovery = fs.readFileSync("client/src/pages/DiscoveryCenter.tsx", "utf8");
const readiness = fs.readFileSync(
  "client/src/pages/OperationalReadiness.tsx",
  "utf8"
);
const feedback = fs.readFileSync("client/src/pages/BetaFeedback.tsx", "utf8");

describe("Sky Mark Easter egg trail", () => {
  it("keeps the reusable mark local and accessible", () => {
    expect(component).toContain("Sky Mark");
    expect(component).toMatch(/aria-expanded=\{open\}/);
    expect(component).toContain("Nothing is saved or tracked");
    expect(component).not.toMatch(/localStorage/);
    expect(component).not.toMatch(/sessionStorage/);
    expect(component).not.toMatch(/fetch\(/);
    expect(component).not.toMatch(/trpc\./);
    expect(component).not.toMatch(/document\.cookie/);
  });

  it("mounts all four marks in the intended collision-free beta surfaces", () => {
    expect(workspace).toMatch(/index=\{1\}[\s\S]*word="BUILD"/);
    expect(discovery).toMatch(/index=\{2\}[\s\S]*word="SEEK"/);
    expect(readiness).toMatch(/index=\{3\}[\s\S]*word="PROVE"/);
    expect(feedback).toMatch(/index=\{4\}[\s\S]*word="LISTEN"/);
  });

  it("preserves the four hidden notes", () => {
    expect(workspace).toContain("one tested piece at a time");
    expect(discovery).toContain("Search widely. Stay curious.");
    expect(readiness).toContain("Green lights are earned, not imagined.");
    expect(feedback).toContain("Listen before you defend.");
  });
});
