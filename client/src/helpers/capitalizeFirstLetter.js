/**
 * Capitalizes the first character of a string.
 *
 * @param {string} str - The input string to be capitalized.
 * @returns {string} The string with the first character in uppercase.
 *
 * @example
 * capitalizeFirst("user") // returns "User"
 * capitalizeFirst("") // returns ""
 */
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
