/**
 * Validates that an input string contains at least one non-whitespace character.
 *
 * @param {string} str - The string to validate
 * @returns {boolean} false if the string is empty or whitespace-only, true otherwise
 */
export function isValidInput(str) {
  if (typeof str !== 'string') return false;
  return str.trim().length > 0;
}
