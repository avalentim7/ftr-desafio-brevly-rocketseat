import { db } from "@/infra/db";
import { Either, makeLeft, makeRight } from "@/infra/shared/either";
import z from "zod";
import { SlugAlreadyExists } from "./errors/slug-already-exists";
import { links } from "@/infra/db/schemas/links";
import { IdNotFound } from "./errors/id-not-found";
import { eq } from "drizzle-orm";

const incrementLinkAccessCountInput = z.object({
  id: z.string().uuid(),
})

type IncrementLinkAccessCountInput = z.infer<typeof incrementLinkAccessCountInput>;

export async function incrementLinkAccessCount(input: IncrementLinkAccessCountInput): Promise<Either<SlugAlreadyExists, typeof links.$inferSelect>> {
  const { id } = incrementLinkAccessCountInput.parse(input);

  const existing = await db.query.links.findFirst({
    where: (link, { eq }) => eq(link.id, id)
  });

  if (!existing) {
    return makeLeft(new IdNotFound());
  }

  const [updated] = await db
    .update(links)
    .set({
      accessCount: existing.accessCount + 1,
    })
    .where(eq(links.id, id))
    .returning();

  return makeRight(updated);
}