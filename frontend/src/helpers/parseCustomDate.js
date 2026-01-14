import { validateStrictDate } from "./validateStrictDate";

export const parseCustomDate = (dateStr) => {
    const cleanStr = String(dateStr).trim().replace(/\.$/, '');
    if (/^\d{1,2}\.\d{1,2}\.\d{4}$/.test(cleanStr)) {
        const [dayStr, monthStr, yearStr] = cleanStr.split('.');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);
        return validateStrictDate(year, month, day);
    }

    const dbFormatMatch = cleanStr.match(/^([a-zA-Z]+)\s(\d{1,2}),\s(\d{4})$/);

    if (dbFormatMatch) {
        const [, monthName, dayStr, yearStr] = dbFormatMatch;

        const monthIndex = new Date(`${monthName} 1, 2000`).getMonth();
        const month = monthIndex + 1;

        const day = parseInt(dayStr, 10);
        const year = parseInt(yearStr, 10);

        return validateStrictDate(year, month, day);
    }
    return new Date(cleanStr);
};
