// Part of Pickestry. See LICENSE file for full copyright and licensing details.

 /* eslint-disable */

const webpack = require('webpack')
const path = require('path')
const { isProduction } = require('../../config')
const { rootPath } = require('../../config')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const PDFKIT_DATA = path.resolve(rootPath, 'node_modules/pdfkit/js/data')

const mainConfig = {
  mode: isProduction ? 'production' : 'development',
  target: 'electron29-main',
  devtool: isProduction ? undefined : 'cheap-module-source-map', //'eval-source-map',
  entry: './src/index.mjs',
  module: {
    rules: [
      {
        test: /\.(?:js|mjs|cjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      'createLogger': ['@pickestry/core', 'createLogger']
    }),
    new webpack.DefinePlugin({
      LOG_DISABLED: JSON.stringify(process.env.LOG_DISABLED || false),
      __PROD__: JSON.stringify(isProduction),
      __DEV__:  JSON.stringify(!isProduction)
    }),
    new CopyWebpackPlugin({
      patterns: [{
        from: 'resources/icon.png',
        to: path.resolve('.webpack', 'main')
      }, {
        from: `${PDFKIT_DATA}/*.*`,
        to: `${path.resolve('.webpack', 'main', 'data')}/[name][ext]`
      }]
    })
  ],
  externalsType: 'commonjs',
  externals: {
    electron: 'electron',
    usb: 'usb',
    umzug: 'umzug',
    sqlite3: 'sqlite3',
    sequelize: 'sequelize',
    'electron-devtools-installer': 'electron-devtools-installer'
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
      '.cjs': ['.cjs', '.cts'],
      '.mjs': ['.mjs', '.mts']
    },
    alias: {
      devices: path.resolve('src', 'devices', 'index.mjs')
    }
  },
  output: {
    filename: 'index.js',
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
  mainConfig
}
