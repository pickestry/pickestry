// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Op } from 'sequelize'

export class QueryAdaptor {

  static convert(q) {
    const wc = []

    for(const [name, opAndValue] of Object.entries(q)) {
      for(const [op, value] of Object.entries(opAndValue)) {
        switch(op) {
        case 'includes': {
          wc.push({[name]: {[Op.substring]: value}})
          break
        }
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
        case 'eq': {
          wc.push({[name]: {[Op[op]]: value}})
          break
        }
        case 'neq': {
          wc.push({[name]: {[Op.ne]: value}})
          break
        }
        case 'has': {
          wc.push({[name]: {[Op.gt]: 0}})
          break
        }
        case 'hasnot': {
          wc.push({[Op.or]: [{[name]: {[Op.is]: null}}, {[name]: {[Op.eq]: 0}}]})
          break
        }
        case 'between': {
          wc.push({[name]: { [Op.between]: value }})
          // wc.push({
          //   [Op.and]: [{
          //     [name]: {
          //       [Op.gte]: head(value)
          //     }
          //   }, {
          //     [name]: {
          //       [Op.lte]: last(value)
          //     }
          //   }]
          // })
          break
        }
        case 'in': {
          wc.push({[name]: { [Op.in]: value }})
          break
        }
        default: console.log('Warning: cannot handle:', name, op, value) // eslint-disable-line no-console
        }
      }
    }

    return wc
  }
}
