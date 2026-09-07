import fs from "node:fs";
import { createTRPCUntypedClient } from "@trpc/client";
import { describe, expect, it } from "vitest";

const script = fs.readFileSync(
  "scripts/hosted-beta-journey-smoke.mjs",
  "utf8"
);
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const docs = fs.readFileSync("docs/BETA_DEPLOYMENT.md", "utf8");

describe("hosted beta full journey verifier contract", () => {
  it("uses the installed untyped tRPC client instead of hand-rolling protocol envelopes", () => {
    expect(typeof createTRPCUntypedClient).toBe("function");
    expect(script).toContain("createTRPCUntypedClient");
    expect(script).toContain("httpBatchLink");
    expect(script).toContain('url: origin + "/api/trpc"');
  });

  it("covers the complete persisted invitation-beta release journey", () => {
    for (const procedure of [
      '"auth.me"',
      '"activation.status"',
      '"user.updateProfile"',
      '"user.profile"',
      '"learningProgress.complete"',
      '"learningProgress.get"',
      '"social.createPost"',
      '"betaFeedback.submit"',
      '"privacy.exportData"',
      '"privacy.requestDeletion"',
      '"privacy.myRequests"',
    ]) {
      expect(script).toContain(procedure);
    }

    expect(script).toContain('"/onboarding"');
    expect(script).toContain("activation?.percent !== 100");
    expect(script).toContain("profile persistence across re-authentication");
    expect(script).toContain("SkySchool completion persistence");
    expect(script).toContain("social post persistence");
    expect(script).toContain("beta feedback persistence");
    expect(script).toContain("authenticated data export ownership");
    expect(script).toContain("deletion-request persistence");
  });

  it("keeps destructive semantics limited to a deletion request, not a purge claim", () => {
    expect(script).toContain('const DELETE_CONFIRMATION = "DELETE MY BETA ACCOUNT"');
    expect(script).toContain('"privacy.requestDeletion"');
    expect(script).toMatch(/includes\("not mean"\)/);
    expect(script).toMatch(/includes\("erased"\)/);
    expect(script).not.toMatch(/mark.*delet.*complete/i);
    expect(script).not.toMatch(/purgeAccount/i);
  });

  it("does not intentionally print credentials, cookies, or returned user objects", () => {
    expect(script).not.toMatch(
      /console\.(?:log|error)\([\s\S]{0,180}(?:credentials\.email|credentials\.accessKey|cookiePair|BETA_SMOKE_EMAIL|BETA_ACCESS_KEY|sessionToken)/
    );
    expect(script).not.toMatch(/JSON\.stringify\(user\)/);
    expect(script).not.toMatch(/console\.log\([^\n]*userId/);
  });

  it("is exposed as an explicit separate command and documented as mutating disposable beta evidence", () => {
    expect(pkg.scripts["beta:smoke:hosted:journey"]).toBe(
      "node scripts/hosted-beta-journey-smoke.mjs"
    );
    expect(docs).toContain("## Full hosted journey verifier");
    expect(docs).toContain("disposable invited smoke identity");
    expect(docs).toContain("creates beta records");
    expect(docs).toContain(
      "Do not run this verifier against an owner's or real tester's account"
    );
  });
});
