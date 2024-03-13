// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { orderCalculator } from './OrderCalculator.mjs'

describe('orderCalculator', () => {

  it('Should calculate net', () => {
    const ITEMS = [{total: 100}, { total: 322 }]

    const net = orderCalculator.calculateNet(ITEMS)

    assert.equal(net, 422)
  })

  it('Should calculate taxes', () => {
    const ITEMS = [
      {
        price: 120,
        tax: [{ value: 1300 }],
        currency: 'cad'
      }, {
        price: 33329,
        tax: [{ value: 800 }],
        currency: 'cad'
      }
    ]

    const tax = orderCalculator.calculateTax(ITEMS)

    assert.equal(tax, 0)
  })

  it('Should calculate taxes with more than one taxes', () => {
    const ITEMS = [
      {
        price: 298,
        tax: [{ value: 1300 }, { value: 500 }],
        currency: 'usd'
      }, {
        price: 4559,
        tax: [{ value: 1300 }],
        currency: 'usd'
      }
    ]

    const tax = orderCalculator.calculateTax(ITEMS)

    assert.equal(tax, 0)
  })

  it('Should calcuate totals', () => {
    const ITEMS = [
      {
        price: 298,
        tax: [{ value: 1300 }],
        qty:8,
        total: 300,
        currency: 'usd'
      }, {
        price: 25598,
        tax: [{ value: 1300 }],
        qty:50,
        total: 799,
        currency: 'usd'
      }
    ]

    const totals = orderCalculator.calculateTotals(ITEMS)

    assert.deepEqual(totals, {
      net: 1099,
      tax: 143,
      gross: 1242
    })
  })

  it('Should calculate taxes when one line has tax rates and others dont', () => {
    const ITEMS = [
      {
        price: 298,
        tax: [{ value: 1300 }],
        qty:8,
        total: 300
      }, {
        price: 0,
        currency: 'cad',
        qty: 50,
        total: 799
      }
    ]

    const totals = orderCalculator.calculateTotals(ITEMS)

    assert.deepEqual(totals,  {
      net: 1099,
      tax: 39,
      gross: 1138
    })
  })

  it('should calculate discounts', () => {
    const ITEMS = [
      {
        price: 298,
        currency: 'usd',
        tax: [{ value: 1300 }],
        qty:8,
        total: 300
      }, {
        price: 25598,
        currency: 'usd',
        tax: [{ value: 1300 }],
        qty:50,
        total: 799
      }
    ]

    const totals = orderCalculator.calculateTotals(ITEMS)

    const discounts = [{
      type: 'fixed',
      amount: 90,
      currency: 'usd'
    }, {
      type: 'percent',
      amount: '100'
    }]

    const final = orderCalculator.calculateFinal(totals, discounts)

    assert.equal(final, 1140)
  })

})
