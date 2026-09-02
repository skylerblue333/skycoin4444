import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { eq } from "drizzle-orm";
import { users, type User } from "../../drizzle/schema";
import { db } from "../db";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures. Local test auth is
    // explicitly opt-in, development-only, and requires a seeded local user.
    if (process.env.NODE_ENV === "development" && process.env.LOCAL_TEST_MODE === "true") {
      user = (await db.select().from(users).where(eq(users.openId, "local-test-user")).limit(1))[0] ?? null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
