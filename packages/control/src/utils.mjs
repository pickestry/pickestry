// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import fs from 'node:fs'
import { rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import delay from 'delay'
import { Control } from './Control.mjs'
import { controls as controlBundle } from './controls/index.mjs'
import { TriggerHandler } from './triggers/index.mjs'

const __dirname = import.meta.dirname

class TestUtils {

  async initCustom({
    controls = [],
    useMemory = true,
    dataLogging = false,
    skipSeed = false,
    db,
    settings = {}
  } = {}) {
    if(useMemory) {
      const control = new Control()
      await control.init({
        controls,
        dataDir: ':memory:',
        dataLogging,
        settings
      })

      if(skipSeed === false){
        await control.seed()
      }

      return [control, async () => await control.cleanup()]
    } else {
      const dataDir = db || fs.mkdtempSync(path.join(os.tmpdir(), 'pk-'))

      const control = new Control()
      await control.init({
        controls,
        dataDir,
        dataLogging,
        settings
      })

      if(skipSeed === false){
        await control.seed()
      }

      return [control, () => rm(dataDir, { recursive: true, force: true })]
    }
  }

  async init(...controls) {
    const [control, cleanup] = await this.initCustom({ controls, useMemory: true })

    control.__cleanup = cleanup

    return control
  }

  async initAllWithTrigger(TriggerClass, settings = {}) {
    const control = await this.init(...controlBundle)
    control.setSettings(settings)

    const handler = new TriggerHandler()
    handler.addTrigger(new TriggerClass(control))

    control.__triggerHandler = handler

    return control
  }

  async delay(n) {
    return await delay(n)
  }

  pack(...fn) {
    return fn
  }

  async checkFile(blob, targetFile, first = false) {
    if(!targetFile) throw new Error('target required')

    if(!blob) throw new Error('blob required')

    if(first === true) {
      const saveFile = path.resolve(targetFile)
      fs.writeFileSync(saveFile, Buffer.from(await blob.arrayBuffer()))
      console.log('Saved: ', saveFile) // eslint-disable-line no-console

      return true
    } else {
      const targetBuf = fs.readFileSync(path.join(__dirname, '.test', targetFile))
      const sourceBuf = Buffer.from(await blob.arrayBuffer())

      return targetBuf.equals(sourceBuf)
    }
  }
}

export const utils = new TestUtils()
