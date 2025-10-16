import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getLinks } from '@/app/functions/get-links';
import { unwrapEither } from '@/infra/shared/either';

export const getLinksRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/links",
    {
      schema: {
        summary: "List all links",
        tags: ["Links"],
        response: {
          200: z.object({
            links: z.array(
              z.object({
                id: z.string().uuid(),
                originalUrl: z.string().url(),
                slug: z.string(),
                shortUrl: z.string().url(),
                accessCount: z.number(),
                createdAt: z.date(),
              })
            ),
            total: z.number()
          }),
        },
      },
    },
    async (request, reply) => {
      const result = await getLinks();
      const { links, total } = unwrapEither(result);

      return reply.status(200).send({ links, total })
    }
  );
}