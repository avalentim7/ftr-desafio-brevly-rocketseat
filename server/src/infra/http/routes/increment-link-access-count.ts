import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { isRight, unwrapEither } from '@/infra/shared/either';
import { createLink } from '@/app/functions/create-link';
import { incrementLinkAccessCount } from '@/app/functions/increment-link-access-count';

export const incrementLinkAccessCountRoute: FastifyPluginAsyncZod = async server => {
  server.patch('/links/:id/increment-access-count', {
    schema: {
      summary: 'Increment access count to a link',
      description: 'Increment the access count of a link by its ID',
      tags: ['Links'],
      params: z.object({
        id: z.string().uuid(),
      }),
      response: {
        204: z.null().describe('No Content - Access count incremented successfully'),
        400: z.object({ message: z.string() }).describe('Invalid data'),
        404: z.object({ message: z.string() }).describe('Not Found'),
      }
    }
  }, async (request, reply) => {
    const { id } = request.params;

    const result = await incrementLinkAccessCount({ id });

    if (isRight(result)) {
      return reply.status(204).send();
    }

    const error = unwrapEither(result);

    switch (error.constructor.name) {
      case 'IdNotFound':
        return reply.status(404).send({ message: error.message });
      default:
        return reply.status(400).send({ message: 'An unexpected error occurred.' });
    }
  });
}