import { formatDateTime } from "./formatDate";
import { parseCustomDate } from "./parseCustomDate";

export const formatStartEndPeriod = (strValue) => {
    const [startStr, endStr] = strValue.split(' - ').map(v => v.trim());

    const start = parseCustomDate(startStr);
    const end = parseCustomDate(endStr);

    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        if (start > end) {
            return <span style={{ color: 'orange' }} title="Start date is after end date">
                ⚠ {formatDateTime(start)} - {formatDateTime(end)}
            </span>
        }
        return `${formatDateTime(start)} - ${formatDateTime(end)}`;
    }
    return <span style={{ color: 'orange' }} title="Invalid Date">⚠{strValue}</span>;

}