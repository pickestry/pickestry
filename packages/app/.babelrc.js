// Part of Pickestry. See LICENSE file for full copyright and licensing details.

module.exports = function (api) {

  const isProduction = process.env.NODE_ENV === 'production'

  const isDevelopment  = !isProduction

  api.cache(isDevelopment)

  const presets = []
  presets.push(['@babel/preset-env', { debug: false }])
  presets.push(['@babel/preset-react', { runtime: 'automatic' }])

  const plugins = []
  if(isDevelopment) {
    plugins.push(['babel-plugin-styled-components', {
      minify: false,
      transpileTemplateLiterals: false
    }])
  }

  return {
    presets,
    plugins
  }
}
