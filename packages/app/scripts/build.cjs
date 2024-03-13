// Part of Pickestry. See LICENSE file for full copyright and licensing details.

const webpack = require('webpack')

const { mainConfig } = require('../webpack.main.config')
const { rendererConfig } = require('../webpack.renderer.config')
const { preloadConfig } = require('../webpack.preload.config')

const compiler = webpack([mainConfig, rendererConfig, preloadConfig])

compiler.run((err, stats) => {
    if(err) {
        process.stdout.write(err.toString() + '\n');
    } else {
        process.stdout.write(stats.toString() + '\n');
    }
})
