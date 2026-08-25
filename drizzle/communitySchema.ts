import { mysqlTable, varchar, int, timestamp, text } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";
import { users } from "./schema";

export const communities = mysqlTable("communities", {
  id: varchar("id", { length: 255 }).primaryKey(),
  ownerId: varchar("owner_id", { length: 255 }).references(() => users.id).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  description: varchar("description", { length: 255 }),
  category: varchar("category", { length: 80 }).default("General"),
  visibility: varchar("visibility", { length: 20 }).default("public").notNull(),
  memberCount: int("member_count").default(1).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const communityMembers = mysqlTable("community_members", {
  id: varchar("id", { length: 255 }).primaryKey(),
  communityId: varchar("community_id", { length: 255 }).references(() => communities.id).notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  role: varchar("role", { length: 20 }).default("member").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const communityThreads = mysqlTable("community_threads", {
  id: varchar("id", { length: 255 }).primaryKey(),
  communityId: varchar("community_id", { length: 255 }).references(() => communities.id).notNull(),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  body: text("body").notNull(),
  replyCount: int("reply_count").default(0).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const communityReplies = mysqlTable("community_replies", {
  id: varchar("id", { length: 255 }).primaryKey(),
  threadId: varchar("thread_id", { length: 255 }).references(() => communityThreads.id).notNull(),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export type Community = typeof communities.$inferSelect;
export type CommunityMember = typeof communityMembers.$inferSelect;
export type CommunityThread = typeof communityThreads.$inferSelect;
export type CommunityReply = typeof communityReplies.$inferSelect;
