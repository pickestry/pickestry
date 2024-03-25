#!/usr/bin/env node

// Part of Pickestry. See LICENSE file for full copyright and licensing details.

const BINARY_PREFIX = 'PickestrySetup';

const options = require('./buildOptions.cjs')

const builder = require('electron-builder')

const argv = process.argv.slice(2)

const platforms = argv.length !== 0 ? argv[0].split('=')[1].split(',') : []

const effectiveTargets = platforms.map((p) => builder.Platform[p.toUpperCase()]?.createTarget()).filter(o => o)

for(const targets of effectiveTargets) {
  builder.build({
    targets,
    config: options
  })
  .then((result) => {
    console.log(JSON.stringify(result))
  })
  .catch((error) => {
    console.error(error)
  })
}
