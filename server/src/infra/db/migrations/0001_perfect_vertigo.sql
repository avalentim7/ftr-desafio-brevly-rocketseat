-- Add short_url column as nullable first
ALTER TABLE "links" ADD COLUMN "short_url" text;

-- Update existing records to populate short_url based on slug
-- This assumes your frontend URL is the slug itself, update if needed
UPDATE "links" SET "short_url" = slug WHERE "short_url" IS NULL;

-- Now make the column NOT NULL
ALTER TABLE "links" ALTER COLUMN "short_url" SET NOT NULL;