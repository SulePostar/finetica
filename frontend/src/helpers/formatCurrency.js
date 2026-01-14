export const formatCurrency = (val, currency = 'BAM', locale = 'bs-BA') => {
    if (val === null || val === undefined || val === '') {
        return '—';
    }
    const number = parseFloat(val);
    if (isNaN(number)) return val;

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(number);
};