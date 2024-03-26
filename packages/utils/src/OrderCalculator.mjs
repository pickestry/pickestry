// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { get } from 'lodash-es'
import { round } from 'lodash-es'
import { isNil } from 'lodash-es'
import { isArray } from 'lodash-es'
import { displayAmount } from './Currency.mjs'

export class OrderCalculator {

  calculateNet(items = []) {
    return items.reduce((net, item) => net + get(item, 'total', 0), 0)
  }

  calculateTax(items = []) {
    return items.reduce((tax, item) => {
      const total = get(item, 'total', 0)
      const tax1 = get(item, 'tax[0].value')
      const tax2 = get(item, 'tax[1].value')

      let v = 0
      if(total !== 0) {

        if(tax1) {
          v += total * tax1  / 1000000
        }

        if(tax2) {
          v += total * tax2  / 1000000
        }

        v = tax + round(round(v, 2) * 100)
      } else {
        v = tax
      }

      return v
    }, 0)
  }

  calculateTotals(items = []) {
    const net = this.calculateNet(items)
    const tax = this.calculateTax(items)

    return {
      net,
      tax,
      gross: round(net + tax)
    }
  }

  calculateFinal(totals, discounts, shipping) {
    const gross = get(totals, 'gross', 0)

    let finalAmount = gross
    if(isArray(discounts)) {
      for(const discount of discounts) {
        const type = get(discount, 'type')
        const amount = get(discount, 'amount', 0)

        if(type === 'fixed') {
          finalAmount -= amount
        } else if(type === 'percent') {
          finalAmount -= round(gross * amount / 10000)
        }
      }
    }

    if(shipping) {
      finalAmount += get(shipping, 'amount', 0)
    }

    return finalAmount
  }

  displayDiscountAmount(discount, decimal = '.') {
    return `-${ discount.type === 'fixed' ? displayAmount(discount.amount, discount.currency) : this.displayPercent(discount.amount, decimal) }`
  }

  displayPercent(v, decimal = '.') {
    if(isNil(v)) return ''

    const vArr = Array.from(''+ v)
    vArr.splice(vArr.length - 2, 0, decimal)

    return `${vArr.join('')}%`
  }
}

export const orderCalculator = new OrderCalculator()
