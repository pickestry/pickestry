import electron from 'electron'

const { Menu } = electron

class AppMenu {

  #tpl = []

  constructor() {
    this.#tpl.push({
      label: 'File',
      submenu: [ { role: 'quit' } ]
    })
    this.#tpl.push({
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    })
  }

  async init(app) {
    this.#tpl.push({
      role: 'help',
      submenu: [
        {
          label: 'System Info',
          click: async () => {
            app.showModal('system.html')
            // const { shell } = require('electron')
            // await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate(this.#tpl))
  }
}

export const menu = new AppMenu()
