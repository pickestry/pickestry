// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Query } from './Query.mjs'
import { head } from 'lodash-es'

export class FindEntityById extends Query {

  static NAME = 'findEntityById'

  /**
   * @param {object} payload
   * @param {string} payload.id
   * @param {object} payload.include
   * @param {object} pyaload.order
   * @param {object} payload.transaction
   */
  async run(payload) {

    this.log('Get entity %j', payload)

    const {
      id,
      model,
      include,
      order,
      transaction
    } = payload

    const m = this.sequelize.models[model]

    if(!m) throw new Error(`Model ${model} not found`)

    let entity

    if(include) {
      const findOpts = {
        where: { id },
        include,
        order
      }

      if(transaction) {
        findOpts.transaction = transaction
      }

      const results = await m.findAll(findOpts)

      entity = head(results)
    } else {
      entity = await m.findByPk(id)
    }

    return entity
  }
}

