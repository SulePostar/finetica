export const n2 = (v) =>
    v == null || v === "" ? null : Number(String(v).replace(",", "."));

export const r2 = (v) =>
    v == null || Number.isNaN(v)
        ? null
        : Math.round((v + Number.EPSILON) * 100) / 100;

export const formatMoney = (value) => {
    const num = n2(value);
    if (num == null) return "—";

    const rounded = r2(num);

    return rounded.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
