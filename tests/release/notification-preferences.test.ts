import fs from "node:fs";
import { describe, expect, it } from "vitest";

const page = fs.readFileSync("client/src/pages/NotificationPreferences.tsx", "utf8");
const router = fs.readFileSync("server/routers/notificationPreferences.ts", "utf8");
const notifications = fs.readFileSync("server/routers/notifications.ts", "utf8");
const schema = fs.readFileSync("drizzle/schema.ts", "utf8");
const migration = fs.readFileSync("drizzle/migrations/0008_notification_preferences.sql", "utf8");

describe("notification preferences", () => {
  it("uses durable authenticated settings with safe defaults", () => {
    expect(page).toContain("trpc.notificationPreferences.get.useQuery");
    expect(page).toContain("trpc.notificationPreferences.update.useMutation");
    expect(router).toContain("protectedProcedure");
    expect(router).toContain("notificationPreferences.userId, ctx.user.id");
    expect(schema).toContain("notificationPreferences = mysqlTable(\"notification_preferences\"");
    expect(migration).toContain("CREATE TABLE `notification_preferences`");
    expect(migration).toContain("DEFAULT true");
  });

  it("only changes in-app visibility and does not imply external delivery", () => {
    expect(page).toMatch(/Email: unavailable/);
    expect(page).toMatch(/Push and SMS: unavailable/);
    expect(notifications).toContain("if (preferences && !preferences.inAppEnabled) return [];");
    expect(notifications).toContain("if (preferences && !preferences.inAppEnabled) return { count: 0 };");
    expect(page).not.toMatch(/sendEmail|sendPush|sendSms|deliveryProvider/);
  });
});
