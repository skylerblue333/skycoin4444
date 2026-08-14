import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "./db";
import * as schema from "../drizzle/schema";
import { publicProcedure, router } from "./_core/trpc";

const catalogInput = z.object({
  category: z.string().trim().min(1).max(255).optional(),
  limit: z.number().int().min(1).max(50).default(24),
  offset: z.number().int().min(0).default(0),
});

function toCatalogItem(product: typeof schema.products.$inferSelect) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    stock: product.stock,
    createdAt: product.createdAt,
  };
}

export const marketplaceRouter = router({
  catalog: publicProcedure.input(catalogInput).query(async ({ input }) => {
    try {
      const products = await db.query.products.findMany({
        where: input.category
          ? eq(schema.products.category, input.category)
          : undefined,
        limit: input.limit,
        offset: input.offset,
      });

      return products.map(toCatalogItem);
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to load the marketplace catalog.",
        cause: error,
      });
    }
  }),

  productById: publicProcedure
    .input(z.object({ id: z.string().trim().min(1).max(255) }))
    .query(async ({ input }) => {
      try {
        const product = await db.query.products.findFirst({
          where: eq(schema.products.id, input.id),
        });

        return product ? toCatalogItem(product) : null;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unable to load the requested product.",
          cause: error,
        });
      }
    }),
});
