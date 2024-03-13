// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { ReportBase } from './ReportBase.mjs'
import { get } from 'lodash-es'

export class SalesTax extends ReportBase {

  constructor(generator) {
    super(generator, 'sales-tax')
  }

  async generate() {
    const findAllOptions = {
      offset: 0,
      limit: 100000, // we are small
      rejectOnEmpty: false
    }

    if(this.query) {
      findAllOptions.where = this.control.sequelizeQuery(this.control.normalizeQuery(this.query, 'SalesOrder'))
    }

    findAllOptions.order = [['created_at', 'ASC']]

    findAllOptions.include = [{association: 'items'}]

    findAllOptions.transaction = this.t

    const data = await this.getModel('SalesOrder').findAll(findAllOptions)

    let runningValue = 0

    const bulkCreate = []

    for(const o of data) {
      const currency = o.get('currency')
      const tax = get(o, 'tax', 0)

      runningValue += tax
      bulkCreate.push({
        ReportId: this.reportId,
        SalesOrderId: o.get('id'),
        createdAt: o.get('createdAt'),
        currency,
        tax: tax,
        running: runningValue
      })
    }

    const created = await this.getModel('ReportSalesTax').bulkCreate(bulkCreate, { transaction: this.t })

    this.log('Sales tax report created: %s', created)

    return this.reportId
  }

}
