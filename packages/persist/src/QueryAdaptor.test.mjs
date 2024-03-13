// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { QueryAdaptor } from './QueryAdaptor.mjs'
import { Op } from 'sequelize'

describe('QueryAdaptor', () => {

  it('converts includes', () => {
    const q = {name: {includes: 'Geor'}}

    assert.deepEqual(QueryAdaptor.convert(q)[0], {name: {[Op.substring]: 'Geor'}})
  })

  it('converts eq', () => {
    const q = {age: {eq: 18}}

    assert.deepEqual(QueryAdaptor.convert(q)[0], {age: {[Op.eq]: 18}})
  })

  it('converts neq', () => {
    const q = {status: {neq: 'active'}}

    assert.deepEqual(QueryAdaptor.convert(q)[0], {status: {[Op.ne]: 'active'}})
  })

  it('converts eq, lt, lte, gt, gte', () => {
    const q = {
      status: {eq: 'active'},
      age: {
        gt: 18,
        lt: 20
      },
      created: {
        gte: 1702765650100,
        lte: 1702765650565
      }
    }

    assert.deepEqual(QueryAdaptor.convert(q), [
      { status: { [Op.eq]: 'active' } },
      { age: { [Op.gt]: 18 } },
      { age: { [Op.lt]: 20 } },
      { created: { [Op.gte]: 1702765650100 } },
      { created: { [Op.lte]: 1702765650565 } }
    ])
  })
})
