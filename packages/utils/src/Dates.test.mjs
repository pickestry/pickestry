// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { beforeEach } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { dates } from './Dates.mjs'

/* 1/16/2024 */
const UNIX_TIME = 1705429144081

describe('Test Dates', () => {

  beforeEach(() => {
    dates.reset()
  })

  it('should format by default', () => {
    assert.equal(dates.display(new Date(UNIX_TIME)), '16/01/2024')
  })

  it('should display with time', () => {
    assert.equal(dates.displayWithTime(new Date(UNIX_TIME)), '16/01/2024, 13:19 EST')
  })

  it('should change locale', () => {
    dates.configure({locale: 'el-GR'})
    assert.equal(dates.display(new Date(UNIX_TIME)), '16/01/2024')
  })

  it('should display with time', () => {
    dates.configure({locale: 'el-GR'})
    assert.equal(dates.displayWithTime(new Date(UNIX_TIME)), '16/01/2024, 20:19 EET')
  })

  it('should return the locale', () => {
    dates.configure({locale: 'el-GR'})
    assert.deepEqual(dates.timezones, ['Europe/Athens'])
  })

  const AV_FORMATS = {
    'DD-MM-YYYY': '16-01-2024',
    'MM-DD-YYYY': '01-16-2024',
    'YYYY-MM-DD': '2024-01-16',
    'DD/MM/YYYY': '16/01/2024',
    'MM/DD/YYYY': '01/16/2024',
  }

  for(const [dateFormat, v] of Object.entries(AV_FORMATS)) {
    it(`should use format ${dateFormat}`, () => {
      dates.configure({ dateFormat })
      assert.equal(dates.display(new Date(UNIX_TIME)), v)
    })
  }

  it('should throw on unknown format', () => {
    assert.throws(() => {
      dates.configure({ dateFormat: 'foo-bar' })
    }, {
      name: 'Error',
      message: 'date format not supported'
    })
  })
})
