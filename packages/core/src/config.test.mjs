// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'
import { dirname } from './misc.mjs'
import { Config } from './config.mjs'

const __dirname = dirname(import.meta.url)

describe('Test config', () => {

  it('Should init', async () => {
    const cfg = new Config()
    await cfg.init(path.join(__dirname, './sample-test.toml'))

    assert.deepEqual(cfg.tree, {
      main: { title: 'Pickestry' },
      ui: {
        windows: {
          minHeight: 900,
          minWidth: 1300
        }
      }
    })
  })
})
