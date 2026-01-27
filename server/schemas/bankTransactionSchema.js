const { Type } = require("@google/genai");

const bankTransactionSchema = {
    type: Type.OBJECT,
    properties: {
        isBankTransaction: { type: Type.BOOLEAN },
        date: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        totalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },// Glavni iznos
        totalBaseAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] }, // Osnovica (bez PDV)
        totalVatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },// Iznos PDV-a
        convertedTotalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] }, // Konvertovani iznos
        direction: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] }, // 'in' ili 'out'
        accountNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceId: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] }, // Mapira se na model 'invoiceId'
        currency: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        partnerId: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        categoryId: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        approvedAt: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        approvedBy: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    bankName: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    accountNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    date: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
                    direction: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    amount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    currency: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    referenceNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                },
                required: [
                    'amount',
                    'date',
                    'direction',
                ]
            }
        }
    },
    required: [
        'isBankTransaction',
        'date',
        'totalAmount',
        'totalBaseAmount',
        'totalVatAmount',
        'convertedTotalAmount',
        'direction',
        'accountNumber',
        'description',
        'invoiceId',
        'partnerId',
        'categoryId',
        'approvedAt',
        'approvedBy',
        'currency',
        'items'
    ]
};

module.exports = bankTransactionSchema;
