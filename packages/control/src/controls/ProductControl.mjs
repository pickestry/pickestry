// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseControl } from '../BaseControl.mjs'
import { pick } from 'lodash-es'

export class ProductControl extends BaseControl {

  static NAME = 'product'

  async addPart({
    id,
    partId,
    qty
  }) {
    this.log('Add %s of part: %s to product: %s', qty, partId, id)

    if(!id) throw new Error('product id required')

    if(!partId) new Error('part id required')

    if(id == partId) new Error('cannot use itself as part')

    return await this.withinTx(async (t) => {
      const p = await this.persist.findEntityById({
        model: 'Product',
        id,
        include: [{ association: 'parts' }]
      }, { transaction: t })

      const part = await this.persist.findEntityById({
        model: 'Product',
        id: partId
      })

      const [productPart, other] = await p.addPart(part, {
        through: { qty },
        transaction: t
      })

      this.log('Part added: %j', productPart)

      this.log('Other: %O', other)

      const json = p.toJSON()

      this.emitDataEvent('product', 'updated', pick(json, ['id', 'name']))

      return json
    })
  }

  /**
   * Remove a part from a product.
   *
   * @throws When part not found
   */
  async removePart({
    id,
    partId
  }) {
    this.log('Remove part %s from product %s', partId, id)

    if(!id) throw new Error('product id required')

    if(!partId) throw new Error('part id required')

    return await this.withinTx(async (t) => {
      const p = await this.persist.findEntityById({
        model: 'Product',
        id,
        include: [{ association: 'parts' }]
      }, { transaction: t })

      const r = await p.removePart(partId, { transaction: t })

      this.log('Part removed: %s', r)

      if(r === 0) throw new Error('unknown part')

      const json = p.toJSON()

      this.emitDataEvent('product', 'updated', pick(json, ['id', 'name']))

      return json
    })
  }

  /**
   * Create a product variant
   */
  async createVariant(payload) {
    this.log('Create variant: %O', payload)

    const {
      id,
      variant
    } = payload

    if(!id) throw new Error('product id required')

    return await this.withinTx(async (t) => {
      const p = await this.persist.findProductByPk(id, { transaction: t })

      const name = this.persist.models.Product.buildName(p.name, variant)

      // use products unit
      const unit = p.unit

      const pv = await this.persist.createProduct({
        name,
        unit,
        variant,
        ParentProductId: id
      }, { transaction: t })

      const json = pv.toJSON()

      this.emitDataEvent('product', 'created', pick(json, ['id', 'name']))

      return json
    })
  }

  async savePackage(payload) {
    this.validate(payload, SAVE_PACKAGE_SCHEMA)

    const {
      product: id,
      name,
      count
    } = payload

    return await this.withinTx(async (t) => {
      const product = await this.persist.findProductByPk(id, { transaction: t })

      const pkgName = name || `${count} ${product.name}`

      const pkg = await this.persist.createPackage({ name: pkgName }, { transaction: t })

      await pkg.addProduct(product, {
        through: { count },
        transaction: t
      })

      const json = pkg.toJSON()

      this.emitDataEvent('package', 'created', pick(json, ['id', 'name']))

      return json
    })
  }
}

const SAVE_PACKAGE_SCHEMA = {
  type: 'object',
  properties: {
    product: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    name: {
      type: 'string',
      description: 'A name that describes this package'
    },
    count: {
      type: 'number',
      multipleOf: 1
    }
  }
}
