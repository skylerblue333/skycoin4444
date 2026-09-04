import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

const databaseUrl = process.env.DATABASE_URL?.trim();
const poolConnection = databaseUrl ? mysql.createPool(databaseUrl) : null;

if (!databaseUrl) {
  console.warn('[Database] DATABASE_URL is not configured; database-backed features are unavailable.');
}

type Database = ReturnType<typeof drizzle<typeof schema>>;

function unavailableDatabaseError(): never {
  throw new Error('DATABASE_URL is not configured; database-backed feature unavailable');
}

export const db = poolConnection
  ? drizzle(poolConnection, { schema, mode: 'default' })
  : (new Proxy({}, {
      get() {
        return unavailableDatabaseError();
      },
    }) as Database);

export async function getDb() {
  if (!databaseUrl) unavailableDatabaseError();
  return db;
}

function databaseFailure(operation: string, error: unknown): never {
  const cause = error instanceof Error ? error : new Error(String(error));
  throw new Error(`Database operation failed: ${operation}`, { cause });
}

// ============ USER HELPERS ============
export async function getUserById(id: string) {
  try {
    return await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  } catch (error) {
    return databaseFailure('getUserById', error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    return await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  } catch (error) {
    return databaseFailure('getUserByEmail', error);
  }
}

type UserIdentityUpsert = {
  openId: string;
  id?: string;
  email?: schema.InsertUser['email'];
  name?: schema.InsertUser['name'];
  username?: schema.InsertUser['username'];
  bio?: schema.InsertUser['bio'];
  avatar?: schema.InsertUser['avatar'];
  profileVisibility?: schema.InsertUser['profileVisibility'];
};

export async function upsertUser(data: UserIdentityUpsert) {
  try {
    const existing = data.id
      ? await db.query.users.findFirst({ where: eq(schema.users.id, data.id) })
      : await db.query.users.findFirst({ where: eq(schema.users.openId, data.openId) });

    if (existing) {
      const updates: Partial<schema.InsertUser> = {
        updatedAt: new Date(),
      };
      if (data.email !== undefined) updates.email = data.email;
      if (data.name !== undefined) updates.name = data.name;
      if (data.username !== undefined) updates.username = data.username;
      if (data.bio !== undefined) updates.bio = data.bio;
      if (data.avatar !== undefined) updates.avatar = data.avatar;
      if (data.profileVisibility !== undefined) {
        updates.profileVisibility = data.profileVisibility;
      }

      await db.update(schema.users).set(updates).where(eq(schema.users.id, existing.id));
      return await db.query.users.findFirst({ where: eq(schema.users.id, existing.id) });
    }

    const id = data.id ?? randomUUID();
    await db.insert(schema.users).values({
      ...data,
      id,
      updatedAt: new Date(),
    });
    return await db.query.users.findFirst({ where: eq(schema.users.id, id) });
  } catch (error) {
    return databaseFailure('upsertUser', error);
  }
}

export async function getUserByOpenId(openId: string) {
  try {
    return await db.query.users.findFirst({ where: eq(schema.users.openId, openId) });
  } catch (error) {
    return databaseFailure('getUserByOpenId', error);
  }
}

export async function ensureAllTokenBalances(userId: string) {
  try {
    const defaultTokens = ['BTC', 'ETH', 'SOL', 'DOGE', 'TRUMP', 'SKY444'];
    for (const tokenSymbol of defaultTokens) {
      const existingBalance = await db.query.tokenBalances.findFirst({
        where: (tokenBalances, { eq: eqOp, and: andOp }) =>
          andOp(eqOp(tokenBalances.userId, userId), eqOp(tokenBalances.tokenSymbol, tokenSymbol)),
      });
      if (!existingBalance) {
        await db.insert(schema.tokenBalances).values({
          id: `${userId}-${tokenSymbol}`,
          userId,
          tokenSymbol,
          balance: 0,
        });
      }
    }
    return { success: true } as const;
  } catch (error) {
    return databaseFailure('ensureAllTokenBalances', error);
  }
}

export async function createUser(data: any) {
  try {
    await db.insert(schema.users).values(data);
    return data;
  } catch (error) {
    return databaseFailure('createUser', error);
  }
}

export async function updateUserBalance(userId: string, amount: number) {
  try {
    await db.update(schema.users).set({ balance: amount }).where(eq(schema.users.id, userId));
    return { success: true } as const;
  } catch (error) {
    return databaseFailure('updateUserBalance', error);
  }
}

// ============ POST HELPERS ============
export async function getPosts(limit = 20, offset = 0) {
  try {
    return await db.query.posts.findMany({ limit, offset });
  } catch (error) {
    return databaseFailure('getPosts', error);
  }
}

export async function getPostsByUser(userId: string) {
  try {
    return await db.query.posts.findMany({ where: eq(schema.posts.userId, userId) });
  } catch (error) {
    return databaseFailure('getPostsByUser', error);
  }
}

export async function createPost(userId: string, content: string, media?: string) {
  const id = `post-${Date.now()}`;
  try {
    await db.insert(schema.posts).values({ id, userId, content, media });
    return { id, userId, content, media };
  } catch (error) {
    return databaseFailure('createPost', error);
  }
}

// ============ PRODUCT HELPERS ============
export async function getProducts(limit = 20, offset = 0, category?: string) {
  try {
    if (category) {
      return await db.query.products.findMany({
        where: eq(schema.products.category, category),
        limit,
        offset,
      });
    }
    return await db.query.products.findMany({ limit, offset });
  } catch (error) {
    return databaseFailure('getProducts', error);
  }
}

export async function getProductById(id: string) {
  try {
    return await db.query.products.findFirst({ where: eq(schema.products.id, id) });
  } catch (error) {
    return databaseFailure('getProductById', error);
  }
}

export async function createProduct(data: any) {
  try {
    await db.insert(schema.products).values(data);
    return data;
  } catch (error) {
    return databaseFailure('createProduct', error);
  }
}

// ============ ORDER HELPERS ============
export async function getOrders(userId: string) {
  try {
    return await db.query.orders.findMany({ where: eq(schema.orders.userId, userId) });
  } catch (error) {
    return databaseFailure('getOrders', error);
  }
}

export async function createOrder(data: any) {
  try {
    await db.insert(schema.orders).values(data);
    return data;
  } catch (error) {
    return databaseFailure('createOrder', error);
  }
}

// ============ TRANSACTION HELPERS ============
export async function getTransactions(userId: string) {
  try {
    return await db.query.transactions.findMany({ where: eq(schema.transactions.userId, userId) });
  } catch (error) {
    return databaseFailure('getTransactions', error);
  }
}

export async function createTransaction(data: any) {
  try {
    await db.insert(schema.transactions).values(data);
    return data;
  } catch (error) {
    return databaseFailure('createTransaction', error);
  }
}

// ============ WALLET HELPERS ============
export async function getWallet(userId: string) {
  try {
    return await db.query.wallets.findFirst({ where: eq(schema.wallets.userId, userId) });
  } catch (error) {
    return databaseFailure('getWallet', error);
  }
}

export async function createWallet(data: any) {
  try {
    await db.insert(schema.wallets).values(data);
    return data;
  } catch (error) {
    return databaseFailure('createWallet', error);
  }
}

// ============ GENERIC HELPERS ============
type QueryTableName = keyof typeof db.query;
type QueryBuilder = { findMany: () => Promise<unknown[]> };

export async function getAllRecords(table: QueryTableName) {
  try {
    const query = db.query[table] as QueryBuilder;
    return await query.findMany();
  } catch (error) {
    return databaseFailure(`getAllRecords:${String(table)}`, error);
  }
}

export async function deleteRecord(table: any, id: string) {
  try {
    await db.delete(table).where(eq(table.id, id));
    return { success: true } as const;
  } catch (error) {
    return databaseFailure('deleteRecord', error);
  }
}
