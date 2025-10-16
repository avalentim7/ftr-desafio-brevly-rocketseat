import { db } from "@/infra/db";
import { Either, makeLeft, makeRight } from "@/infra/shared/either";
import z from "zod";
import { links } from "@/infra/db/schemas/links";
import { IdNotFound } from "./errors/id-not-found";
import { eq } from "drizzle-orm";

const removeLinkInput = z.object({
  id: z.string().uuid(),
})

type RemoveLinkInput = z.infer<typeof removeLinkInput>;
type RemoveLinkOutput = z.infer<typeof links.$inferSelect>;

export async function removeLink(input: RemoveLinkInput): Promise<Either<IdNotFound, RemoveLinkOutput>> {
  const { id } = removeLinkInput.parse(input);

  const existing = await db.query.links.findFirst({
    where: (link, { eq }) => eq(link.id, id)
  });

  if (!existing) {
    return makeLeft(new IdNotFound());
  }

  const [deleted] = await db
    .delete(links)
    .where(eq(links.id, id))
    .returning();

  return makeRight(deleted);
}