/**
 * Locale-aware comparison function for strings.
 * Handles special Bosnian/Croatian/Serbian letters (Č, Ć, Đ, Š, Ž) 
 * and ignores case.
 *
 * @param {string} a - First string to compare
 * @param {string} b - Second string to compare
 * @returns {number} - Negative if a < b, positive if a > b, zero if equal
 */
export const sortDataTableColumn = (a = '', b = '') => {
  return a.localeCompare(b, 'bs-BA', { sensitivity: 'base' });
};