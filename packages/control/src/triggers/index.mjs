// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { CreateChannels } from './triggers/CreateChannels.mjs'
import { UpdateSettings } from './triggers/UpdateSettings.mjs'
import { TransferJobInventory } from './triggers/TransferJobInventory.mjs'
import Debug from 'debug'

const log = Debug('pickestry:control:trigger')

export class TriggerHandler {

  #triggers = []

  onEvent({ type, data }) {
    for(const trigger of this.#triggers) {
      if(trigger.on == type) {
        trigger.trigger(data)
      }
    }
  }

  addTrigger(instance) {
    log('Adding trigger: ', instance)
    this.#triggers.push(instance)
  }

  get length() {
    return this.#triggers.length
  }
}

export const createTriggerHandler = (control) => {
  const handler = new TriggerHandler()

  const createChannels = new CreateChannels(control)
  handler.addTrigger(createChannels)

  const updateSettings = new UpdateSettings(control)
  handler.addTrigger(updateSettings)

  const transferJobInventory = new TransferJobInventory(control)
  handler.addTrigger(transferJobInventory)

  control.log('%s triggers registered', handler.length)

  return handler
}
