// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { parse } from 'smol-toml'
import { stringify } from 'smol-toml'
import fs from 'node:fs/promises'
import path from 'node:path'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { isEmpty } from 'lodash-es'

export class Config {

  #tree

  #file

  /**
   * @param {string} file A path pointing to the configuration file.
   *                      This is mutually exlusive with dir.
   *
   */
  async init(file) {
    if(!file) throw new Error('configuration file required')

    this.#file = path.resolve(file)

    try {
      const content = await fs.readFile(this.#file, 'utf8')
      this.#tree = parse(content)
    } catch(error) {
      throw new Error('failed to initialize configuration', { cause: error })
    }
  }

  async save() {
    try {
      const content = stringify(this.#tree)

      await fs.writeFile(this.#file, content)
    } catch(error) {
      throw new Error('failed to save configuration', { cause: error })
    }
  }

  get(propPath) {
    if(isEmpty(this.#tree)) console.log('Warning: is configuration loaded?')  // eslint-disable-line no-console

    return get(this.#tree, propPath)
  }

  set(propPath, value) {
    set(this.#tree, propPath, value)
  }

  get tree() {
    return this.#tree
  }

  get file() {
    return this.#file
  }

  toJSON() {
    return JSON.stringify(this.#tree)
  }

  debug() {
    console.log('-- Configuration --')  // eslint-disable-line no-console
    console.log('file: ', this.#file)  // eslint-disable-line no-console
    console.log('tree: ', JSON.stringify(this.tree, null, 2))  // eslint-disable-line no-console
  }
}

export const config = new Config()
