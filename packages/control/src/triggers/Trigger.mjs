// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { isFunction } from 'lodash-es'
import Debug from 'debug'

export class Trigger {

  #fireOn

  #cb

  #enabled = true

  #control

  #log = Debug('pickestry:control:trigger')

  constructor(fireOn, cb, control) {
    this.#fireOn = fireOn
    if(!isFunction(cb)) throw new Error('callback required')
    this.#cb = cb
    this.#control = control
  }

  switchOff() {
    this.#enabled = false
  }

  switchOn() {
    this.#enabled = true
  }

  trigger(data) {
    if(this.#enabled)
      this.#cb.apply(null, [data])
  }

  log(...params) {
    this.#log(...params)
  }

  get on() {
    return this.#fireOn
  }
}
