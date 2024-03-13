// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from './Utils.mjs'

describe('Test Pipelines', () => {

  /**
   * Provided jobs with the following order, re-order in the following
   * order: job2, job5, job1, job3, job4
   *
   */
  it('sort jobs', async () => {
    const sorted = utils.sortJobs([
      {
        id: 1,
        name: 'Job 1',
        after: 3
      }, {
        id: 2,
        name: 'Job 2',
        after: 5
      }, {
        id: 3,
        name: 'Job 3',
        after: 4
      }, {
        id: 4,
        name: 'Job 4'
      }, {
        id: 5,
        name: 'Job 5',
        after: 1
      }
    ])

    const expectedOrder = [2, 5, 1, 3, 4]

    for(let idx = 0; idx !== expectedOrder.length; idx++) {
      assert.equal(sorted[idx].id, expectedOrder[idx])
    }
  })

  it('should work with one element', async () => {
    const sorted = utils.sortJobs([{
      id: 3,
      name: 'Job 3'
    }])

    assert.equal(sorted[0].id, 3)
  })

  it('should work with one element and after', async () => {
    const sorted = utils.sortJobs([{
      id: 3,
      name: 'Job 3',
      after: 1
    }])

    assert.equal(sorted[0].id, 3)
  })


  it('should work with multiple elements and no after', async () => {
    const sorted = utils.sortJobs([{
      id: 1,
      name: 'Job 1'
    },{
      id: 3,
      name: 'Job 3'
    }, {
      id: 2,
      name: 'Job 2'
    }])

    assert.equal(sorted[0].id, 1)
    assert.equal(sorted[1].id, 3)
    assert.equal(sorted[2].id, 2)
  })

  // it('should work with multiple elements and one after', async () => {
  //   const sorted = utils.sortJobs([{
  //     id: 1,
  //     name: 'Job 1'
  //   },{
  //     id: 3,
  //     name: 'Job 3',
  //     after: 1
  //   }, {
  //     id: 2,
  //     name: 'Job 2'
  //   }])

  //   console.log(sorted)

  //   assert.equal(sorted[0].id, 3)
  //   assert.equal(sorted[1].id, 2)
  //   assert.equal(sorted[2].id, 1)
  // })

})
