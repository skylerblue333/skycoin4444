import fs from "node:fs";
import { describe, expect, it } from "vitest";

const rollback = fs.readFileSync("docs/BETA_ROLLBACK.md", "utf8");

describe("hosted beta rollback contract", () => {
  it("requires a previously verified application target", () => {
    expect(rollback).toMatch(/exact Git commit SHA/);
    expect(rollback).toMatch(/exact-head required CI green/);
    expect(rollback).toMatch(/hosted deployment.*SUCCESS/s);
    expect(rollback).toMatch(/readiness healthcheck/);
  });

  it("separates application rollback from database recovery", () => {
    expect(rollback).toMatch(
      /Do not automatically roll back the managed MySQL schema or data/
    );
    expect(rollback).toMatch(/empty-database bootstrap/);
    expect(rollback).toMatch(/reviewed database recovery\/forward-fix plan/);
  });

  it("preserves the hosted security and truth boundaries", () => {
    expect(rollback).toMatch(/identityVerification=false/);
    expect(rollback).toMatch(/liveFinancialOrChainExecution=false/);
    expect(rollback).toMatch(/without exposing the email, access key, cookie, or JWT/);
    expect(rollback).toMatch(/Do not create a duplicate app service/);
  });

  it("requires forward recovery through protected CI and canonical merge", () => {
    expect(rollback).toMatch(/new branch/);
    expect(rollback).toMatch(/required exact-head CI/);
    expect(rollback).toMatch(/canonical PR/);
    expect(rollback).toMatch(/Do not rewrite or force-push/);
  });
});
