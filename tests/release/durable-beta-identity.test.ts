import fs from "node:fs";
import { describe, expect, it } from "vitest";

const dbSource = fs.readFileSync("server/db.ts", "utf8");
const oauthSource = fs.readFileSync("server/_core/oauth.ts", "utf8");
const sdkSource = fs.readFileSync("server/_core/sdk.ts", "utf8");
const schemaSource = fs.readFileSync("drizzle/schema.ts", "utf8");
const localDbSource = fs.readFileSync("scripts/local-db.mjs", "utf8");

describe("durable beta identity and schema contract", () => {
  it("looks OAuth identities up by open_id rather than email", () => {
    expect(dbSource).toMatch(
      /getUserByOpenId[\s\S]*eq\(schema\.users\.openId, openId\)/
    );
    expect(dbSource).not.toMatch(
      /getUserByOpenId[\s\S]{0,220}schema\.users\.email/
    );
  });

  it("upserts repeat OAuth identities and generates a primary key for first login", () => {
    expect(dbSource).toMatch(/randomUUID/);
    expect(dbSource).toMatch(
      /db\.query\.users\.findFirst\(\{ where: eq\(schema\.users\.openId, data\.openId\) \}\)/
    );
    expect(dbSource).toMatch(/const id = data\.id \?\? randomUUID\(\)/);
    expect(dbSource).toMatch(
      /db\.update\(schema\.users\)[\s\S]*existing\.id/
    );
  });

  it("persists only identity fields modeled by the current user schema", () => {
    expect(schemaSource).toMatch(
      /id: varchar\("id", \{ length: 255 \}\)\.primaryKey\(\)/
    );
    expect(schemaSource).toMatch(
      /openId: varchar\("open_id", \{ length: 255 \}\)\.unique\(\)/
    );

    const oauthUpsert = oauthSource.match(
      /await db\.upsertUser\(\{[\s\S]*?\}\);/
    )?.[0] ?? "";
    expect(oauthUpsert).toContain("openId: userInfo.openId");
    expect(oauthUpsert).not.toMatch(/loginMethod|lastSignedIn/);

    const sdkUpserts = sdkSource.match(/await db\.upsertUser\(\{[\s\S]*?\}\);/g) ?? [];
    expect(sdkUpserts.length).toBeGreaterThanOrEqual(2);
    for (const source of sdkUpserts) {
      expect(source).not.toMatch(/loginMethod|lastSignedIn/);
    }
  });

  it("bootstraps disposable local beta databases from the canonical Drizzle schema", () => {
    expect(localDbSource).toMatch(
      /\["exec", "drizzle-kit", "push", "--force"\]/
    );
    expect(localDbSource).toMatch(/database\.endsWith\("_local"\)/);
    expect(localDbSource).toMatch(/"127\.0\.0\.1", "localhost", "::1"/);
    expect(localDbSource).toMatch(/open_id/);
    expect(localDbSource).toMatch(/profile_visibility/);
    expect(localDbSource).not.toMatch(/0000_crazy_the_professor/);
    expect(localDbSource).not.toMatch(/drizzle\/migrations/);
  });
});
