import fs from "node:fs";
import { describe, expect, it } from "vitest";

const router = fs.readFileSync("server/routers/privacy.ts", "utf8");
const schema = fs.readFileSync("drizzle/schema.ts", "utf8");
const migration = fs.readFileSync(
  "drizzle/migrations/0009_privacy_requests.sql",
  "utf8"
);
const dataExport = fs.readFileSync("client/src/pages/DataExport.tsx", "utf8");
const deleteAccount = fs.readFileSync(
  "client/src/pages/DeleteAccount.tsx",
  "utf8"
);
const privacySettings = fs.readFileSync(
  "client/src/pages/PrivacySettings.tsx",
  "utf8"
);
const inventory = JSON.parse(
  fs.readFileSync("catalogs/screen-inventory.json", "utf8")
) as {
  routes: Array<{
    path: string;
    readiness: string;
    requiresAuth: boolean;
  }>;
};
const registry = JSON.parse(
  fs.readFileSync("catalogs/beta-route-evidence.json", "utf8")
) as {
  routes: Array<{
    route: string;
    capability: string;
    evidence: string[];
    boundary: string;
  }>;
};

describe("beta privacy controls", () => {
  it("persists account-owned deletion requests in the canonical schema", () => {
    expect(schema).toMatch(
      /export const privacyRequests = mysqlTable\("privacy_requests"/
    );
    expect(schema).toMatch(/userId: varchar\("user_id"/);
    expect(schema).toMatch(/operatorNote: text\("operator_note"\)/);
    expect(migration).toMatch(/CREATE TABLE `privacy_requests`/);
    expect(migration).toMatch(/FOREIGN KEY \(`user_id`\) REFERENCES `users` \(`id`\)/);
  });

  it("keeps export self-scoped and explicit about incomplete legacy/provider coverage", () => {
    expect(router).toMatch(/exportData: protectedProcedure/);
    expect(router).toMatch(/const userId = ctx\.user\.id/);
    expect(router).toMatch(/eq\(posts\.userId, userId\)/);
    expect(router).toMatch(/eq\(courseProgress\.userId, userId\)/);
    expect(router).toMatch(/eq\(betaFeedback\.userId, userId\)/);
    expect(router).toMatch(/not a claim of exhaustive export/);
    expect(router).not.toMatch(/userId:\\s*z\\./);
  });

  it("records deletion intake but cannot falsely mark deletion complete", () => {
    expect(router).toMatch(/confirmation: z\.literal\("DELETE MY BETA ACCOUNT"\)/);
    expect(router).toMatch(/An active deletion request already exists/);
    expect(router).toMatch(/decision: z\.enum\(\["approved", "rejected"\]\)/);
    expect(router).toMatch(/completionSupported: false/);
    expect(router).toMatch(/cannot mark deletion completed/);
    expect(deleteAccount).toMatch(/does not immediately erase your records/);
    expect(deleteAccount).toMatch(/automated verified purge is not implemented yet/i);
  });

  it("replaces generated privacy shells with authenticated real procedures", () => {
    expect(dataExport).toMatch(/trpc\.privacy\.exportData\.useQuery/);
    expect(dataExport).toMatch(/Create JSON export/);
    expect(deleteAccount).toMatch(/trpc\.privacy\.requestDeletion\.useMutation/);
    expect(deleteAccount).toMatch(/trpc\.privacy\.myRequests\.useQuery/);
    expect(privacySettings).toMatch(/trpc\.user\.updateProfile\.useMutation/);
    expect(privacySettings).toContain("/data-export");
    expect(privacySettings).toContain("/delete-account");

    for (const source of [dataExport, deleteAccount, privacySettings]) {
      expect(source).not.toMatch(/No data available\. Start by creating/);
      expect(source).not.toMatch(/Fully functional.*real-time updates/i);
      expect(source).not.toMatch(/802K\+|2\.4M|99\.9%|45ms/);
      expect(source).not.toMatch(/Content for DeleteAccount page/);
    }
  });

  it("promotes exactly the three privacy routes with authenticated evidence", () => {
    const paths = ["/privacy-settings", "/data-export", "/delete-account"];
    const byPath = new Map(inventory.routes.map(route => [route.path, route]));
    const byRoute = new Map(registry.routes.map(route => [route.route, route]));

    for (const path of paths) {
      expect(byPath.get(path)).toMatchObject({
        readiness: "launchable_beta",
        requiresAuth: true,
      });
      expect(byRoute.get(path)?.evidence.length).toBeGreaterThanOrEqual(3);
      expect(byRoute.get(path)?.boundary).toBeTruthy();
    }

    expect(
      inventory.routes.filter(route => route.readiness === "launchable_beta")
    ).toHaveLength(35);
    expect(
      inventory.routes.filter(route => route.readiness === "legacy_unverified")
    ).toHaveLength(969);
  });
});
