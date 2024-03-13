// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/* eslint-disable no-console */

const isProduction = process.env.NODE_ENV === 'production'

console.log(`Production: ${isProduction ? 'yes' : 'no'}`)

module.exports = {
    isProduction,
    rootPath: __dirname
}
