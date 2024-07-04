import { z } from 'zod';
import { Role } from '@prisma/client';

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(50, 'Username cannot exceed 50 characters'),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z.nativeEnum(Role),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
