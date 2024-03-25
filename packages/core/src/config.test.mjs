// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { beforeEach } from 'node:test'
import { dirname } from './misc.mjs'
import { Config } from './config.mjs'

const __dirname = dirname(import.meta.url)

describe('Test config', () => {

  let cfg

  beforeEach(async () => {
    cfg = new Config()
    await cfg.init(path.join(__dirname, './sample-test.toml'))
  })

  it('should init', async () => {
    assert.deepEqual(cfg.tree, {
      main: {
        title: 'Pickestry',
        updateEnabled: false
      },
      ui: {
        windows: {
          minHeight: 900,
          minWidth: 1300
        }
      }
    })
  })

  it('should get value', async () => {
    const cfg = new Config()
    await cfg.init(path.join(__dirname, './sample-test.toml'))

    assert.equal(cfg.get('main.title'), 'Pickestry')
  })

  it('should get boolean', () => {
    assert.equal(cfg.get('main.updateEnabled'), false)
  })

  it('should get number', () => {
    assert.equal(cfg.get('ui.windows.minHeight'), 900)
  })
})
