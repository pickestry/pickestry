#!/usr/bin/env node

// Part of Pickestry. See LICENSE file for full copyright and licensing details.

const webpack = require('webpack')

const { mainConfig } = require('../webpack.main.config')
const { rendererConfig } = require('../webpack.renderer.config')
const { preloadConfig } = require('../webpack.preload.config')

const compiler = webpack([mainConfig, rendererConfig, preloadConfig])

const watching = compiler.watch({
    aggregateTimeout: 300,
    poll: 1000,
    ignored: ['**/node_modules/'],
    stdin: true
}, (err, stats) => {
    if(err) {
        process.stdout.write(err.toString() + '\n');
    } else {
        process.stdout.write(stats.toString() + '\n');
    }
})

process.once('SIGINT', () => {
  watching.close((err) => {
    if(err)
      console.log('Failed to close ', err)
    console.log('Bye!')
  })
})
