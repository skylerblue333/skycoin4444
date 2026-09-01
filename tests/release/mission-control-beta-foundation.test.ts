import fs from "node:fs";
import { describe, expect, it } from "vitest";

const missionControlSource = fs.readFileSync(
  "client/src/pages/MissionControl.tsx",
  "utf8"
);
const betaScope = fs.readFileSync("BETA_SCOPE.md", "utf8");
const releaseChecklist = fs.readFileSync("BETA_RELEASE_CHECKLIST.md", "utf8");
const releaseWorkflow = fs.readFileSync(
  ".github/workflows/engineering-beta-rc-tag.yml",
  "utf8"
);
const betaCatalog = JSON.parse(
  fs.readFileSync("catalogs/mission-control-beta.json", "utf8")
) as {
  canonicalRepository: string;
  releaseChannel: string;
  capabilities: Array<{ id: string; status: string }>;
};

describe("Mission Control engineering-beta foundation", () => {
  it("shows a visible beta boundary and availability labels in Mission Control", () => {
    expect(missionControlSource).toMatch(
      /Mission Control engineering-beta boundary/
    );
    expect(missionControlSource).toMatch(
      /Invitation-only capability discovery and feedback surface/
    );
    expect(missionControlSource).toMatch(
      /Tabs\s+marked\s+unavailable\s+do\s+not\s+provide\s+live\s+mission\s+data/
    );
    expect(missionControlSource).toMatch(/status: "Unavailable"/);
    expect(missionControlSource).toMatch(/text-amber-200\/70/);
    expect(missionControlSource).toMatch(/\{t\.status\}/);
  });

  it("defines an invitation-only, non-financial beta with explicit admission criteria", () => {
    expect(betaScope).toMatch(/invitation-only engineering beta/i);
    expect(betaScope).toMatch(/financial settlement/i);
    expect(betaScope).toMatch(/wallet custody/i);
    expect(betaScope).toMatch(/provider-backed/i);
    expect(betaScope).toMatch(/Beta admission criteria/i);
    expect(releaseChecklist).toMatch(/exact release commit/i);
    expect(releaseChecklist).toMatch(/immutable engineering-beta RC tag/i);
    expect(releaseChecklist).toMatch(/Route-level beta smoke test/i);
  });

  it("records the canonical beta repository and excludes high-risk unverified capability classes", () => {
    expect(betaCatalog.canonicalRepository).toBe("skylerblue333/skycoin4444");
    expect(betaCatalog.releaseChannel).toBe("invitation-only-engineering-beta");
    expect(
      betaCatalog.capabilities.find(
        capability => capability.id === "mission-control-catalog"
      )?.status
    ).toBe("available_in_beta");
    expect(
      betaCatalog.capabilities.find(
        capability => capability.id === "financial-and-live-web3"
      )?.status
    ).toBe("unavailable");
    expect(
      betaCatalog.capabilities.find(
        capability => capability.id === "external-provider-integrations"
      )?.status
    ).toBe("unavailable");
  });

  it("creates an immutable release candidate tag from the successful CI-run identity and exact commit", () => {
    expect(releaseWorkflow).toMatch(
      /SOURCE_RUN_ID: \$\{\{ github\.event\.workflow_run\.id \}\}/
    );
    expect(releaseWorkflow).toMatch(
      /SOURCE_RUN_NUMBER: \$\{\{ github\.event\.workflow_run\.run_number \}\}/
    );
    expect(releaseWorkflow).toMatch(
      /RC_TAG="engineering-beta-rc-\$\{SOURCE_RUN_NUMBER\}-\$\{SOURCE_RUN_ID\}-\$\{short_sha\}"/
    );
    expect(releaseWorkflow).toMatch(/refusing to retarget/);
    expect(releaseWorkflow).not.toMatch(
      /RC_TAG: engineering-beta-rc-20260831-1/
    );
  });
});
