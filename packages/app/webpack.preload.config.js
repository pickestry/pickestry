 /* eslint-disable */

const webpack = require('webpack')
const path = require('path')

const isProduction = process.env.NODE_ENV === 'production'

const preloadConfig = {
  mode: isProduction ? 'production' : 'development',
  target: 'electron29-preload',
  devtool: isProduction ? undefined : 'cheap-module-source-map', //'eval-source-map',
  entry: './src/preload.mjs',
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      LOG_DISABLED: JSON.stringify(process.env.LOG_DISABLED || false),
      __PROD__: JSON.stringify(isProduction),
      __DEV__:  JSON.stringify(!isProduction)
    }),
  ],
  resolve: {
    extensions: ['.js'],
    extensionAlias: {
      '.js': ['.js'],
      '.cjs': ['.cjs'],
      '.mjs': ['.mjs']
    }
  },
  output: {
    filename: 'preload.js',
    path: path.resolve('.webpack', 'main'),
    clean: false
  },
  watchOptions: {
    ignored: /node_modules/
  },
  stats: {
    errorDetails: true
  }
}

module.exports = {
  preloadConfig
}
