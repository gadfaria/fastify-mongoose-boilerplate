import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3333),
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
});

type Env = z.infer<typeof envSchema>;

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('[Env] Invalid environment variables', parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env: Env = parsedEnv.data;
