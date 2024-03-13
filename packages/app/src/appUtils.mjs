// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import fs from 'node:fs/promises'
import { default as byteSize } from 'byte-size'

export class AppUtils {

  #dataDir

  constructor({dataDir} = {}) {
    if(!dataDir) throw new Error('data directory required')
    this.#dataDir = dataDir
  }

  async storageStatus(plain = false) {
    const stats = await fs.lstat(this.#dataDir)

    const {
      mode,
      size
    } = stats

    const type = stats.isDirectory() ? 'directory' : 'file'

    if(plain) {
      return {
        type,
        mode,
        size
      }
    } else {

      return {
        type,
        mode,
        size: `${byteSize(size)}`
      }
    }
  }

}

