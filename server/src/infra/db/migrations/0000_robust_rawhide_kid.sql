CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original_url" text NOT NULL,
	"slug" varchar(50) NOT NULL,
	"access_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_slug_unique" UNIQUE("slug")
);
