const { Type } = require("@google/genai");

const salesInvoiceSchema = {
    type: Type.OBJECT,
    properties: {
        isInvoice: { type: Type.BOOLEAN },
        invoiceNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceType: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        billNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        vatPeriod: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceDate: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        dueDate: { anyOf: [{ type: Type.DATE }, { type: Type.STRING }, { type: Type.NULL }] },
        deliveryPeriod: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        totalBaseAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        totalVatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        totalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        currency: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        vatCategory: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        sellerName: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        sellerVatNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        buyerName: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        buyerVatNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        note: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        items: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    orderNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    unit: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
                    quantity: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    unitPrice: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    netSubtotal: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    vatAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                    grossSubtotal: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
                },
                required: [
                    'orderNumber',
                    'description',
                    'unit',
                    'quantity',
                    'unitPrice',
                    'netSubtotal',
                    'vatAmount',
                    'grossSubtotal'
                ]
            }
        }
    },
    required: [
        'isInvoice',
        'invoiceNumber',
        'invoiceType',
        'billNumber',
        'vatPeriod',
        'invoiceDate',
        'dueDate',
        'deliveryPeriod',
        'totalBaseAmount',
        'totalVatAmount',
        'totalAmount',
        'currency',
        'vatCategory',
        'sellerName',
        'sellerVatNumber',
        'buyerName',
        'buyerVatNumber',
        'note',
        'items'
    ]
};

module.exports = salesInvoiceSchema;