import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { unwrapEither } from '@/infra/shared/either';
import { exportLinksToCsv } from '@/app/functions/export-links-to-csv';

export const exportLinksRoute: FastifyPluginAsyncZod = async server => {
  server.post(
    "/links/export",
    {
      schema: {
        summary: "Export all links to CSV",
        description: "Export all links to a CSV file and upload to Cloudflare R2",
        tags: ["Links"],
        response: {
          201: z.object({
            fileKey: z.string(),
            publicUrl: z.string().url(),
            rowCount: z.number(),
          }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const result = await exportLinksToCsv();
        const { fileKey, publicUrl, rowCount } = unwrapEither(result);

        return reply.status(201).send({
          fileKey,
          publicUrl,
          rowCount,
        });
      } catch (error) {
        return reply.status(500).send({
          message: 'Failed to export links to CSV'
        });
      }
    }
  );
}
