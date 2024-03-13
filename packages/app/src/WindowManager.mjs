// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { EventEmitter } from 'node:events'
import path from 'node:path'
import { session } from 'electron'
import { BrowserWindow } from 'electron'
import { Menu } from 'electron'
import { screen } from 'electron'
import { shell } from 'electron'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { isBoolean } from 'lodash-es'
import { config } from '@pickestry/core'
import { createLogger } from '@pickestry/core'

const log = createLogger('pickestry:app')

const DEFAULT_RESIZABLE = true

let webPreferences = {
  preload: path.resolve(__dirname, 'preload.js'),
  contextIsolation: true,
  nodeIntegration: false,
  nodeIntegrationInSubFrames: false,
  sandbox: true,
  accessibleTitle: 'Pickestry',
  backgroundThrottling: false,
  disableHtmlFullscreenWindowResize: true,
  spellcheck: false
}

export class WindowManager extends EventEmitter {

  #loadingScreen

  #acceptLicense

  #currentWindow

  #currentModal

  #defaultMinWidth

  #defaultMinHeight

  #wWidth

  #wHeight

  constructor() {
    super()
    log('--- WebPreferences@START ---')
    log(JSON.stringify(webPreferences, null, 2))
    log('--- WebPreferences@END ---')
  }

  async init() {
    this.#defaultMinWidth = config.get('ui.windows.minWidth')
    this.#defaultMinHeight = config.get('ui.windows.minHeight')

    this.#wWidth = get(screen.getPrimaryDisplay(), 'workArea.width')
    this.#wHeight = get(screen.getPrimaryDisplay(), 'workArea.height')

    return Promise.resolve()
  }

  async loadWindow(urlOrFile, options = { devtools: false }) {

    log(options)

    const winConf = {
      width:  get(options, 'width', this.#wWidth),
      height: get(options, 'height', this.#wHeight),
      title: 'Pickestry',
      icon: 'icon.png',
      resizable: get(options, 'resizable', DEFAULT_RESIZABLE),
      minWidth: this.#defaultMinWidth,
      minHeight: this.#defaultMinHeight,
      webPreferences,
      show: false
    }

    // create loading screen
    const withLoading = isBoolean(options.withLoading) ? options.withLoading : false
    if(withLoading) {
      log('Attempt to load loading screen')
      this.#loadingScreen = new BrowserWindow({
        parent: this.#currentWindow,
        modal: true,
        closable: false,
        frame: false,
        width: 300,
        height: 400,
        icon: 'icon.png',
        backgroundColor: 'white' //'#e6eef5'
      })
      try {
        // log('__dirname: %s', __dirname)
        const url = new URL(`file:///${__dirname}/loading.html`).href
        await this.#loadingScreen.loadURL(url)
        log('Loading screen loaded!')
      } catch(error) {
        log('Failed to load loading screen', error)
      }
    }

    // load main
    if(isNil(this.#currentWindow)) {
      if(__DEV__) {
        const reactDevTools = config.get('extensions.react_rools')

        if(reactDevTools) {
          log('Loading react tools...')
          try {
            const loaded = await session.defaultSession.loadExtension(path.join(reactDevTools), {allowFileAccess: true})
            // const loaded = await this.#currentWindow.webContents.session.loadExtension(path.join(reactDevTools), {
            //   allowFileAccess: true
            // })
            log('extensions loaded: ', loaded.id)
          } catch(error) {
            log('failed to load extension: ', error)
          }
        }
      }

      this.#currentWindow = new BrowserWindow(winConf)

      // handle links
      this.#currentWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.beep()
        this.handleUrl(url)
        return { action: 'deny' }
      })

      // display menu or not
      if(get(options, 'noMenu', false)) {
        Menu.setApplicationMenu(null)
      }

      if(get(options, 'devtools', false) === true) {
        this.#currentWindow.webContents.openDevTools({ mode: 'right' })
      }

      this.#currentWindow.on('closed', () => {
        log('Window closed')

        this.#currentWindow = undefined
      })
    }

    log('Figure out how to load: %s', urlOrFile)

    let finalUrl = new URL(`file:///${__dirname}/${urlOrFile}`).href

    log('Attempt to load: %s', finalUrl)

    try {
      await this.#currentWindow.loadURL(finalUrl)
    } catch(error) {
      log('Failed to load window:', error)
    }
  }

  loadModal(urlOrFile, options = { devtools: false }) {
    const parentWin = this.#currentWindow ? this.#currentWindow : undefined

    const withFrames = __DEV__

    const modalWin = new BrowserWindow({
      parent: parentWin,
      resizable: withFrames,
      movable: withFrames,
      minimizable: withFrames,
      maximizable: withFrames,
      frame: withFrames,
      width:  get(options, 'width', this.#wWidth),
      height: get(options, 'height', this.#wHeight),
      title: get(options, 'title', 'Pickestry'),
      icon: 'icon.png',
      modal: true,
      webPreferences: { preload: path.resolve(__dirname, 'preload.js') }
    })

    log('Figure out how to load: %s', urlOrFile)

    let finalUrl = new URL(`file:///${__dirname}/${urlOrFile}`).href

    log('Attempt to load: %s', finalUrl)

    modalWin.loadURL(finalUrl)

    modalWin.on('ready-to-show', () => {
      modalWin.show()
    })

    if(get(options, 'devtools', false) === true) {
      modalWin.webContents.openDevTools()
    }

    this.#currentModal = modalWin
  }

  show() {
    if(!isNil(this.#loadingScreen)) {
      log('Closing loading screen...')
      this.#loadingScreen.destroy()
      this.#loadingScreen = null
    }

    this.#currentWindow.show()
    this.emit('main:ready')
  }

  send(channel, ...args) {
    if(this.#currentWindow?.isFocused()) {
      log('[Channel] %s -> %O', channel, args)
      this.#currentWindow.webContents.send(channel, args)
    }
  }

  sendAlways(channel, ...args) {
    if(!isNil(this.#currentWindow)) {
      log('[Channel] %s -> %O', channel, args)
      this.#currentWindow.webContents.send(channel, args)
    }
  }

  loadLicenseAccept(options = { devtools: false }) {
    const parentWin = this.#currentWindow ? this.#currentWindow : undefined

    const withFrames = false // __DEV__

    const modalWin = new BrowserWindow({
      parent: parentWin,
      resizable: withFrames,
      movable: withFrames,
      minimizable: withFrames,
      maximizable: withFrames,
      frame: withFrames,
      modal: true,
      webPreferences: {preload: path.resolve(__dirname, 'preload.js')}
    })

    let finalUrl = new URL(`file:///${__dirname}/license.html`).href

    log('Attempt to load: %s', finalUrl)

    modalWin.loadURL(finalUrl)

    modalWin.on('ready-to-show', () => {
      log('Show license....')
      this.#currentWindow?.hide()
      modalWin.show()
    })

    modalWin.on('close', () => {
      this.#currentWindow?.show()
    })

    if(get(options, 'devtools', false) === true) {
      modalWin.webContents.openDevTools()
    }

    this.#acceptLicense = modalWin
  }

  async closeLicenseAccept() {
    await this.#acceptLicense?.close()
  }

  get currentWindow() {
    return this.#currentWindow
  }

  async handleUrl(url) {
    const parsedUrl = this.maybeParseUrl(url)
    if (!parsedUrl) {
      return
    }

    const { protocol } = parsedUrl

    if (protocol === 'http:' || protocol === 'https:') {
      try {
        await shell.openExternal(url)
      } catch (error) {
        log(`Failed to open url: ${error}`)
      }
    }
  }

  maybeParseUrl(value) {
    if(typeof value === 'string') {
      try {
        return new URL(value)
      } catch (err) {
        log(`Failed to parse url: ${value}`)
      }
    }

    return undefined
  }

  async getItem(name) {
    if(!name) throw new Error('name required')

    return await this.#currentWindow?.webContents.executeJavaScript(`localStorage.getItem("${name}")`, true)
  }

  async setItem(name, value) {
    return await this.#currentWindow?.webContents.executeJavaScript(`localStorage.setItem('${name}', ${JSON.stringify(value)})`, true)
  }

  async setItemJson(name, json) {
    return await this.setItem(name, JSON.stringify(json))
  }

}

export const windowManager = new WindowManager()
