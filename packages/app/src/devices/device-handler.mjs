import { EventEmitter } from 'node:events'
import { usb } from './usb-wrapper.js'
import { buildIdFromUSBDevice } from './utils.mjs'
import { Device } from './device.mjs'
import { createLogger } from '@pickestry/core'
import { isUndefined } from 'lodash-es'

const log = createLogger('pklite:device')

export class DeviceHandler extends EventEmitter {

  #devices = []

  /**
   * Keep track of started devices
   */
  started = new Set()

  constructor() {
    super()

    this.onData = this.onData.bind(this)
  }

  async init() {
    log('Initializing device handler...')

    const devices = usb.getDeviceList()
    for(const device of devices) {
      const o = new Device(device)

      try {
        await o.init()
      } catch(error) {
        log('Problem while initializing device: %s', error.message)
      }

      this.#devices.push(o)
    }

    log('Caching %d devices', this.#devices.length)

    // setup connect/disconnect events

    return Promise.resolve()
  }

  onData(id, data) {
    log('data: %s -> %s', id, data)
    this.emit('data', id, data)
  }

  async startDevice(id) {
    try {
      const device = this.#getDevice(id)

      await device.open()

      await device.start()

      device.on('data', this.onData)

      this.started.add(id)

      return device
    } catch(error) {
        throw new Error('failed to start device', { cause: error })
    }
  }

  async stopDevice(id) {
    const device = this.#getDevice(id)

    await device.stop()

    await device.close()

    // cleanup event handlers
    device.off('data', this.onData)

    this.started.delete(id)

    return device
  }

  get devices() {
    return this.#devices
  }

  buildDeviceId(device) {
    return buildIdFromUSBDevice(device)
  }

  async cleanup() {
    const promArr = []

    for(const id of this.started) {
      promArr.push(this.stopDevice(id))
    }

    try {
      await Promise.all(promArr)
    } catch(error) {
      throw new Error('failed to cleanup', { cause: error })
    }
  }

  #getDevice(id) {
    const device = this.#devices.find((o) => o.id === id)

    if(isUndefined(device)) throw new Error('device not found')

    return device
  }

  // #requestDevice(id: string): Promise<USBDevice> {
  //     return new Promise(async (resolve, reject) => {
  //         const devices = await usb.getDevices()
  //         for(const device of devices) {
  //             if(hasIdFromUSBDevice(device, id)) return resolve(device)
  //         }

  //         reject(new Error('device not found'))
  //     })
  // }
}

export const deviceHandler = new DeviceHandler()
