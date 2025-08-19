const Joi = require('joi');

const createBusinessPartnerSchema = Joi.object({
    type: Joi.string().valid('customer', 'supplier', 'both').required().messages({
        'string.base': 'Type must be a string',
        'any.only': 'Type must be one of "customer", "supplier", or "both"',
        'any.required': 'Type is required'
    }),

    name: Joi.string().trim().min(2).required().messages({
        'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'any.required': 'Name is required'
    }),

    shortName: Joi.string().trim().optional().allow(''),

    countryCode: Joi.string().trim().max(3).optional().allow('').messages({
        'string.base': 'Country code must be a string',
        'string.max': 'Country code must be at most 3 characters long'
    }),

    vatNumber: Joi.string().trim().optional().allow(''),

    taxId: Joi.string().trim().required().messages({
        'string.base': 'Tax ID must be a string',
        'string.empty': 'Tax ID is required',
        'any.required': 'Tax ID is required'
    }),

    registrationNumber: Joi.string().trim().optional().allow(''),

    isVatRegistered: Joi.boolean().default(false),

    address: Joi.string().trim().optional().allow(''),

    city: Joi.string().trim().optional().allow(''),

    postCode: Joi.string().trim().optional().allow(''),

    country: Joi.string().trim().optional().allow(''),

    phone: Joi.string().trim().optional().allow(''),

    email: Joi.string().trim().email().optional().allow('').messages({
        'string.base': 'Email must be a string',
        'string.email': 'Please provide a valid email address'
    }),

    website: Joi.string().trim().uri().optional().allow('').messages({
        'string.base': 'Website must be a string',
        'string.uri': 'Please provide a valid website URL'
    }),

    notes: Joi.string().trim().optional().allow('')
});

module.exports = {
    createBusinessPartnerSchema,
};
