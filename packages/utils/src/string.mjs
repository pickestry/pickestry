// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/**
 * Checks if as string is blank
 *
 * @param {string} str
 * @returns {boolean} true if blank (null, undefined or with spaces).
 */
export const isBlank = (v) => (!v || /^\s*$/.test(v))

export const isNotBlank = (str) => !isBlank(str)

