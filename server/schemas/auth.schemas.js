import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email.',
    'any.required': 'Email is required.',
  }),
  password: Joi.string().min(8).required().messages({
    'any.required': 'Password is required.',
  }),
});
