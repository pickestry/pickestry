// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { app as electronApp } from 'electron'
import { dialog } from 'electron'
import { shell } from 'electron'
import Debug from 'debug'
import { readFile } from 'node:fs/promises'
import { writeFile } from 'node:fs/promises'
import fs from 'node:fs'
import path from 'node:path'
import { pickBy } from 'lodash-es'
import { identity } from 'lodash-es'
import { get } from 'lodash-es'
import nodeMachineId from 'node-machine-id'
import { Control } from '@pickestry/control'
import { controls } from '@pickestry/control'
import { createTriggerHandler } from '@pickestry/control'
import { config } from '@pickestry/core'
import { deviceHandler } from './devices/index.mjs'
import { Scanner } from './devices/index.mjs'
import { ipc } from './ipc/index.mjs'
import { menu } from './menu/index.mjs'
import { windowManager } from './WindowManager.mjs'
import { protocols } from './protocols/index.mjs'
import SEED_TOML from './pk.toml.txt'
import * as c from './c.mjs'
import pkgJSON from '../package.json'

const { machineIdSync } = nodeMachineId

const log = Debug('pickestry:app')

const CONFIG_NAME = 'pk.toml'

export class App {

  #machineId

  devices = deviceHandler

  #control = new Control()

  #triggerHandler

  #settings

  constructor() {
    const appData = path.join(electronApp.getPath('appData'), 'pickestry')

    if(!fs.existsSync(appData)) {
      fs.mkdirSync(appData)
    }
    electronApp.setPath('appData', appData)
    electronApp.setPath('userData', path.join(appData, 'root'))
    electronApp.setPath('logs', path.join(appData, 'logs'))
    electronApp.setPath('crashDumps', path.join(appData, 'crash'))
    electronApp.setPath('sessionData', path.join(appData, 'sess'))

    // Machine id
    this.#machineId = machineIdSync()

    log('Machine id: %s [%s]', this.#machineId.substring(0, 12), this.#machineId)

    this.onData = this.onData.bind(this)
    this.devices.on('data', this.onData)

    this.onPersist = this.onPersist.bind(this)

    this.onMainReady = this.onMainReady.bind(this)
    windowManager.on('main:ready', this.onMainReady)
  }

  async init() {
    log('Initializing app...')

    // Check single instance
    const lock = electronApp.requestSingleInstanceLock()
    if(!lock) {
      log('App already running...')
      dialog.showMessageBoxSync(null, {message: 'Application already running...'})

      electronApp.quit()
      process.exit(1)
    }

    // Initialize configuration
    log('Loading configuration', electronApp.getPath('appData'))
    let fl = path.join(electronApp.getPath('appData'), CONFIG_NAME)
    try {
      await readFile(fl, 'utf-8')
    } catch(error) {
      log('Configuration file absent, will create')
      await writeFile(fl, SEED_TOML)
    }

    await config.init(fl)
    log('Configuration loaded successfully')

    // 1. window manager
    await windowManager.init()

    await menu.init(this)

    // 1. Set up protocols
    await protocols.init()

    // 1. Persistence
    const dataDir = process.env.DATA_DIR ? process.env.DATA_DIR : this.#tryGetPath('appData')
    await this.#control.init({
      controls,
      dataDir
    })


    // init trigger handler
    this.#triggerHandler = createTriggerHandler(this.#control)

    this.#control.on('persist', this.onPersist)

    // 1. Set up ipc
    ipc.init(this)

    return Promise.resolve()
  }

  async onMainReady() {
    log('Post main window ready')
    // 1. Init data
    this.#settings = await this.settings()

    this.#control.setSettings(this.#settings)

    // 1. Initialize devices
    await this.devices.init()

    const { autostart = [] } = this.#settings

    for(const v of autostart) {
      log(`${v} marked for autostart`)
      try {
        await this.startScanner(v)
        log(`${v} started (autostart)`)
      } catch(error) {
        this.removeAutostart(v)
        log(`Failed to start ${v}`)
      }
    }
  }

  onPersist({ name, entity }) {
    this.sendEvent(name, entity)
  }

  onData(id, data) {
    windowManager.send('data:scanned', id, data)

    // process
    log('Data ', id, data)

    if(this.#settings.scan_beep === true) {
      shell.beep()
    }

    this.control.procData({id, data})
      .then((o) => { log('YES proc data', o) })
      .catch((err) => {
        if(err.message === 'job_requires_pipeline') {
          this.sendError('Assign job to pipeline to start processing barcodes')
        }
        log('Failed to proc data', err)
      })
  }

  onEvent(event, { force = false }) {
    if(force === true) {
      windowManager.sendAlways('event', event)
    } else {
      windowManager.send('event', event)
    }

    log('Event: %O', event)
  }

  /**
   * error.type system | data | network
   * error.message
   */
  onError(error) {
    const err = this.betterError(error)
    windowManager.send('error', err)

    log('Error: %O', err)
  }

  betterError(error) {
    log('=> %O', error)
    return error
  }

  sendError(message, type = 'system') {
    this.onError({
      type,
      message
    })
  }

  sendEvent(name, data, force) {
    const event = {
      type: name,
      data
    }

    this.#triggerHandler.onEvent(event)

    this.onEvent(event, { force })
  }

  async getScanners(all = false) {
    const { autostart = [] } = await this.getState()

    const collection = []
    for(const device of this.devices.devices) {
      if(all || (!all && this.#isMaybeScanner(device.name))) {
        const o = Scanner.create(device)
        o.autostart = autostart.includes(device.id)
        o.mid = device.id
        collection.push(o)
      }
    }

    // Build final collection with activated devices
    const { data: activatedDevices } = await this.control.getActivatedDevices()

    const finalCollection = collection.map((o) => {
      const activated = activatedDevices.find((dev) => dev.mid == o.id)
      return Object.assign({}, o, activated)
    })

    return finalCollection
  }

  async startScanner(id) {
    try {
      const device = await this.devices.startDevice(id)
      windowManager.send('device:started', id)

      return Scanner.create(device)
    } catch(error) {
      windowManager.send('device:error', id, error)

      throw error
    }
  }

  async stopScanner(id) {
    try {
      const device = await this.devices.stopDevice(id)
      windowManager.send('device:stopped', id)

      return Scanner.create(device)
    } catch(error) {
      windowManager.send('device:error', id, error)

      throw error
    }
  }

  #isMaybeScanner(name) {
    const nameLow = name?.toLowerCase() || ''
    for(const n of App.maybeScannerNames) {
      if(nameLow.includes(n)) return true
    }

    return false
  }

  async getState() {
    // load app data
    try {
      const storedState = await this.#loadMaybeCreateStateFile()
      return Object.assign({}, storedState, { stationId: this.#machineId })
    } catch(error) {
      throw new Error('failed to load state', { cause: error })
    }
  }

  async updateState(o) {
    // load app data
    try {
      const currentObj = await this.#loadMaybeCreateStateFile()

      const updatedObj = pickBy(Object.assign({}, currentObj, o), identity)

      // emit changes
      const forceSend = true

      this.#settings = updatedObj

      this.sendEvent('settings:changed', updatedObj, forceSend)

      // persist results
      await windowManager.setItemJson('state', updatedObj)

      return updatedObj
    } catch(error) {
      log('Failed to save state file: ', error)
      throw new Error('failed to load state', { cause: error })
    }
  }

  async cleanup() {
    try {
      await this.devices.cleanup()

      this.#control.off('persist', this.onPersist)

      windowManager.off('main:ready', this.onMainReady)

      await this.#control.cleanup()
    } catch(error) {
      throw new Error('failed to cleanup', { cause: error })
    }
  }

  async removeAutostart(v) {
    const { autostart = []} = await this.#loadMaybeCreateStateFile()
    await this.updateState({ autostart: autostart.filter((o) => o !== v) })

    return Promise.resolve()
  }

  exitNow() {
    electronApp.quit()
    process.exit(1)
  }

  async #loadMaybeCreateStateFile() {
    let stateStr = await windowManager.getItem('state')

    if(!stateStr) {
      stateStr = JSON.stringify(DEFAULT_STATE)
      await windowManager.setItem('state', stateStr)
    }

    const stateObj = JSON.parse(stateStr)

    this.#settings = stateObj

    return stateObj
  }

  async createMainWindow() {
    await windowManager.loadWindow('index.html', {
      withLoading: true,
      resizable: true,
      noMenu: __PROD__,
      devtools: __DEV__
    })
  }

  showMainWindow() {
    windowManager.show()
  }

  showSettings() {
    windowManager.loadModal('settings.html', { devtools: false })
  }

  showModal(page) {
    windowManager.loadModal(page)
  }

  showDialog(name, meta = {}) {
    windowManager.send(c.DIALOG_SHOW, name, meta)
  }

  get stateFile() {
    const appDataPath = electronApp.getPath('appData')
    return path.resolve(appDataPath, 'state.json')
  }

  get machineIdShort() {
    return this.#machineId.substring(0, 12)
  }

  get dataInstance() {
    return this.data
  }

  get control() {
    return this.#control
  }

  static maybeScannerNames = [
    'bar',
    'symbol technologies'
  ]

  static supportedScanners = [
    ['', '']
  ]

  async settings() {
    return await this.#loadMaybeCreateStateFile()
  }

  async getSettingValue(name) {
    const settings = await this.settings()

    return get(settings, name)
  }

  async selectOptions() {
    return Promise.resolve({
      localeOptions: ['en-US', 'en-CA'],
      currencyOptions: [{
        value: 'usd',
        name: 'US Dollar ($)'
      }, {
        value: 'cad',
        name: 'Canadian Dollar ($)'
      }],
      amountOptions: [{
        value: 'dot_comma',
        name: '1.000,00'
      }, {
        value: 'comma_dot',
        name: '1,000.00'
      }],
      displayTimeOptions: ['24h', '12h'],
      displayDateOptions: ['MM/dd/YYYY', 'dd/MM/YYYY']
    })
  }

  get systemInfo() {

    return {
      machineId: this.#machineId,
      configFile: config.file,
      // stateFile: this.stateFile,
      config: config.tree,
      paths: {
        dataDir: this.control.persist.dataDir,
        home: this.#tryGetPath('home'),
        appData: this.#tryGetPath('appData'),
        userData: this.#tryGetPath('userData'),
        logs: this.#tryGetPath('logs'),
        crashDumps: this.#tryGetPath('crashDumps'),
        sessionData: this.#tryGetPath('sessionData'),
        temp: this.#tryGetPath('temp'),
        exe: this.#tryGetPath('exe'),
        module: this.#tryGetPath('module'),
        desktop: this.#tryGetPath('desktop'),
        documents: this.#tryGetPath('documents'),
        downloads: this.#tryGetPath('downloads'),
        music: this.#tryGetPath('music'),
        pictures: this.#tryGetPath('pictures'),
        videos: this.#tryGetPath('videos'),
        recent: this.#tryGetPath('recent')
      },
      versions: process.versions
    }
  }

  get version() {
    return get(pkgJSON, 'version')
  }

  #tryGetPath(name) {
    let v = '<not defined>'
    try {
      v = electronApp.getPath(name)
    } catch(ignored) {} // eslint-disable-line no-empty

    return v
  }

}

export const app = new App()

const DEFAULT_STATE = {
  locale: 'en-US',
  currency: 'usd',
  amount: 'dot_comma',
  displayTime: '24h',
  displayDate: 'dd/MM/YYYY',
  make_finish_job_inventory: true,
  make_finish_job_inventory_pair: [],
  job_bump_counter_cap: false,
  scan_beep: true
}
