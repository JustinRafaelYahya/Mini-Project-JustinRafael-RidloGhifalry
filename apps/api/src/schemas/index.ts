import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  username: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role),
});
