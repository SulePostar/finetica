/**
 * Formats a date into a readable string format.
 * @param {Date|string} date - The date to format
 * @param {string} locale - Locale string (default: 'en-GB')
 * @param {string} timeZone - Timezone (default: 'UTC')
 * @returns {string} Formatted date string
 */
const formatDate = (date, locale = 'en-GB', timeZone = 'UTC') => {
    if (!date) return '';
    return new Date(date).toLocaleString(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: timeZone,
    });
};

module.exports = { formatDate };
