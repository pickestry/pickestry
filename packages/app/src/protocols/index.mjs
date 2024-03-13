import { localFile } from './local.mjs'
import { protocol } from 'electron'
import { createLogger } from '@pickestry/core'

const log = createLogger()

class Protocols {

  async init() {
    const localFilesRegistered = protocol.registerFileProtocol('local', localFile)
    log('Register protocol-local: %s', localFilesRegistered)
  }
}

export const protocols = new Protocols()
