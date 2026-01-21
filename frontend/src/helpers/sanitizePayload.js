export const sanitizePayload = (doc) => {
    const out = {};

    const ALLOWED_KEYS = [
        "date",
        "amount",
        "direction",
        "accountNumber",
        "description",
        "invoiceId",
        "partnerId",
        "categoryId",
    ];

    for (const key of ALLOWED_KEYS) {
        let value = doc[key];

        if (value === null || value === undefined || value === "") continue;

        if (typeof value === "object" && value?.id != null) {
            value = value.id;
        }

        if (key === "amount") {
            value = Number(value);
        }

        if (key === "invoiceId") {
            value = String(value);
        }

        out[key] = value;
    }

    return out;
};