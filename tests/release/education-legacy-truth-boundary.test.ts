import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const certificate = readFileSync(
  "client/src/pages/SchoolCertificate.tsx",
  "utf8"
);
const learning = readFileSync("client/src/pages/Learning.tsx", "utf8");
const learningPath = readFileSync(
  "client/src/pages/LearningPath.tsx",
  "utf8"
);
const myLearning = readFileSync("client/src/pages/MyLearning.tsx", "utf8");
const certificateManager = readFileSync(
  "client/src/pages/CertificateManager.tsx",
  "utf8"
);

describe("legacy education truth boundaries", () => {
  it("retires fabricated certificate and blockchain verification claims", () => {
    expect(certificate).toContain("Completion evidence — not a credential");
    expect(certificate).toContain("activityEvidence.list.useQuery");
    expect(certificate).toContain("No accreditation claim");
    expect(certificate).toContain("No chain-verification claim");
    expect(certificate).not.toContain("Skyler Blue");
    expect(certificate).not.toContain("Dr. Alex Chen");
    expect(certificate).not.toContain("permanently recorded on-chain");
    expect(certificate).not.toContain("View on Explorer");
    expect(certificate).not.toContain("94%");
    expect(certificate).not.toContain("0x7f4e2a1b");
  });

  it("converges stale learning shells on the canonical SkySchool surface", () => {
    for (const source of [learning, learningPath, myLearning]) {
      expect(source).toContain('export { default } from "./SkySchool"');
      expect(source).not.toContain("SKY444 rewards");
      expect(source).not.toContain("No data available. Start by creating a new item.");
    }
  });

  it("routes legacy certificate management to the truthful evidence boundary", () => {
    expect(certificateManager).toContain(
      'export { default } from "./SchoolCertificate"'
    );
    expect(certificateManager).not.toContain("Digital certificates");
    expect(certificateManager).not.toContain("No data available. Start by creating a new item.");
  });
});
