const Joi = require('joi');

const registerUserSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),

  password: Joi.string().min(6).required().messages({
    'string.base': 'Password must be a string',
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required',
  }),

  firstName: Joi.string().trim().min(2).required().messages({
    'string.base': 'First name must be a string',
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters long',
    'any.required': 'First name is required',
  }),

  lastName: Joi.string().trim().min(2).required().messages({
    'string.base': 'Last name must be a string',
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters long',
    'any.required': 'Last name is required',
  }),
});

module.exports = registerUserSchema;
