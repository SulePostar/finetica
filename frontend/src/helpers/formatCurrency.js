export const formatCurrency = (val) => {
    const number = parseFloat(val);
    if (isNaN(number)) return val;

    return new Intl.NumberFormat('bs-BA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};