import { formatDateTime } from "./formatDate";

export const formatTimePeriod = (value) => {
    if (!value) return '—';

    const strValue = String(value).trim();

    const parseCustomDate = (dateStr) => {
        const cleanStr = dateStr.replace(/\.$/, '');

        if (/^\d{2}\.\d{2}\.\d{4}$/.test(cleanStr)) {
            const [day, month, year] = cleanStr.split('.');
            return new Date(`${year}-${month}-${day}`);
        }
        return new Date(cleanStr);
    };

    if (strValue.includes(' - ')) {
        const [startStr, endStr] = strValue.split(' - ').map(v => v.trim());

        const start = parseCustomDate(startStr);
        const end = parseCustomDate(endStr);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
            return `${formatDateTime(start)} - ${formatDateTime(end)}`;
        }
        return strValue;
    }

    const monthYearMatch = strValue.match(/^(\d{2})\.(\d{4})$/);
    if (monthYearMatch) {
        const [_, month, year] = monthYearMatch;
        const date = new Date(`${year}-${month}-01`);
        if (!isNaN(date.getTime())) {
            return new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long' }).format(date);
        }
    }

    const singleDate = parseCustomDate(strValue);
    if (!isNaN(singleDate.getTime())) {
        return formatDateTime(singleDate);
    }

    return strValue;
};