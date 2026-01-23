const { Type } = require("@google/genai");

const bankTransactionSchema = {
    type: Type.OBJECT,
    properties: {
        isBankTransaction: { type: Type.BOOLEAN },


        date: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        totalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },          // Glavni iznos
        totalBaseAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },      // Osnovica (bez PDV)
        totalVatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },       // Iznos PDV-a
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
                    date: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    bankName: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    accountNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    totalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    totalBaseAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    totalVatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    convertedTotalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    direction: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    currency: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    invoiceId: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] }
                },
                required: [
                    'totalAmount',
                    'date',
                    'direction',
                    'description'
                ]
            }
        }
    },
    // Obavezna polja koja AI mora vratiti (makar kao null)
    required: [
        'isBankTransaction',
        'date',
        'totalAmount',        // Promijenjeno iz 'amount'
        'totalBaseAmount',    // Novo
        'totalVatAmount',     // Novo
        'convertedTotalAmount', // Novo
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