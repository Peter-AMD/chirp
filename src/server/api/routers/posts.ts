import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { filterUserForClient } from "@/server/helpers/filter";
import type { Post } from "@prisma/client";
import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

const addUserDataToPosts = async (posts: Post[]) => {
  const users = (
    await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    })
  ).map(filterUserForClient);

  return posts.map((post) => {
    const author = users.find((user) => user.username === post.username);
    if (!author?.username) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Author for post not found",
      });
    }
    return {
      post: {
        ...post,
        username: author.username,
      },
      author: {
        ...author,
        username: author.username,
      },
    };
  });
};

// Create a new ratelimiter, that allows 3 requests per 1 min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    return addUserDataToPosts(posts);
  }),
  getPostsByUserId: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) =>
      ctx.prisma.post
        .findMany({
          where: {
            username: "peter-amd",
          },
          take: 99,
          orderBy: [{ createdAt: "desc" }],
        })
        .then(addUserDataToPosts)
    ),
  createPost: privateProcedure
    .input(
      z.object({
        content: z.string().emoji().min(1).max(240),
        username: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);
      if (!success) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }

      const post = await ctx.prisma.post.create({
        data: {
          authorId: authorId,
          username: input.username,
          content: input.content,
        },
      });

      return post;
    }),
});
