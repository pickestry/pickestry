import { createLogger } from '@pickestry/core'

const log = createLogger('pickestry:app')

export class IpcApp {

  #app

  constructor(app) {
    this.#app = app
  }

  showDialog(name, meta = {}) {
    log('Show dialog %s with meta %O', name, meta)
    return this.#app.showDialog(name, meta)
  }

  systemInfo() {
    return Promise.resolve(this.#app.systemInfo)
  }

  async getScanners(showAll = false) {
    log(`Get scanners ${showAll ? '(showing all)' : 'showing only scanners'}`)

    const data = await this.#app.getScanners(showAll)

    log('Returning %d scanners', data.length)

    return Promise.resolve(data)
  }

  async startScanner(id) {
    log(`Start scanner ${id}`)

    return await this.#app.startScanner(id)
  }

  async stopScanner(id) {
    log(`Stop scanner ${id}`)
    return await this.#app.stopScanner(id)
  }

  async autostartScannerOn(id) {
    log(`Swithing autostart on for ${id}`)

    const { autostart } = await this.#app.getState()

    const d = new Set(autostart)
    d.add(id)

    await this.#app.updateState({ autostart: [...d]})
  }

  async autostartScannerOff(id) {
    log(`Swith autostart off for ${id}`)

    const { autostart: currentAutostart } = await this.#app.getState()
    const autostart = currentAutostart.filter((v) => v !==  id)

    await this.#app.updateState({ autostart })
  }

  showSettings() {
    this.#app.showSettings()
  }

  async settingsWithOptions() {
    const settings = await this.#app.settings()
    const options = await this.#app.selectOptions()

    return {
      settings,
      options
    }
  }

  getVersion() {
    return this.#app.version
  }

  async settings() {
    return await this.#app.settings()
  }

  async getSettingValue(name) {
    return await this.#app.getSettingValue(name)
  }

  getTimeZones(locale) {
    return this.#app.getTimeZones(locale)
  }

  exitNow() {
    return this.#app.exitNow()
  }

  async doAcceptLicense() {
    return await this.#app.doAcceptLicense()
  }

  async updateSettings(o) {
    return await this.#app.updateState(o)
  }

  async addLicense(txt) {
    return await this.#app.addLicense(txt)
  }

  async getRegistration() {
    return await this.#app.getRegistration()
  }
}
