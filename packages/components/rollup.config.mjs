import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { babel } from '@rollup/plugin-babel'
import importAssets from 'rollup-plugin-import-assets'
import replace from '@rollup/plugin-replace'
import css from 'rollup-plugin-css-only'
import json from '@rollup/plugin-json'
import svgr from '@svgr/rollup'
import config from '../../config.js'

export default {
  input: 'src/index.mjs',
  output: {
    file: '.dist/index.js',
    format: 'iife',
    name: 'Pickestry',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      'styled-components': 'styled'
    }
  },
  external: [
    'react',
    'react-dom',
    'styled-components'
  ],
  plugins: [
    json(),
    svgr(),
    importAssets({
      include: [/\.gif$/i, /\.png$/i],
      fileNames: 'assets/[name].[ext]'
    }),
    replace({
      __DEV__: JSON.stringify(config.isProduction),
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      plugins: ['annotate-pure-calls'],
    }),
    css()
  ]
}

