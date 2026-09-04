import fs from "node:fs";
import { describe, expect, it } from "vitest";

const signin = fs.readFileSync("client/src/pages/Signin.tsx", "utf8");
const oauth = fs.readFileSync("server/_core/oauth.ts", "utf8");
const sdk = fs.readFileSync("server/_core/sdk.ts", "utf8");
const indexSource = fs.readFileSync("server/_core/index.ts", "utf8");
const render = fs.readFileSync("render.yaml", "utf8");
const bootstrap = fs.readFileSync("scripts/bootstrap-beta-db.mjs", "utf8");
const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const platformWorkflow = fs.readFileSync(".github/workflows/platform-vertical-ci.yml", "utf8");
const identityWorkflow = fs.readFileSync(".github/workflows/skyidentity.yml", "utf8");

describe("invitation-only deployable beta boundary", () => {
  it("removes the historical fake browser password sign-in", () => {
    expect(signin).toMatch(/Invitation-only engineering beta/);
    expect(signin).toMatch(/approved identity provider/);
    expect(signin).toMatch(/never accepts a SKYCOIN4444 password/);
    expect(signin).not.toMatch(/auth_token/);
    expect(signin).not.toMatch(/demo@skycoin\.com/);
    expect(signin).not.toMatch(/demo1234/);
    expect(signin).not.toMatch(/btoa\(/);
    expect(signin).not.toMatch(/type="password"/);
  });

  it("checks admission before OAuth session issuance and on later requests", () => {
    const admissionPosition = oauth.indexOf("evaluateBetaAdmission");
    const upsertPosition = oauth.indexOf("await db.upsertUser");
    const sessionPosition = oauth.indexOf("createSessionToken");

    expect(admissionPosition).toBeGreaterThan(-1);
    expect(upsertPosition).toBeGreaterThan(admissionPosition);
    expect(sessionPosition).toBeGreaterThan(admissionPosition);
    expect(oauth).toMatch(/\/signin\?reason=not-invited/);

    expect(sdk).toMatch(/evaluateBetaAdmission/);
    expect(sdk).toMatch(/Account is not admitted to this invitation-only beta/);
  });

  it("restricts production OAuth callbacks to the configured beta origin", () => {
    expect(oauth).toMatch(/BETA_PUBLIC_ORIGIN/);
    expect(oauth).toMatch(/url\.pathname !== "\/api\/oauth\/callback"/);
    expect(oauth).toMatch(/url\.origin === new URL\(configuredOrigin\)\.origin/);
  });

  it("fails startup on invalid production beta configuration", () => {
    expect(indexSource).toMatch(/assertProductionBetaConfig\(\)/);
  });

  it("guards the one-time managed beta database bootstrap", () => {
    expect(packageJson.scripts["beta:db:bootstrap"]).toBe(
      "node scripts/bootstrap-beta-db.mjs"
    );
    expect(bootstrap).toMatch(/BETA_DB_BOOTSTRAP_CONFIRM/);
    expect(bootstrap).toMatch(/EMPTY_BETA_DATABASE/);
    expect(bootstrap).toMatch(/SHOW TABLES/);
    expect(bootstrap).toMatch(/is not empty/);
    expect(bootstrap).toMatch(/refuses localhost/i);
    expect(bootstrap).toMatch(/drizzle-kit", "push", "--force/);
    expect(bootstrap).toMatch(/No seed users, balances, transactions, or provider data/);
  });

  it("keeps specialized platform and identity workflows on the exact PR head", () => {
    const exactHead = /github\.event\.pull_request\.head\.sha/;
    expect(platformWorkflow).toMatch(exactHead);
    expect(identityWorkflow).toMatch(exactHead);
    expect(platformWorkflow).toMatch(/audit-production-dependencies\.mjs/);
    expect(identityWorkflow).toMatch(/audit-production-dependencies\.mjs/);
    expect(identityWorkflow).toMatch(/timeout-minutes: 15/);
  });

  it("wires Render to readiness, OAuth, origin, and invitation configuration", () => {
    expect(render).toMatch(/healthCheckPath: \/api\/beta\/readiness/);
    for (const key of [
      "BETA_ACCESS_MODE",
      "BETA_PUBLIC_ORIGIN",
      "BETA_ALLOWED_EMAILS",
      "BETA_ALLOWED_OPEN_IDS",
      "VITE_OAUTH_PORTAL_URL",
      "JWT_SECRET",
      "DATABASE_URL",
    ]) {
      expect(render).toContain(`key: ${key}`);
    }
    expect(render).toMatch(/key: BETA_ACCESS_MODE\s+value: invite_only/);
    expect(render).toMatch(/key: LOCAL_TEST_MODE\s+value: "false"/);
  });
});
