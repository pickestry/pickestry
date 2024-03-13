// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Trigger } from '../Trigger.mjs'

export class TransferJobInventory extends Trigger {

  constructor(control) {
    super('job.removed', async (data) => {
      this.log('TRIGGER[job.removed]', data) // eslint-disable-line no-console

      const {
        make_finished_job_inventory,
        make_finished_job_inventory_pairs
      } = control.settings

      if(make_finished_job_inventory === true) {
        const {
          product,
          location,
          progress: count
        } = data

        // find where it should go
        let locationTo
        if(location) {
          const o = make_finished_job_inventory_pairs.find(({ fromId }) => fromId == location)
          if(o?.toId) {
            locationTo = o.toId
          }
        }

        if((location && locationTo) || !(location || locationTo)) {
          // TODO: transfer to default (no location)
          await control.createInventoryTx({
            product,
            location: locationTo,
            type: 'in',
            count
          })
        }
      }
    }, control)
  }

}
