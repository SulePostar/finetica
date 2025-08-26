const { Type } = require("@google/genai");

const bankTransactionSchema = {
    type: Type.OBJECT,
    properties: {
        date: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        amount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        direction: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        accountNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceId: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        partnerId: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        categoryId: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        approvedAt: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        approvedBy: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] }
    },
    required: [
        'date',
        'amount',
        'direction',
        'accountNumber',
        'description',
        'invoiceId',
        'partnerId',
        'categoryId',
        'approvedAt',
        'approvedBy'
    ]
};

module.exports = bankTransactionSchema;
