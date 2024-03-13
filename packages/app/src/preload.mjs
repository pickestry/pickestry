// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { contextBridge } from 'electron'
import { ipcRenderer } from 'electron'
import { enums } from '@pickestry/defs'
import * as c from './c.mjs'

contextBridge.exposeInMainWorld('ipc', {
  getScanners: (showAll) => ipcRenderer.invoke(c.SCANNER_GET_ALL, showAll),
  startScanner: (id) => ipcRenderer.invoke(c.SCANNER_START, id),
  stopScanner: (id) => ipcRenderer.invoke(c.SCANNER_STOP, id),
  autostartScannerOn: (id) => ipcRenderer.invoke(c.SCANNER_AUTOSTART_ON, id),
  autostartScannerOff: (id) => ipcRenderer.invoke(c.SCANNER_AUTOSTART_OFF, id),
  getAppState: () => ipcRenderer.invoke(c.APP_GET_STATE),
  updateAppState: (o) => ipcRenderer.invoke(c.APP_UPDATE_STATE, o),
  on: (channel, cb) => { ipcRenderer.on(channel, cb) },
  off: (channel, cb) => { ipcRenderer.off(channel, cb) }
})

contextBridge.exposeInMainWorld('pk', {
  invokeControl: (funcName, ...args) => {
    return ipcRenderer.invoke(funcName, ...args)
  },
  invokeApp: (funcName, ...args) => {
    return ipcRenderer.invoke(funcName, ...args)
  }
})

contextBridge.exposeInMainWorld('defs', { enums })
