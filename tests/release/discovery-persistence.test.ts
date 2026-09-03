import fs from "node:fs";
import { describe, expect, it } from "vitest";

const schema = fs.readFileSync("drizzle/schema.ts", "utf8");
const migration = fs.readFileSync("drizzle/migrations/0006_discovery_persistence.sql", "utf8");
const router = fs.readFileSync("server/routers/discovery.ts", "utf8");
const appRouter = fs.readFileSync("server/routers.ts", "utf8");

describe("discovery persistence contracts", () => {
  it("declares matching durable tables and forward migration", () => {
    expect(schema).toContain("discoveryBookmarks = mysqlTable(\"discovery_bookmarks\"");
    expect(schema).toContain("searchHistory = mysqlTable(\"search_history\"");
    expect(migration).toContain("CREATE TABLE `discovery_bookmarks`");
    expect(migration).toContain("CREATE TABLE `search_history`");
    expect(migration).toContain("discovery_bookmarks_user_target_unique");
  });

  it("registers bounded, authenticated procedures with user ownership", () => {
    expect(appRouter).toContain("discovery:discoveryRouter");
    expect(router).toContain("protectedProcedure");
    expect(router).toContain("eq(discoveryBookmarks.userId, ctx.user.id)");
    expect(router).toContain("eq(searchHistory.userId, ctx.user.id)");
    expect(router).toContain("limit(100)");
    expect(router).toContain("limit(25)");
    expect(router).toContain("z.string().trim().min(2).max(100)");
  });
});
