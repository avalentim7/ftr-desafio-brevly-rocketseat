import { integer, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { uuidv7 } from 'uuidv7';

export const links = pgTable("links", {
  id: text("id").primaryKey().$defaultFn(() => uuidv7()),
  originalUrl: text("original_url").notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  shortUrl: text("short_url").notNull(),
  accessCount: integer("access_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Link = typeof links.$inferSelect;
export type NewLink = typeof links.$inferInsert;