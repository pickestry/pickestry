 /* eslint-disable */

const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'

const rendererConfig = {
  mode: isProduction ? 'production' : 'development',
  target: 'electron29-renderer',
  devtool: isProduction ? undefined : 'cheap-module-source-map', //'eval-source-map',
  entry: {
    index: './src/renderer.jsx',
    settings: './src/settings.jsx',
    system: './src/system.jsx'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { debug: false }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ],
            plugins: [
              ['babel-plugin-styled-components', {
                minify: false,
                transpileTemplateLiterals: false
              }]
            ]
          }
        }
      }, {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' }
        ]
      }, {
        test: /\.svg$/,
        use: [
          { loader: '@svgr/webpack' }
        ]
      }, {
        test: /\.png$/i,
        type: 'asset/resource'
      }, {
        test: /\.txt$/i,
        resourceQuery: /raw/,
        type: 'asset/source'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{
        from: './src/index.html',
        to: path.resolve('.webpack', 'main')
      }, {
        from: './src/loading.html',
        to: path.resolve('.webpack', 'main')
      }, {
        from: './src/settings.html',
        to: path.resolve('.webpack', 'main')
      }, {
        from: './src/system.html',
        to: path.resolve('.webpack', 'main')
      }]
    }),
    new webpack.DefinePlugin({
      LOG_DISABLED: JSON.stringify(process.env.LOG_DISABLED || false),
      __PROD__: JSON.stringify(isProduction),
      __DEV__:  JSON.stringify(!isProduction)
    }),
  ],
  externalsType: 'commonjs',
  externals: { electron: 'electron' },
  resolve: {
    extensions: ['.jsx', '.js', '.css'],
    alias: {
      components: path.resolve('src', 'components'),
      assets: path.resolve('resources'),
      hooks: path.resolve('src', 'hooks')
    }
  },
  output: {
    filename: '[name].js',
    path: path.resolve('.webpack', 'renderer', 'main'),
    clean: false,
    assetModuleFilename: '[name][ext][query]'
  },
  watchOptions: {
    ignored: /node_modules/
  },
  stats: {
    errorDetails: true
  }
}

module.exports.rendererConfig = rendererConfig
