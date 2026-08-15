import { describe, expect, it, vi } from "vitest";

vi.mock("./db", () => ({
  db: {
    query: {
      products: {
        findMany: vi.fn(),
        findFirst: vi.fn(),
      },
    },
  },
}));

import { db } from "./db";
import { marketplaceRouter } from "./marketplaceRouter";
import type { Product } from "../drizzle/schema";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: undefined,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const product: Product = {
  id: "product-1",
  name: "Recorded product",
  description: "Persisted catalog item",
  price: 12.5,
  category: "Tools",
  image: null,
  stock: 4,
  sellerId: "seller-1",
  createdAt: new Date("2026-08-15T00:00:00.000Z"),
};

describe("marketplace catalog", () => {
  it("maps persisted products to public catalog fields", async () => {
    vi.mocked(db.query.products.findMany).mockResolvedValueOnce([product]);

    const caller = marketplaceRouter.createCaller(createContext());
    const result = await caller.catalog({ category: "Tools", limit: 5, offset: 0 });

    expect(result).toEqual([
      {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        image: product.image,
        stock: product.stock,
        createdAt: product.createdAt,
      },
    ]);
    expect(db.query.products.findMany).toHaveBeenCalledOnce();
  });

  it("returns null for an unknown product identifier", async () => {
    vi.mocked(db.query.products.findFirst).mockResolvedValueOnce(undefined);

    const caller = marketplaceRouter.createCaller(createContext());
    await expect(caller.productById({ id: "missing-product" })).resolves.toBeNull();
  });
});
