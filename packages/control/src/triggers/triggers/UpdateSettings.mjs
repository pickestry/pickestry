// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Trigger } from '../Trigger.mjs'

export class UpdateSettings extends Trigger {

  constructor(control) {
    super('settings:changed', async (data) => {
      console.log('TRIGGER[settings:changed]: ', data) // eslint-disable-line no-console

      control.setSettings(data)
    }, control)
  }

}
