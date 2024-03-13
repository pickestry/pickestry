// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseControl } from '../BaseControl.mjs'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { omit } from 'lodash-es'
import { isEmpty } from 'lodash-es'
import { schema } from '@pickestry/defs'
import { dates } from '@pickestry/utils'
import { displayAmount } from '@pickestry/utils'
import { PDFTables } from '../lib/PDFTables.mjs'


export class PDFControl extends BaseControl {

  static NAME = 'pdf'

  async init() {
  }

  async printCollectionPDF(payload) {
    this.validate(payload, PDF_COLLECTION_SCHEMA)

    const {
      model,
      query,
      include,
      order
    } = payload


    const type = schema.findTypeByModel(model)

    return await this.withinTx(async (t) => {
      const findAllOptions = {
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

      //
      const total = await this.control.persist.getModel(model).count(omit(findAllOptions, 'include'))

      this.log('Found %s records', total)

      const MAX_RECORDS = 1000000
      const BATCH_SIZE = 100

      set(findAllOptions, 'limit', BATCH_SIZE)

      const ALL_DATA = []

      for(let offsetCount = 0; offsetCount < MAX_RECORDS; offsetCount += BATCH_SIZE) {
        set(findAllOptions, 'offset', offsetCount)

        this.log('%O', findAllOptions)

        try {
          const data = await this.persist.getModel(model).findAll(findAllOptions)

          for(const o of data) {
            this.log('-> %O', o)

            const type = schema.findTypeByModel(model)
            const colDef = schema.getPDFDefs(type)

            const entry = {}

            if(colDef) {
              for(const col of colDef) {
                const p = col.path || col.name
                let v
                if(col.type === 'currency') {
                  const vv = o.get(p)
                  v = displayAmount(vv.value, vv.iso)
                } else if(col.type === 'date') {
                  v = dates.displayWithTime(o.get(p))
                } else if(p.includes('.')) {
                  v = get(o, `dataValues.${p}`)
                } else {
                  v = get(o, p)
                }

                set(entry, col.displayName, v)
              }
            }

            if(!isEmpty(entry)) {
              ALL_DATA.push(entry)
            }
          }
        } catch(error) {
          this.log('Error fetching data: %O', error)
          break
        }
      }

      const doc = new PDFTables({ defs: schema.getPDFDefs(type) })

      const blob = await doc.writeData(ALL_DATA)

      const pdfFile = await blob.arrayBuffer()

      return {
        content: pdfFile,
        type: 'application/pdf',
        name: `collection_${type}.pdf`
      }
    })
  }

}

const PDF_COLLECTION_SCHEMA = {
  type: 'object',
  properties: {
    model: {
      type: 'string'
    },
    query: {
      type: 'object'
    },
    include: {
      type: 'array'
    },
    order: {
      type: 'array'
    }
  },
  required: [ 'model' ]
}
