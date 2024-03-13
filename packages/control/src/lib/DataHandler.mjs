// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import Debug from 'debug'
import { head } from 'lodash-es'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { BaseHandler } from './BaseHandler.mjs'

const log = Debug('pickestry:control')

/**
 * Neatly gathers information from devices and barcodes scanned.
 */
export class DataHandler extends BaseHandler {

  #device

  #channel

  #location

  #data

  #product

  #package

  /**
   * Based on the device machine id and data scanned initialize handler.
   *
   * @param {string} id Device machine id
   * @param {string} data Data to be processed
   * @throws Will throw an error when a device is not found
   * @throws Will throw and error when data is undefined or empty
   */
  async init({ id, data = '' }) {

    log('Initializing handler for device: %s and data: %s', id, data)

    this.#data = data.trim()

    if(this.#data === '') throw new Error('no data')

    // find device
    const devices = await this.models.Device.findAll({
      where: { mid: id },
      include: [{
        association: 'Channel',
        include: [{ association: 'Location' }]
      }],
      transaction: this.transaction,
      rejectOnEmpty: false
    })

    this.#device = head(devices)

    if(!this.#device) throw new Error('device not found')

    // find channel
    this.#channel = await this.#device.getChannel({ transaction: this.transaction })

    // find location if any
    this.#location = await this.#channel.getLocation({
      transaction: this.transaction,
      rejectOnEmpty: false
    })

    // find Barcode
    try {
      const barcode = head(await this.models.Barcode.findAll({
        where: { value: this.#data },
        include: [
          { association: 'Product' },
          { association: 'Package' }
        ],
        transaction: this.transaction
      }))

      this.#product = barcode.Product
      this.#package = barcode.Package
    } catch(error) {
      log('No barcode found for `%s`', this.#data)
    }
  }

  get isProduction() {
    return get(this.#channel, 'dataValues.type') === 'production'
  }

  get isInventory() {
    return get(this.#channel, 'dataValues.type') === 'inventory'
  }

  get intent() {
    return get(this.#channel, 'dataValues.intent')
  }

  get hasLocation() {
    return !isNil(this.#location)
  }

  get location() {
    return this.#location
  }

  get location_id() {
    return get(this.#location, 'dataValues.id')
  }

  get hasProduct() {
    return !isNil(this.#product)
  }

  get product() {
    return this.#product
  }

  get product_id() {
    return get(this.#product, 'dataValues.id')
  }

  get hasPackage() {
    return !isNil(this.#package)
  }

  get package() {
    return this.#package
  }

  get package_id() {
    return get(this.#package, 'dataValues.id')
  }

  get data() {
    return this.#data
  }
}
