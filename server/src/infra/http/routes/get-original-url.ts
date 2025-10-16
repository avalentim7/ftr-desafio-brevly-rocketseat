import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getLinks } from '@/app/functions/get-links';
import { unwrapEither } from '@/infra/shared/either';
import { getOriginalUrl } from '@/app/functions/get-original-url';

export const getOriginalUrlRoute: FastifyPluginAsyncZod = async server => {
  server.get(
    "/links/:slug/original-url",
    {
      schema: {
        summary: "Get original URL by slug",
        tags: ["Links"],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          200: z.object({
            originalUrl: z.string().url()
          }),
          404: z.object({
            message: z.string()
          })
        },
      },
    },
    async (request, reply) => {
      const result = await getOriginalUrl({ slug: request.params.slug });
      const { originalUrl } = unwrapEither(result);

      return reply.status(200).send({ originalUrl });
    }
  );
}