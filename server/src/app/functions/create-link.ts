import { db } from "@/infra/db";
import { Either, makeLeft, makeRight } from "@/infra/shared/either";
import z from "zod";
import { SlugAlreadyExists } from "./errors/slug-already-exists";
import { links } from "@/infra/db/schemas/links";

const createLinkInput = z.object({
  originalUrl: z.string().url({ message: 'Invalid URL format' }),
  slug: z.string(),
  shortUrl: z.string().url({ message: 'Invalid URL format' })
})

type CreateLinkInput = z.infer<typeof createLinkInput>;

export async function createLink(input: CreateLinkInput): Promise<Either<SlugAlreadyExists, typeof links.$inferSelect>> {
  const { slug, originalUrl, shortUrl } = createLinkInput.parse(input);

  const existing = await db.query.links.findFirst({
    where: (link, { eq }) => eq(link.slug, slug)
  });

  if (existing) {
    return makeLeft(new SlugAlreadyExists());
  }


  const [created] = await db
    .insert(links)
    .values({
      originalUrl,
      slug,
      shortUrl,
    }).returning();

  return makeRight(created);
}