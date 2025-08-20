const Joi = require('joi');

const kifInvoiceItemSchema = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        'number.base': 'Item ID must be a number',
        'number.integer': 'Item ID must be an integer',
        'number.positive': 'Item ID must be positive',
    }),

    orderNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Order number must be a string',
    }),

    description: Joi.string().trim().min(1).max(500).required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 1 character long',
        'string.max': 'Description cannot exceed 500 characters',
        'any.required': 'Description is required',
    }),

    unit: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Unit must be a string',
    }),

    quantity: Joi.number().positive().precision(3).required().messages({
        'number.base': 'Quantity must be a number',
        'number.positive': 'Quantity must be positive',
        'any.required': 'Quantity is required',
    }),

    unitPrice: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Unit price must be a number',
        'number.positive': 'Unit price must be positive',
        'any.required': 'Unit price is required',
    }),

    netSubtotal: Joi.number().min(0).precision(2).required().messages({
        'number.base': 'Net subtotal must be a number',
        'number.min': 'Net subtotal cannot be negative',
        'any.required': 'Net subtotal is required',
    }),

    vatAmount: Joi.number().min(0).precision(2).required().messages({
        'number.base': 'VAT amount must be a number',
        'number.min': 'VAT amount cannot be negative',
        'any.required': 'VAT amount is required',
    }),

    grossSubtotal: Joi.number().min(0).precision(2).required().messages({
        'number.base': 'Gross subtotal must be a number',
        'number.min': 'Gross subtotal cannot be negative',
        'any.required': 'Gross subtotal is required',
    }),
});

const kifInvoiceCreateSchema = Joi.object({
    invoiceNumber: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'Invoice number must be a string',
        'string.max': 'Invoice number cannot exceed 50 characters',
    }),

    invoiceType: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'Invoice type must be a string',
        'string.max': 'Invoice type cannot exceed 50 characters',
    }),

    billNumber: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'Bill number must be a string',
        'string.max': 'Bill number cannot exceed 50 characters',
    }),

    vatPeriod: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'VAT period must be a string',
    }),

    invoiceDate: Joi.date().iso().allow(null).optional().messages({
        'date.base': 'Invoice date must be a valid date',
        'date.format': 'Invoice date must be in ISO format',
    }),

    dueDate: Joi.date().iso().allow(null).optional().messages({
        'date.base': 'Due date must be a valid date',
        'date.format': 'Due date must be in ISO format',
    }),

    deliveryPeriod: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Delivery period must be a string',
    }),

    totalAmount: Joi.number().positive().precision(2).required().messages({
        'number.base': 'Total amount must be a number',
        'number.positive': 'Total amount must be positive',
        'any.required': 'Total amount is required',
    }),

    currency: Joi.string().trim().length(3).allow(null, '').optional().messages({
        'string.base': 'Currency must be a string',
        'string.length': 'Currency must be exactly 3 characters (e.g., USD, EUR)',
    }),

    vatCategory: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'VAT category must be a string',
    }),

    sellerName: Joi.string().trim().min(2).allow(null, '').optional().messages({
        'string.base': 'Seller name must be a string',
        'string.min': 'Seller name must be at least 2 characters long',
    }),

    sellerVatNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Seller VAT number must be a string',
    }),

    buyerName: Joi.string().trim().min(2).allow(null, '').optional().messages({
        'string.base': 'Buyer name must be a string',
        'string.min': 'Buyer name must be at least 2 characters long',
    }),

    buyerVatNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Buyer VAT number must be a string',
    }),

    note: Joi.string().trim().max(1000).allow(null, '').optional().messages({
        'string.base': 'Note must be a string',
        'string.max': 'Note cannot exceed 1000 characters',
    }),

    items: Joi.array().items(kifInvoiceItemSchema).min(1).required().messages({
        'array.base': 'Items must be an array',
        'array.min': 'At least one item is required',
        'any.required': 'Items are required',
    }),
});

const kifInvoiceUpdateSchema = Joi.object({
    invoiceNumber: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'Invoice number must be a string',
        'string.max': 'Invoice number cannot exceed 50 characters',
    }),

    invoiceType: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'Invoice type must be a string',
        'string.max': 'Invoice type cannot exceed 50 characters',
    }),

    billNumber: Joi.string().trim().max(50).allow(null, '').optional().messages({
        'string.base': 'Bill number must be a string',
        'string.max': 'Bill number cannot exceed 50 characters',
    }),

    vatPeriod: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'VAT period must be a string',
    }),

    invoiceDate: Joi.date().iso().allow(null).optional().messages({
        'date.base': 'Invoice date must be a valid date',
        'date.format': 'Invoice date must be in ISO format',
    }),

    dueDate: Joi.date().iso().allow(null).optional().messages({
        'date.base': 'Due date must be a valid date',
        'date.format': 'Due date must be in ISO format',
    }),

    deliveryPeriod: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Delivery period must be a string',
    }),

    totalAmount: Joi.number().positive().precision(2).optional().messages({
        'number.base': 'Total amount must be a number',
        'number.positive': 'Total amount must be positive',
    }),

    currency: Joi.string().trim().length(3).allow(null, '').optional().messages({
        'string.base': 'Currency must be a string',
        'string.length': 'Currency must be exactly 3 characters (e.g., USD, EUR)',
    }),

    vatCategory: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'VAT category must be a string',
    }),

    sellerName: Joi.string().trim().min(2).allow(null, '').optional().messages({
        'string.base': 'Seller name must be a string',
        'string.min': 'Seller name must be at least 2 characters long',
    }),

    sellerVatNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Seller VAT number must be a string',
    }),

    buyerName: Joi.string().trim().min(2).allow(null, '').optional().messages({
        'string.base': 'Buyer name must be a string',
        'string.min': 'Buyer name must be at least 2 characters long',
    }),

    buyerVatNumber: Joi.string().trim().allow(null, '').optional().messages({
        'string.base': 'Buyer VAT number must be a string',
    }),

    note: Joi.string().trim().max(1000).allow(null, '').optional().messages({
        'string.base': 'Note must be a string',
        'string.max': 'Note cannot exceed 1000 characters',
    }),

    items: Joi.array().items(kifInvoiceItemSchema).min(1).optional().messages({
        'array.base': 'Items must be an array',
        'array.min': 'At least one item is required',
    }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});

const kifQuerySchema = Joi.object({
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

    sortField: Joi.string().valid('createdAt', 'totalAmount', 'invoiceDate', 'dueDate').optional().messages({
        'string.base': 'Sort field must be a string',
        'any.only': 'Sort field must be one of: createdAt, totalAmount, invoiceDate, dueDate',
    }),

    sortOrder: Joi.string().valid('asc', 'desc').default('desc').messages({
        'string.base': 'Sort order must be a string',
        'any.only': 'Sort order must be either "asc" or "desc"',
    }),
});

const kifIdSchema = Joi.object({
    id: Joi.number().integer().positive().required().messages({
        'number.base': 'ID must be a number',
        'number.integer': 'ID must be an integer',
        'number.positive': 'ID must be positive',
        'any.required': 'ID is required',
    }),
});

const kifProcessSchema = Joi.object({
    model: Joi.string().valid('gemini-2.5-flash-lite', 'gemini-pro').default('gemini-2.5-flash-lite').optional().messages({
        'string.base': 'Model must be a string',
        'any.only': 'Model must be either "gemini-2.5-flash-lite" or "gemini-pro"',
    }),
});

module.exports = {
    kifInvoiceItemSchema,
    kifInvoiceCreateSchema,
    kifInvoiceUpdateSchema,
    kifQuerySchema,
    kifIdSchema,
    kifProcessSchema,
};
