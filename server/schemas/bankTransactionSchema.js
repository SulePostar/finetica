const Joi = require('joi');

const createBankTransactionSchema = Joi.object({
    date: Joi.date().default(Date.now).messages({
        'date.base': 'Date must be a valid date'
    }),

    amount: Joi.number().precision(2).required().messages({
        'number.base': 'Amount must be a number',
        'number.precision': 'Amount must have at most 2 decimal places',
        'any.required': 'Amount is required'
    }),

    direction: Joi.string().valid('in', 'out').required().messages({
        'string.base': 'Direction must be a string',
        'any.only': 'Direction must be either "in" or "out"',
        'any.required': 'Direction is required'
    }),

    accountNumber: Joi.string().trim().optional().allow('').messages({
        'string.base': 'Account number must be a string'
    }),

    description: Joi.string().trim().optional().allow('').messages({
        'string.base': 'Description must be a string'
    }),

    invoiceId: Joi.string().trim().optional().allow('').messages({
        'string.base': 'Invoice ID must be a string'
    }),

    partnerId: Joi.number().integer().optional().messages({
        'number.base': 'Partner ID must be a number',
        'number.integer': 'Partner ID must be an integer'
    }),

    categoryId: Joi.number().integer().optional().messages({
        'number.base': 'Category ID must be a number',
        'number.integer': 'Category ID must be an integer'
    }),

    approvedAt: Joi.date().optional().allow(null).messages({
        'date.base': 'Approved at must be a valid date'
    }),

    approvedBy: Joi.number().integer().optional().allow(null).messages({
        'number.base': 'Approved by must be a number',
        'number.integer': 'Approved by must be an integer'
    })
});

module.exports = {
    createBankTransactionSchema,
};
