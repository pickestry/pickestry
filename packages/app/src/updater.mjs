import Debug from 'debug'
import electronUpdater from 'electron-updater'
import electronLog from 'electron-log'
import { dialog } from 'electron'

const log = Debug('pickestry:updater')

class PickestryUpdater {

  #autoUpdater

  #disabled = false

  constructor() {
    this.#autoUpdater = electronUpdater.autoUpdater
    this.#autoUpdater.logger = electronLog
    this.#autoUpdater.logger.transports.file.level = 'debug'

    this.onUpdateAvailable = this.onUpdateAvailable.bind(this)
    this.onUpdateDownloaded = this.onUpdateDownloaded.bind(this)
  }

  async init({
    disabled = false,
    autoCheckEvery = 3600000 // 60min
  }) {
    if(disabled === true) return

    setInterval(async () => {
      if(this.#disabled === false) {
        await this.#autoUpdater.checkForUpdatesAndNotify()
      }
    }, autoCheckEvery)

    this.#autoUpdater.on('update-available', this.onUpdateAvailable)

    this.#autoUpdater.on('update-downloaded', this.onUpdateDownloaded)
  }

  onUpdateAvailable(ev, info) {
    this.#disabled = true
  }

  onUpdateDownloaded(ev, info) {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart'],
      title: 'Update Available',
      detail: 'Ready to install new version. Restart to apply changes'
    }

    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  }

  async cleanup() {
    this.#autoUpdater.off('update-available', this.onUpdateAvailable)
    this.#autoUpdater.off('update-downloaded', this.onUpdateDownloaded)
  }
}

export const updater = new PickestryUpdater()
