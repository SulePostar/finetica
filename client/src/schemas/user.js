import { z } from 'zod';

const emailSchema = z.email({
  required_error: 'Email is required',
  invalid_type_error: 'Email is required',
  message: 'Please provide a valid email address',
});

export const userUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .transform((val) => val.trim()),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .transform((val) => val.trim()),
  email: emailSchema,
});

export const adminUserUpdateSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .transform((val) => val.trim()),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .transform((val) => val.trim()),
  email: emailSchema,
  role_id: z.number().positive('Please select a valid role').optional(),
  is_active: z.boolean().optional(),
});

export const userResponseSchema = z.object({
  id: z.number(),
  email: z.email({ message: 'Invalid email format' }),
  first_name: z.string(),
  last_name: z.string(),
  role_id: z.number().nullable(),
  role: z
    .object({
      id: z.number(),
      name: z.string(),
      description: z.string().nullable(),
    })
    .nullable(),
  is_active: z.boolean(),
  is_email_verified: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const userProfileSchema = z.object({
  first_name: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters long')
    .transform((val) => val.trim()),
  last_name: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters long')
    .transform((val) => val.trim()),
  email: emailSchema,
});
