import { formatDateTime } from "./formatDate";
import { formatMonthYear } from "./formatMonthYear";
import { formatStartEndPeriod } from "./formatStartEndPeriod";
import { parseCustomDate } from "./parseCustomDate";

export const formatTimePeriod = (value, locale = 'en-GB') => {
    if (!value) return '—';

    const strValue = String(value).trim();
    if (strValue.includes(' - ')) {
        return formatStartEndPeriod(strValue);
    }

    if (/^(\d{2})\.(\d{4})\.?$/.test(strValue)) {
        return formatMonthYear(strValue, locale);
    }

    const singleDate = parseCustomDate(strValue);
    if (!isNaN(singleDate.getTime())) {
        return formatDateTime(singleDate);
    }
    return (
        <span style={{ color: 'orange' }} title="Invalid Date Format">
            ⚠ {strValue}
        </span>
    );
};