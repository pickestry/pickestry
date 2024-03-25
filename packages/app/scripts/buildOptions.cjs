#!/usr/bin/env node

// Part of Pickestry. See LICENSE file for full copyright and licensing details.

const builder = require('electron-builder')

const BINARY_PREFIX = 'PickestrySetup';

const productName = 'pickestry'

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  electronVersion: '29.1.5',
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
  publish: [{
    provider: 'generic',
    url: 'http://localhost:8888/files/'
  }],
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
