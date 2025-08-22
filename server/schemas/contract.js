const { Type } = require("@google/genai");


const contractSchema = {
    type: Type.OBJECT,
    properties: {
        partnerName: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        contractNumber: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        contractType: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        description: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        startDate: { anyOf: [{ type: Type.DATE }, { type: Type.NULL }] },
        endDate: { anyOf: [{ type: Type.DATE }, { type: Type.NULL }] },
        paymentTerms: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        currency: { anyOf: [{ type: Type.STRING }, { type: Type.NULL }] },
        amount: { anyOf: [{ type: Type.NUMBER }, { type: Type.NULL }] },
        signedAt: { anyOf: [{ type: Type.DATE }, { type: Type.NULL }] }

    },
    required: [
        'partnerName',
        'contractNumber',
        'contractType',
        'description',
        'startDate',
        'endDate',
        'paymentTerms',
        'currency',
        'amount',
        'signedAt'
    ]
};

module.exports = contractSchema;