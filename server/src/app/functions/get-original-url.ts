import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { links } from "@/infra/db/schemas/links";
import { Either, makeRight } from "@/infra/shared/either";
import { count, desc, eq } from "drizzle-orm";
import z from "zod";

const getOriginalUrlInput = z.object({
  slug: z.string(),
})

type GetOriginalUrlInput = z.infer<typeof getOriginalUrlInput>;

type GetOriginalUrlOutput = {
  originalUrl: string;
}

export async function getOriginalUrl(input: GetOriginalUrlInput): Promise<Either<never, GetOriginalUrlOutput>> {
  const { slug } = getOriginalUrlInput.parse(input);

  const [link] = await db
    .select({
      originalUrl: links.originalUrl,
    })
    .from(links)
    .where(eq(links.slug, slug))
    .limit(1);

  return makeRight({ originalUrl: link.originalUrl })
}