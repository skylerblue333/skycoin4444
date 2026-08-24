import { like, or } from "drizzle-orm";
import { z } from "zod";
import { posts, products, users } from "../../drizzle/schema";
import { db } from "../db";
import { publicProcedure, router } from "../_core/trpc";

const searchInput = z.object({
  query: z.string().trim().min(2).max(100),
  limit: z.number().int().min(1).max(25).default(10),
});

export const searchRouter = router({
  discover: publicProcedure.input(searchInput).query(async ({ input }) => {
    const pattern = `%${input.query}%`;

    const [userResults, postResults, productResults] = await Promise.all([
      db
        .select({
          id: users.id,
          username: users.username,
          name: users.name,
          avatar: users.avatar,
          bio: users.bio,
          verified: users.verified,
        })
        .from(users)
        .where(or(like(users.username, pattern), like(users.name, pattern)))
        .limit(input.limit),
      db
        .select({
          id: posts.id,
          userId: posts.userId,
          content: posts.content,
          media: posts.media,
          likes: posts.likes,
          comments: posts.comments,
          createdAt: posts.createdAt,
        })
        .from(posts)
        .where(like(posts.content, pattern))
        .limit(input.limit),
      db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          category: products.category,
          image: products.image,
          sellerId: products.sellerId,
        })
        .from(products)
        .where(
          or(
            like(products.name, pattern),
            like(products.description, pattern),
            like(products.category, pattern)
          )
        )
        .limit(input.limit),
    ]);

    return {
      query: input.query,
      users: userResults,
      posts: postResults,
      products: productResults,
    };
  }),
});
