const Joi = require('joi');

const createContractSchema = Joi.object({
    partnerId: Joi.number().integer().required().messages({
        'number.base': 'Partner ID must be a number',
        'number.integer': 'Partner ID must be an integer',
        'any.required': 'Partner ID is required',
    }),

    contractNumber: Joi.string().trim().max(50).required().messages({
        'string.base': 'Contract number must be a string',
        'string.empty': 'Contract number is required',
        'string.max': 'Contract number cannot exceed 50 characters',
        'any.required': 'Contract number is required',
    }),

    contractType: Joi.string().trim().max(50).required().messages({
        'string.base': 'Contract type must be a string',
        'string.empty': 'Contract type is required',
        'string.max': 'Contract type cannot exceed 50 characters',
        'any.required': 'Contract type is required',
    }),

    description: Joi.string().trim().allow('').optional(),

    startDate: Joi.date().iso().required().messages({
        'date.base': 'Start date must be a valid date',
        'date.format': 'Start date must be in ISO format',
        'any.required': 'Start date is required',
    }),

    endDate: Joi.date().iso().min(Joi.ref('startDate')).required().messages({
        'date.base': 'End date must be a valid date',
        'date.format': 'End date must be in ISO format',
        'date.min': 'End date must be after or equal to the start date',
        'any.required': 'End date is required',
    }),

    isActive: Joi.boolean().default(true),

    paymentTerms: Joi.string().trim().allow('').optional(),

    currency: Joi.string().trim().length(3).required().messages({
        'string.base': 'Currency must be a string',
        'string.empty': 'Currency is required',
        'string.length': 'Currency must be exactly 3 characters (e.g., USD, EUR)',
        'any.required': 'Currency is required',
    }),

    amount: Joi.number().precision(2).positive().required().messages({
        'number.base': 'Amount must be a number',
        'number.positive': 'Amount must be positive',
        'any.required': 'Amount is required',
    }),

    signedAt: Joi.date().iso().max('now').required().messages({
        'date.base': 'Signed date must be a valid date',
        'date.format': 'Signed date must be in ISO format',
        'date.max': 'Signed date cannot be in the future',
        'any.required': 'Signed date is required',
    }),
});

module.exports = {
    createContractSchema,
};
