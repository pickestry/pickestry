// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseControl } from '../BaseControl.mjs'
import { ReportGenerator } from '../lib/ReportGenerator.mjs'

export class ReportControl extends BaseControl {

  static NAME = 'report'

  async init() {
  }

  async generateReport(payload) {
    this.log('Generate report: %j', payload)

    const {
      name,
      type,
      query
    } = payload

    return await this.withinTx(async (t) => {
      const gen = new ReportGenerator({
        transaction: t,
        control: this.control
      })

      gen.start(type)
        .setName(name)
        .setQuery(query)

      const reportId = await gen.generate()

      this.emitDataEvent('report', 'generated', { type, name })

      return reportId
    })
  }
}
