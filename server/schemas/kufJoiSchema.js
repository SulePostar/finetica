const Joi = require('joi');

const kufInvoiceItemSchema = Joi.object({
    id: Joi.number().integer().positive().optional().messages({
        'number.base': 'Item ID must be a number',
        'number.integer': 'Item ID must be an integer',
        'number.positive': 'Item ID must be positive',
    }),

    description: Joi.string().trim().min(1).max(500).required().messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 1 character long',
        'string.max': 'Description cannot exceed 500 characters',
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

const kufInvoiceCreateSchema = Joi.object({
    vatPeriod: Joi.string().trim().allow(null, '').optional(),

    invoiceType: Joi.string().trim().max(50).allow(null, '').optional(),

    invoiceNumber: Joi.string().trim().max(50).allow(null, '').optional(),

    billNumber: Joi.string().trim().max(50).allow(null, '').optional(),

    note: Joi.string().trim().max(1000).allow(null, '').optional(),

    supplierId: Joi.number().integer().positive().allow(null).optional(),

    invoiceDate: Joi.date().iso().allow(null).optional(),

    dueDate: Joi.date().iso().allow(null).optional(),

    receivedDate: Joi.date().iso().allow(null).optional(),

    netTotal: Joi.number().positive().precision(2).required(),

    lumpSum: Joi.number().min(0).precision(2).allow(null).optional(),

    vatAmount: Joi.number().min(0).precision(2).required(),

    deductibleVat: Joi.number().min(0).precision(2).allow(null).optional(),

    nonDeductibleVat: Joi.number().min(0).precision(2).allow(null).optional(),

    vatExemptRegion: Joi.string().trim().allow(null, '').optional(),

    items: Joi.array().items(kufInvoiceItemSchema).min(1).required(),
});

const kufInvoiceUpdateSchema = kufInvoiceCreateSchema.fork(
    [
        'netTotal',
        'vatAmount',
        'items'
    ],
    (schema) => schema.optional()
).min(1);

const kufQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(1).max(100).default(10),
    sortField: Joi.string().valid('createdAt', 'netTotal', 'invoiceDate', 'dueDate').optional(),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
});

const kufIdSchema = Joi.object({
    id: Joi.number().integer().positive().required(),
});

module.exports = {
    kufInvoiceItemSchema,
    kufInvoiceCreateSchema,
    kufInvoiceUpdateSchema,
    kufQuerySchema,
    kufIdSchema,
};
