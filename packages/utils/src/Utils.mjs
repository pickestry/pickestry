// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { produce } from 'immer'
import { isNil } from 'lodash-es'

export class Utils {

  sortJobs(jobs = []) {
    return produce(jobs, (draft) => {

      const sorted = []

      let safeCounter = 10

      const totalLen = draft.length

      let checkIdx = draft.length

      let checking

      while(true) { // eslint-disable-line no-constant-condition

        if(checkIdx)
          checking = draft.at(checkIdx)

        for(let i = (draft.length - 1); i >= 0; i--) {
          const v = draft.at(i)

          if(isNil(v.after) && !checking) {
            draft.splice(draft.length, 0, v)
            draft.splice(i, 1)
            checkIdx = (draft.length - 1)
            break
          } else if(checking && checking.id !== v.id) {
            if(v.after == checking.id) {
              draft.splice(checkIdx, 0, v)
              draft.splice(i, 1)
              checkIdx--
              break
            }
          }
        }

        if((sorted.length === totalLen) || (safeCounter-- <= 0)) {
          break
        }
      }
    })
  }

  devOnly(o) {
    return __DEV__ ? JSON.stringify(o, null, 2) : undefined
  }
}

export const utils = new Utils()
