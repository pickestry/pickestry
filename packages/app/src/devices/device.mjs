import { EventEmitter } from 'node:events'
import { promisify } from 'util'
import { buildId } from './utils.mjs'
import { requestDevice } from './utils.mjs'
import { KeyMap } from './keymap.mjs'
import { createLogger } from '@pickestry/core'

export class Device extends EventEmitter {

  id

  name

  #keymap = new KeyMap()

  #device

  #iface

  #ep

  #driverAttached = false

  #opened = false

  started = false

  #log

  #stringBuilder = []

  constructor(device) {
    super()
    this.device = device
    this.id = buildId(device)
    this.log = createLogger(`station:device:${this.id}`)
    this.onData = this.onData.bind(this)
    this.onError = this.onError.bind(this)
  }

  async init() {
    try {
      this.device.open()
      this.name = await this.getStringDescriptor(this.device.deviceDescriptor.iProduct)
      this.device.close()
    } catch(error) {
      throw new Error('failed to init device', { cause: error })
    }
  }

  /**
   * Create a device by id
   */
  static async create(id) {
    const device = requestDevice(id)
    const o = new Device(device)
    await o.init()

    return o
  }

  onData(data) {
    const d = new Uint8Array(data)
    const c = d[0]
    const k = d[2]
    if(k !== 0) {
      const char = this.#keymap.getChar(c, k)
      if(char === '\0') {
        this.emit('data', this.id, this.#stringBuilder.join(''))
        this.#stringBuilder = []
      } else {
        this.#stringBuilder.push(char)
      }
    }
  }

  onError(err) {
    this.log('Handling error', err)
    this.emit('error', err)
  }

  async open() {
    return new Promise((resolve, reject) => {
      try {
        this.device.open()

        this.iface = this.device.interfaces[0]
        this.ep = this.iface.endpoints[0]

        this.opened = true
        return resolve()
      } catch(error) {
        return reject(new Error('failed to open device: ', { cause: error }))
      }
    })
  }

  async close(){
    if(this.started) {
      throw new Error('Stop device first before you closing it')
    }

    try {
      if(this.opened) {
        this.device.close()
      }
    } catch(error) {
      throw new Error('failed to close device', { cause: error })
    }
  }

  async start() {
    return new Promise((resolve, reject) => {
      // check if kerner active (this is relevant only on linux)
      try {
        // detach device if necessary
        if(this.iface.isKernelDriverActive()) {
          this.log('Device is being used by the os, detaching...')
          this.driverAttached = true
          this.iface.detachKernelDriver()
        }
      } catch(error) {
        this.log('Failed to check for kernel driver, we are probably on windows', error.message)
      }

      try {
        this.iface.claim()

        this.ep.startPoll(100, 8)

        this.ep.on('data', this.onData)
        this.ep.on('error', this.onError)

        this.started = true

        return resolve()
      } catch(error) {
        return reject(new Error('failed to start device', { cause: error }))
      }
    })
  }

  async stop() {
    return new Promise((resolve, reject) => {
      this.log('Removing events...')
      this.ep?.removeListener('data', this.onData)
      this.ep?.removeListener('error', this.onError)

      this.log('Stop polling')
      this.ep?.stopPoll(() => {
        setTimeout(() => {
          try {
            this.log('Release iface...')
            this.iface.release(() => {
              if(this.driverAttached) {
                try {
                  this.log('Give device control back to the system')
                  this.iface.attachKernelDriver()
                  this.driverAttached = false
                } catch(error) {
                  this.log('Failed to re-attach driver', error)
                }
              }

              this.device.close()

              this.log('Device stopped')

              this.started = false

              resolve()
            })
          } catch(error) {
              this.log('Failed to release iface', error)
              reject(new Error('failed to release interface', {cause: error }))
          }
        }, 500)
      })
    })
  }

  async getStringDescriptor(index) {
    try {
      const getStringDescriptor = promisify(this.device.getStringDescriptor).bind(this.device)
      const buffer = await getStringDescriptor(index)
      return buffer ? buffer.toString() : ''
    } catch (error) {
      return ''
    }
  }
}
