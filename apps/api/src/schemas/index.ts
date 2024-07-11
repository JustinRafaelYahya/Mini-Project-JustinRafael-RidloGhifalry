import { z } from 'zod';
import { Role, Type } from '@prisma/client';

export const createEventSchema = z.object({
  name: z.string().min(1, { message: 'Event name is required' }),
  tagline: z.string().min(1, { message: 'Event tagline is required' }),
  about: z.string().min(1, { message: 'Event description is required' }),
  event_type: z.nativeEnum(Type),
  thumbnail: z.string().optional(),
  seats: z.number().min(1, { message: 'Event seats is required' }),
  start_event: z.date({ required_error: 'Start event date is required' }),
  end_event: z.date({ required_error: 'End event date is required' }),
  start_time: z.string({ required_error: 'Start time is required' }),
  end_time: z.string({ required_error: 'End time is required' }),
  price: z.number().min(1, { message: 'Event price is required' }),
  location: z.string().min(1, { message: 'Event location is required' }),
  tags: z.array(z.string().min(1, { message: 'Tag is required' })),
});

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
  contact_number: z.string().optional(),
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
