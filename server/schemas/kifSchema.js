import { Type } from "@google/genai";

export const salesInvoiceSchema = {
    type: Type.OBJECT,
    properties: {
        id: { type: Type.NUMBER },
        vatPeriod: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceType: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        invoiceNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        billNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        note: { anyOf: [{ type: Type.TEXT }, { type: Type.NULL }] },
        customerId: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        invoiceDate: { anyOf: [{ type: Type.DATE }, { type: Type.NULL }] },
        dueDate: { anyOf: [{ type: Type.DATE }, { type: Type.NULL }] },
        deliveryPeriod: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        totalAmount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        vatCategory: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        createdAt: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        updatedAt: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        approvedAt: { anyOf: [{ type: Type.DATE }, { type: Type.NULL }] },
        approvedBy: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] }, // should stay NUMBER because they document integer IDs
    },
    required: [
        "id",
        "invoiceNumber",
        "invoiceDate",
        "dueDate",
        "totalAmount",
        "customerId"
    ],
    propertyOrdering: [
        "id",
        "vatPeriod",
        "invoiceType",
        "invoiceNumber",
        "billNumber",
        "note",
        "customerId",
        "invoiceDate",
        "dueDate",
        "deliveryPeriod",
        "totalAmount",
        "vatCategory",
        "createdAt",
        "updatedAt",
        "approvedAt",
        "approvedBy"
    ],
};
