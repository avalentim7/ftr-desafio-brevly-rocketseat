import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  NODE_ENV: z.enum(['development', 'production']).default('production'),
  POSTGRES_USER: z.string().default('root'),
  POSTGRES_PASSWORD: z.string().default('e7t9A5c@4'),
  POSTGRES_DB: z.string().default('brevly_db'),
  POSTGRES_PORT: z.coerce.number().default(5432),
  DATABASE_URL: z.string(),
  
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  CLOUDFLARE_ACCESS_KEY_ID: z.string(),
  CLOUDFLARE_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_BUCKET: z.string(),
  CLOUDFLARE_PUBLIC_URL: z.string().url(),
  
});

export const env = envSchema.parse(process.env);