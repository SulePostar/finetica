import { n2, r2 } from "./numberFormats";

export const getKifQuantity = (row) => {
    const q = n2(row.quantity);
    return q ?? null;
};

export const getKifNet = (row) => {
    const net = n2(row.netSubtotal);
    if (net != null) return r2(net);

    const p = n2(row.unitPrice);
    if (p == null) return null;

    const q = n2(row.quantity) ?? 1;
    return r2(q * p);
};

export const getKifGross = (row) => {
    const gross = n2(row.grossSubtotal);
    if (gross != null) return r2(gross);

    const net = n2(row.netSubtotal);
    if (net != null) return r2(net);

    const p = n2(row.unitPrice);
    if (p == null) return null;

    const q = n2(row.quantity) ?? 1;
    return r2(q * p);
};

