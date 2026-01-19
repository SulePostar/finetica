const Joi = require('joi');

const BankTransactionItemSchema = Joi.object({
    bankName: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Bank name must be a string',
    }),

    accountNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Account number must be a string',
    }),
    date: Joi.date().iso().required().messages({
        'date.base': 'Date must be a valid date',
        'date.format': 'Date must be in ISO format',
        'any.required': 'Date is required',
    }),
    direction: Joi.string().trim().required().messages({
        'string.base': 'Direction must be a string',
        'any.required': 'Direction is required',
    }),
    amount: Joi.number().required().messages({
        'number.base': 'Amount must be a number',
        'any.required': 'Amount is required',
    }),
    currency: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Currency must be a string',
    }),
    referenceNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Reference number must be a string',
    }),
    description: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Description must be a string',
    }),
});

// Main Schema

// Create Schema 
const bankTransactionCreateSchema = Joi.object({
    date: Joi.date().iso().required().messages({
        'date.base': 'Date must be a valid date',
        'date.format': 'Date must be in ISO format',
        'any.required': 'Date is required',
    }),

    amount: Joi.number().required().messages({
        'number.base': 'Amount must be a number',
        'any.required': 'Amount is required',
    }),

    direction: Joi.string().trim().required().messages({
        'string.base': 'Direction must be a string',
        'any.required': 'Direction is required',
    }),

    accountNumber: Joi.string().trim().required().messages({
        'string.base': 'Account number must be a string',
        'any.required': 'Account number is required',
    }),

    description: Joi.string().trim().required().messages({
        'string.base': 'Description must be a string',
        'any.required': 'Description is required',
    }),

    invoiceId: Joi.string().trim().required().messages({
        'string.base': 'Invoice ID must be a string',
        'any.required': 'Invoice ID is required',
    }),

    partnerId: Joi.number().integer().required().messages({
        'number.base': 'Partner ID must be a number',
        'number.integer': 'Partner ID must be an integer',
        'any.required': 'Partner ID is required',
    }),

    categoryId: Joi.number().integer().required().messages({
        'number.base': 'Category ID must be a number',
        'number.integer': 'Category ID must be an integer',
        'any.required': 'Category ID is required',
    }),

    approvedAt: Joi.date().iso().required().messages({
        'date.base': 'Approved date must be a valid date',
        'date.format': 'Approved date must be in ISO format',
        'any.required': 'Approved date is required',
    }),

    approvedBy: Joi.number().integer().required().messages({
        'number.base': 'Approved by must be a number',
        'number.integer': 'Approved by must be an integer',
        'any.required': 'Approved by is required',
    }),
    items: Joi.array().items(BankTransactionItemSchema).min(1).required().messages({
        'array.base': 'Items must be an array',
        'array.min': 'At least one item is required',
        'any.required': 'Items are required',
    }),

});

// Update Schema
const bankTransactionUpdateSchema = Joi.object({
    date: Joi.date().iso().optional().messages({
        "date.base": "Date must be a valid date",
        "date.format": "Date must be in ISO format",
    }),

    amount: Joi.number().optional().messages({
        "number.base": "Amount must be a number",
    }),

    direction: Joi.string().trim().optional().messages({
        "string.base": "Direction must be a string",
    }),

    accountNumber: Joi.string().trim().optional().messages({
        "string.base": "Account number must be a string",
    }),

    description: Joi.string().trim().optional().messages({
        "string.base": "Description must be a string",
    }),

    invoiceId: Joi.string().trim().optional().messages({
        "string.base": "Invoice ID must be a string",
    }),

    partnerId: Joi.number().integer().optional().messages({
        "number.base": "Partner ID must be a number",
        "number.integer": "Partner ID must be an integer",
    }),

    categoryId: Joi.number().integer().optional().messages({
        "number.base": "Category ID must be a number",
        "number.integer": "Category ID must be an integer",
    }),

    isValid: Joi.boolean().optional().messages({
        "boolean.base": "Is valid must be a boolean",
    }),

    approvedAt: Joi.date().iso().optional().messages({
        "date.base": "Approved date must be a valid date",
        "date.format": "Approved date must be in ISO format",
    }),

    approvedBy: Joi.number().integer().optional().messages({
        "number.base": "Approved by must be a number",
        "number.integer": "Approved by must be an integer",
    }),

    items: Joi.array().items(BankTransactionItemSchema).min(1).optional().messages({
        "array.base": "Items must be an array",
        "array.min": "At least one item is required",
    }),
})
    .min(1)
    .messages({
        "object.min": "At least one field must be provided for update",
    });


// Query Schema
const bankTransactionQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        'number.base': 'Page must be a number',
        'number.integer': 'Page must be an integer',
        'number.min': 'Page must be at least 1',
    }),

    perPage: Joi.number().integer().min(1).max(100).default(10).messages({
        'number.base': 'Per page must be a number',
        'number.integer': 'Per page must be an integer',
        'number.min': 'Per page must be at least 1',
        'number.max': 'Per page cannot exceed 100',
    }),

    sortField: Joi.string().valid('date', 'amount', 'approvedAt').optional().messages({
        'string.base': 'Sort field must be a string',
        'any.only': 'Sort field must be one of: date, amount, approvedAt',
    }),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
        'string.base': 'Sort order must be a string',
        'any.only': 'Sort order must be either "asc" or "desc"',
    }),
});

// ID Schema
const bankTransactionIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required',
    }),
});

module.exports = {
    BankTransactionItemSchema,
    bankTransactionCreateSchema,
    bankTransactionUpdateSchema,
    bankTransactionQuerySchema,
    bankTransactionIdSchema,
};
