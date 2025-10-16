import { db } from "@/infra/db";
import { schema } from "@/infra/db/schemas";
import { Either, makeRight } from "@/infra/shared/either";
import { count, desc } from "drizzle-orm";

type GetLinksOutput = {
  links: {
    id: string;
    originalUrl: string;
    slug: string;
    shortUrl: string;
    accessCount: number;
    createdAt: Date;
  }[];
  total: number;
}

export async function getLinks(): Promise<Either<never, GetLinksOutput>> {
  const [links, [{ total }]] = await Promise.all([
    db.select({
      id: schema.links.id,
      originalUrl: schema.links.originalUrl,
      slug: schema.links.slug,
      shortUrl: schema.links.shortUrl,
      accessCount: schema.links.accessCount,
      createdAt: schema.links.createdAt,
    })
      .from(schema.links)
      .orderBy(fields =>
        desc(fields.createdAt)
      ),

    db
      .select({ total: count(schema.links.id) })
      .from(schema.links)
  ]);

  return makeRight({ links, total })
}