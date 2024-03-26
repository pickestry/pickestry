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
      }, {
        from: '../components/.dist/index.js',
        to: path.resolve('.webpack', 'renderer', 'pickestry.js')
      }, {
        from: '../../node_modules/react/umd/react.production.min.js',
        to: path.resolve('.webpack', 'renderer', 'react.production.min.js')
      }, {
        from: '../../node_modules/react-dom/umd/react-dom.production.min.js',
        to: path.resolve('.webpack', 'renderer', 'react-dom.production.min.js')
      }, {
        from: './vendors/react-is.production.min.js',
        to: path.resolve('.webpack', 'renderer', 'react-is.js')
      }, {
        from: './vendors/styled-components.min.js',
        to: path.resolve('.webpack', 'renderer', 'styled.js')
      }]
    }),
    new webpack.DefinePlugin({
      LOG_DISABLED: JSON.stringify(process.env.LOG_DISABLED || false),
      __PROD__: JSON.stringify(isProduction),
      __DEV__:  JSON.stringify(!isProduction)
    }),
  ],
  externalsType: 'window',
  externals: {
    electron: 'electron',
    '@pickestry/components': 'Pickestry',
    'react': 'React',
    'react-dom': 'ReactDOM',
    'styled-components': 'styled'
  },
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
