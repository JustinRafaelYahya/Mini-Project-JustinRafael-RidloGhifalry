import { z } from 'zod';
import { Role } from '@prisma/client';

const baseSchema = z.object({
  username: z
    .string()
    .min(1, { message: 'Username is required' })
    .max(50, { message: 'Username cannot exceed 50 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z.nativeEnum(Role).default(Role.CUSTOMER),
  contact_number: z
    .string()
    .refine((value) => /\+?([ -]?\d+)+|\(\d+\)([ -]\d+)/g.test(value ?? ''), {
      message: 'Invalid contact number',
    })
    .optional(),
});

export const registerSchema = baseSchema.refine(
  (data) => {
    if (data.role === Role.ORGANIZER) {
      return !!data.contact_number;
    }
    return true;
  },
  {
    message: 'Contact number is required for organizers',
    path: ['contact_number'],
  },
);

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
