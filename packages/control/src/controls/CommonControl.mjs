// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseControl } from '../BaseControl.mjs'
import { get } from 'lodash-es'
import { isArray } from 'lodash-es'

export class CommonControl extends BaseControl {

  static NAME = 'common'

  async init() {
  }

  async saveEntity({
    model,
    data: d,
    include
  }) {
    const data = this.persist.objectifyPaths(d)

    this.log('Saving %s: %O, %O', model, data, include)

    const m = this.persist.models[model]
    if(!m) throw new Error(`Model ${model} not found`)

    let json = data

    if(data.id) {
      await m.update(data, { where: { id: data.id } })
    } else {
      const retModel = await m.create(data, { include })

      json = retModel.toJSON()
    }

    this.emitDataEvent(model, data.id ? 'updated' : 'created', {
      id: json.id,
      name: json.name
    })

    return json
  }

  /**
   * @param {object}  payload
   * @param {string}  payload.id
   * @param {string}  payload.model
   * @param {integer} payload.offset
   * @param {integer} payload.limit
   * @param {object}  payload.filter
   * @param {object}  payload.include
   * @param {object}  payload.order
   */
  async getEntity(payload) {
    return (await this.persist.findEntityById(payload)).toJSON()
  }

  async getCollection(payload) {
    const {
      model,
      offset = 0,
      limit = 10,
      query,
      include,
      order
    } = payload

    return await this.control.withinTx(async (t) => {
      const findAllOptions = {
        offset,
        limit,
        transaction: t
      }

      if(query) {
        findAllOptions.where = this.control.sequelizeQuery(this.control.normalizeQuery(query, model))
      }

      if(include) {
        findAllOptions.include = include
      }

      // sort by updated_at desc
      const m = this.persist.getModel(model)
      const attrFields = Object.keys(m.fieldAttributeMap)

      if(order) {
        findAllOptions.order = order
      } else if(attrFields.includes('updated_at')) {
        findAllOptions.order = [['updated_at', 'DESC']]
      }

      findAllOptions.rejectOnEmpty = false

      const rows = await m.findAll(findAllOptions)

      findAllOptions.group = `${m.name}.id`

      const foundCount = await m.count(findAllOptions)

      const count = isArray(foundCount) ? foundCount.length : foundCount

      this.log('Found %s %s', count, model)

      const data = rows.map((row) => row.toJSON())

      return ({ data, count })
    })
  }

  /**
   * @param {object}  payload
   * @param {string}  payload.model
   * @param {string}  payload.id
   * @param {object}  payload.options
   * @param {boolean} payload.options.cascade (default: false)
   */
  async destroyEntity(payload) {
    const {
      id,
      model,
      options
    } = payload

    if(!id) throw new Error('id required')

    return await this.control.withinTx(async (t) => {
      this.log('Attempt to destroy %s with id %s, tx: %s', model, id, t.id)

      const retModel = await this.persist.getModel(model).findByPk(id, { transaction: t })

      const deleted = await retModel.destroy({
        cascade: get(options, 'cascade', false),
        transaction: t
      })

      this.log('Destroyed %s[%s]', model, id)

      this.emitDataEvent(model, 'deleted', { id })

      return deleted
    })
  }

}
