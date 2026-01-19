export const formatMonthYear = (strValue, locale = 'en-GB') => {
    const monthYearMatch = strValue.match(/^(\d{2})\.(\d{4})\.?$/);
    if (monthYearMatch) {
        const [, monthStr, year] = monthYearMatch;
        const month = parseInt(monthStr, 10);
        if (month < 1 || month > 12) {
            return <span style={{ color: 'orange' }} title="Invalid Date">⚠{strValue}</span>;
        }
        const date = new Date(`${year}-${month}-01`);
        if (!isNaN(date.getTime())) {
            return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long' }).format(date);
        }
    }
}