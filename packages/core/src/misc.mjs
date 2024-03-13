// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import path from 'node:path'

/**
 * __dirname for esm
 */
export const dirname = (importMetaUrl) => {
  const url = new URL(importMetaUrl)
  return path.dirname(url.pathname)
}

export const randomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
