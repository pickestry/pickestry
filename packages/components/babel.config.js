const config = require('../../config')

module.exports = function (api) {

  api.cache(!config.isProduction)

  return {
    presets: [
      [
        '@babel/env', { loose: true }
      ],
      '@babel/preset-react'
    ]
  }

}
