import { mysqlTable, varchar, timestamp } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./schema";

export const callSessions = mysqlTable("call_sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  callerId: varchar("caller_id", { length: 255 }).references(() => users.id).notNull(),
  calleeId: varchar("callee_id", { length: 255 }).references(() => users.id).notNull(),
  mode: varchar("mode", { length: 16 }).notNull(),
  status: varchar("status", { length: 24 }).default("ringing").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  answeredAt: timestamp("answered_at"),
  endedAt: timestamp("ended_at"),
});

export type CallSession = typeof callSessions.$inferSelect;
