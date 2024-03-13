// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import Debug from 'debug'
import { app as electronApp } from 'electron'
import { app } from './app.mjs'

const log = Debug('pickestry:app')

try {
  await import('electron-squirrel-startup')
} catch(error) {
  console.log('electron squirrel failed: ', error) // eslint-disable-line no-console
  electronApp.quit()
}

electronApp.on('ready', async () => {
  await app.init()

  await app.createMainWindow()

  setTimeout(() => {
    app.showMainWindow()
  }, 0)
})

electronApp.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    electronApp.quit()
  }
})

electronApp.on('before-quit', async (e) => {
  log('App quiting...')
  e.preventDefault()

  try {
    await app.cleanup()
  } catch(error) {
    console.log('Failed to cleanup ', error)  // eslint-disable-line no-console
  }

  electronApp.exit(0)
})

electronApp.on('quit', async () => {
  log('Bye!')
})




