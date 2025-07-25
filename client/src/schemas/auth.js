import { z } from 'zod';

const emailSchema = z.email({
  required_error: 'Email is required',
  invalid_type_error: 'Email is required',
  message: 'Please provide a valid email address',
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  first_name: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters long' })
    .transform((val) => val.trim()),
  last_name: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters long' })
    .transform((val) => val.trim()),
});

export const registerWithConfirmSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const passwordResetSchema = z.object({
  email: emailSchema,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: z.string().min(6, { message: 'New password must be at least 6 characters long' }),
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
