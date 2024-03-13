// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Trigger } from '../Trigger.mjs'

export class CreateChannels extends Trigger {

  constructor(control) {
    super('location.created', async (data) => {
      this.log('TRIGGER[location.created]', data) // eslint-disable-line no-console

      await control.createChannels(data)
    }, control)
  }

}
