/**
 * Formats an ISO date-time string (from database) into a readable format.
 *
 * @param {string} isoString - The ISO date string to format (e.g. "2025-07-28T21:56:31.138Z").
 * @param {string} [locale='en-GB'] - Optional locale string for formatting (defaults to 'en-GB').
 * @returns {string} A human-readable formatted date string (e.g. "28 Jul 2025, 22:56").
 *
 * @example
 * formatDateTime("2025-07-28T21:56:31.138Z") // "28 Jul 2025, 22:56"
 * formatDateTime("2025-07-28T21:56:31.138Z", "en-US") // "07/28/2025, 10:56 PM"
 */
export const formatDateTime = (isoString, locale = 'en-GB') => {
  if (!isoString) return '';
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(isoString));
};
