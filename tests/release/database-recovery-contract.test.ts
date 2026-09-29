import { describe, expect, it } from "vitest";
import {
  assertDisposableRestoreTarget,
  assertDistinctRecoveryTargets,
  assertMatchingTableSets,
  assertRequiredRecoveryTables,
  buildMysqlDefaultsFile,
  normalizeTableNames,
  parseMysqlRecoveryTarget,
  parsePositiveNumber,
  resolveReleaseSha,
  sanitizeRecoveryError,
} from "../../server/operations/databaseRecovery";

describe("database recovery safety contracts", () => {
  it("parses a managed MySQL target without retaining the raw URL", () => {
    expect(
      parseMysqlRecoveryTarget(
        "mysql://beta_user:p%40ssword@mysql.internal:3307/skycoin_beta?ssl=true",
      ),
    ).toEqual({
      hostname: "mysql.internal",
      port: 3307,
      username: "beta_user",
      password: "p@ssword",
      database: "skycoin_beta",
    });
  });

  it("rejects malformed, non-MySQL, local, and missing-database targets", () => {
    expect(() => parseMysqlRecoveryTarget("not-a-url")).toThrow(
      "MySQL recovery URL is malformed",
    );
    expect(() =>
      parseMysqlRecoveryTarget("postgres://user:pw@db.internal/app"),
    ).toThrow("mysql://");
    expect(() =>
      parseMysqlRecoveryTarget("mysql://user:pw@localhost/app"),
    ).toThrow("refuses localhost");
    expect(() =>
      parseMysqlRecoveryTarget("mysql://user:pw@[::1]/app"),
    ).toThrow("refuses localhost");
    expect(() =>
      parseMysqlRecoveryTarget("mysql://user:pw@db.internal/"),
    ).toThrow("database name");
  });

  it("permits localhost only for an explicitly opted-in disposable restore", () => {
    expect(
      parseMysqlRecoveryTarget("mysql://user:pw@127.0.0.1/skycoin_restore_ci", {
        allowLocalhost: true,
      }).database,
    ).toBe("skycoin_restore_ci");
  });

  it("never permits the source database to be used as the restore target", () => {
    const source = parseMysqlRecoveryTarget(
      "mysql://source:pw@db.internal/skycoin_beta",
    );
    const sameDatabase = parseMysqlRecoveryTarget(
      "mysql://other:pw2@db.internal/skycoin_beta",
    );

    expect(() =>
      assertDistinctRecoveryTargets(source, sameDatabase),
    ).toThrow("different database");
    const sameDatabaseDifferentCase = parseMysqlRecoveryTarget(
      "mysql://other:pw2@db.internal/SKYCOIN_BETA",
    );
    expect(() =>
      assertDistinctRecoveryTargets(source, sameDatabaseDifferentCase),
    ).toThrow("different database");
  });

  it("requires an obvious disposable database prefix", () => {
    const unsafe = parseMysqlRecoveryTarget(
      "mysql://user:pw@db.internal/skycoin_beta_copy",
    );
    const safe = parseMysqlRecoveryTarget(
      "mysql://user:pw@db.internal/skycoin_restore_20260928",
    );

    expect(() => assertDisposableRestoreTarget(unsafe)).toThrow(
      "skycoin_restore_",
    );
    expect(() => assertDisposableRestoreTarget(safe)).not.toThrow();
  });

  it("writes credentials only to a quoted temporary client config contract", () => {
    const target = parseMysqlRecoveryTarget(
      "mysql://beta_user:p%22a%5Css@db.internal/skycoin_beta",
    );
    const config = buildMysqlDefaultsFile(target);

    expect(config).toContain('host="db.internal"');
    expect(config).toContain('user="beta_user"');
    expect(config).toContain('password="p\\\"a\\\\ss"');
    expect(config).not.toContain("mysql://");
  });

  it("normalizes SHOW TABLES rows deterministically and rejects invalid rows", () => {
    expect(
      normalizeTableNames([
        { Tables_in_beta: "users" },
        { Tables_in_beta: "audit_ledger" },
      ]),
    ).toEqual(["audit_ledger", "users"]);

    expect(() =>
      normalizeTableNames([{ first: "users", second: "posts" }]),
    ).toThrow("invalid table name");
  });

  it("requires exact table-set equality and canonical recovery tables", () => {
    expect(() =>
      assertMatchingTableSets(["posts", "users"], ["users", "posts"]),
    ).not.toThrow();
    expect(() =>
      assertMatchingTableSets(["posts"], ["posts", "users"]),
    ).toThrow("does not match");

    expect(() =>
      assertRequiredRecoveryTables([
        "users",
        "beta_feedback",
        "course_progress",
        "posts",
        "audit_ledger",
      ]),
    ).not.toThrow();
    expect(() => assertRequiredRecoveryTables(["users"])).toThrow(
      "beta_feedback",
    );
  });

  it("redacts configured database URLs and credentials from recovery failures", () => {
    const databaseUrl =
      "mysql://beta_user:p@ssword@db.internal/skycoin_beta?token=leaked-token";
    const safe = sanitizeRecoveryError(
      new Error(
        databaseUrl +
          " failed password=provider-secret Bearer abc.def.ghi user=beta_user",
      ),
      {
        DATABASE_URL: databaseUrl,
      } as NodeJS.ProcessEnv,
    );

    expect(safe).toContain("[redacted-database-url]");
    expect(safe).not.toContain("p@ssword");
    expect(safe).not.toContain("@ssword@");
    expect(safe).not.toContain("leaked-token");
    expect(safe).not.toContain("provider-secret");
    expect(safe).not.toContain("abc.def.ghi");
  });

  it("validates recovery objectives and release identities", () => {
    expect(parsePositiveNumber(undefined, 24, "RPO")).toBe(24);
    expect(parsePositiveNumber("0.5", 24, "RPO")).toBe(0.5);
    expect(() => parsePositiveNumber("0", 24, "RPO")).toThrow(
      "positive number",
    );

    expect(
      resolveReleaseSha([
        "not-a-sha",
        "911575c37fc075cf0d4afaa618ca14fc871472c8",
      ]),
    ).toBe("911575c37fc075cf0d4afaa618ca14fc871472c8");
    expect(resolveReleaseSha([undefined, ""])).toBeNull();
  });
});
