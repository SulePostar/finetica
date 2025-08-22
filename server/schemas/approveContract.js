const Joi = require('joi');

const contractSchema = Joi.object({
    id: Joi.number().integer().positive(),

    partnerId: Joi.number().integer().positive().required()
        .messages({
            'number.base': 'Partner ID must be a number',
            'number.positive': 'Partner ID must be a positive number',
            'any.required': 'Partner ID is required',
        }),

    contractNumber: Joi.string().max(50).required(),

    contractType: Joi.string().max(50).required(),

    description: Joi.string().optional().allow(''),

    startDate: Joi.date().iso().required(),

    endDate: Joi.date().iso().greater(Joi.ref('startDate')).required()
        .messages({
            'date.greater': 'End date must be after the start date',
        }),

    isActive: Joi.boolean().default(true),

    paymentTerms: Joi.string().optional().allow(''),

    currency: Joi.string().length(3).uppercase().required(),

    amount: Joi.number().precision(2).positive().required(),

    signedAt: Joi.date().iso().optional(),

});

module.exports = contractSchema;