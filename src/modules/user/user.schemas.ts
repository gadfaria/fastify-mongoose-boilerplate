import { z } from 'zod';

export const createUserBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Email must be valid'),
});

export type CreateUserInput = z.infer<typeof createUserBodySchema>;
