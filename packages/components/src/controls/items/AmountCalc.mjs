// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { get } from 'lodash-es'

export class AmountCalc {

  calculateTotal(item) {
    const amount = get(item, 'amount', 0)
    const qty = get(item, 'qty', 1)

    return amount * qty
  }
}

export const amountCalc = new AmountCalc()
