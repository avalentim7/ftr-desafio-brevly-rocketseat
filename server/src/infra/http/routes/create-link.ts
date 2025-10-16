import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { isRight, unwrapEither } from '@/infra/shared/either';
import { createLink } from '@/app/functions/create-link';

export const createLinkRoute: FastifyPluginAsyncZod = async server => {
  server.post('/links', {
    schema: {
      summary: 'Create a short link',
      description: 'Create a short link from a given URL',
      tags: ['Links'],
      body: z.object({
        originalUrl: z.string().url({ message: 'Invalid URL format' }),
        slug: z.string().regex(/^[a-zA-Z0-9_-]{2,20}$/, { message: 'Invalid slug format' }),
        shortUrl: z.string().url({ message: 'Invalid URL format' })
      }),
      response: {
        201: z.object({
          id: z.string().uuid(),
          originalUrl: z.string().url(),
          slug: z.string(),
          shortUrl: z.string().url(),
          accessCount: z.number(),
          createdAt: z.string().datetime(),
        }),
        400: z.object({ message: z.string() }).describe('Invalid data'),
        409: z.object({ message: z.string() }).describe('Conflict - Slug already exists'),
      }
    }
  }, async (request, reply) => {
    const { originalUrl, slug, shortUrl } = request.body;

    const result = await createLink({ originalUrl, slug, shortUrl });

    if (isRight(result)) {
      const link = result.right;

      return reply.status(201).send({
        id: link.id,
        originalUrl: link.originalUrl,
        slug: link.slug,
        shortUrl: link.shortUrl,
        accessCount: link.accessCount,
        createdAt: link.createdAt.toISOString(),
      });
    }

    const error = unwrapEither(result);

    switch (error.constructor.name) {
      case 'SlugAlreadyExists':
        return reply.status(409).send({ message: error.message });
      default:
        return reply.status(400).send({ message: 'An unexpected error occurred.' });
    }
  });
}