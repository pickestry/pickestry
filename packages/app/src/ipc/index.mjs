import { ipcMain } from 'electron'
import { IpcApp } from './IpcApp.mjs'
import { createLogger } from '@pickestry/core'
import { get } from 'lodash-es'

const log = createLogger('pickesty:app')

const SKIP = [
  '_events',
  '_eventsCount',
  '_maxListeners',
  'withinTx'
]

class Ipc {

  init(app) {
    for(const [k, v] of Object.entries(app.control)) {
      if(SKIP.includes(k)) continue

      log(`Registering control function: ${k}`)
      ipcMain.handle(k, async (...args) => {
        try {
          return await v.apply(app.control, args.slice(1))
        } catch(error) {
          if(get(error, 'cause.name') === 'SequelizeTimeoutError') {
            app.sendError('System timeout')
          } else {
            app.sendError(get(error, 'cause.message', error.toString()))
          }

          throw error
        }
      })
    }

    // app
    const ipcApp = new IpcApp(app)

    const appNames = Object.getOwnPropertyNames(ipcApp.constructor.prototype)

    for(const k of appNames.filter((v) => v !== 'constructor')) {
      const v = ipcApp[k]

      ipcMain.handle(k, async (...args) => v.apply(ipcApp, args.slice(1)))
    }
  }
}

export const ipc = new Ipc()
