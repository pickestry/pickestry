#!/usr/bin/env node

// Part of Pickestry. See LICENSE file for full copyright and licensing details.

const BINARY_PREFIX = 'PickestrySetup';

const path = require('node:path')
const builder = require('electron-builder')

const Platform = builder.Platform

const productName = 'pickestry'

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  electronVersion: '29.1.1',
  appId: 'com.pickestry.desktop',
  productName,
  asar: true,
  npmRebuild: false,
  protocols: {
    name: 'Pickestry Desktop',
    role: 'Viewer',
    schemes: ['pickestry']
  },
  compression: 'normal',
  removePackageScripts: true,
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,
  directories: {
    output: "dist/artifacts/local",
    buildResources: "build"
  },
  files: [{
    from: '.webpack',
    to: '.'
  }, './package.json'],
  publish: null,
  extraMetadata: {
    main: 'main/index.js'
  },
  fileAssociations: [],
  win: {
    target: 'nsis'
  },
  nsis: {
    deleteAppDataOnUninstall: true,
    artifactName: `${productName}Setup.exe`
  },
  linux: {
    appId: 'pickestry.desktop',
    artifactName: `${BINARY_PREFIX}.\${ext}`,
    executableName: 'pickestry',
    synopsis: 'Manufacturing and Inventory Management System',
    category: 'Accounting',
    desktop: {
      Name: 'Pickestry',
      Comment: 'A Manufacturing and Inventory Management System',
      Categories: 'Accounting',
      Keywords: 'Accounting;ERP;Inventory;Manufacturing'
    },
    target: [{target: 'deb'}]
  }
}

const argv = process.argv.slice(2)

const platforms = argv.length !== 0 ? argv[0].split('=')[1].split(',') : []

const effectiveTargets = platforms.map((p) => Platform[p.toUpperCase()]?.createTarget()).filter(o => o)

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
