import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { getLinks } from '@/app/functions/get-links';
import { isLeft, unwrapEither } from '@/infra/shared/either';
import { removeLink } from '@/app/functions/remove-link';

export const removeLinkRoute: FastifyPluginAsyncZod = async server => {
  server.delete(
    "/links/:id",
    {
      schema: {
        summary: "Delete link by id",
        tags: ["Links"],
        params: z.object({
          id: z.string().uuid(),
        }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const result = await removeLink({ id });

      if (isLeft(result)) {
        const { message } = unwrapEither(result);
        return reply.status(404).send({ message });
      }

      return reply.status(204).send();
    }
  );
}