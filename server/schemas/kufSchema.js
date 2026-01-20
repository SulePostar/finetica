const { Type } = require("@google/genai");

const purchaseInvoiceSchema = {
    type: Type.OBJECT,
    properties: {
        isPurchaseInvoice: { type: Type.BOOLEAN },
        vatPeriod: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceType: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        billNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        note: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        supplierId: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        invoiceDate: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        dueDate: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        receivedDate: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        netTotal: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        lumpSum: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        vatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        deductibleVat: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        nonDeductibleVat: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        vatExemptRegion: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        filename: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        currency: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    netSubtotal: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    vatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    grossSubtotal: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                },
                required: [
                    'description',
                    'netSubtotal',
                    'vatAmount',
                    'grossSubtotal'
                ]
            }
        }
    },
    required: [
        'isPurchaseInvoice',
        'invoiceNumber',
        'invoiceType',
        'vatPeriod',
        'invoiceDate',
        'netTotal',
        'vatAmount',
        'items',
        'filename',
        'currency'
    ]
};

module.exports = purchaseInvoiceSchema;
