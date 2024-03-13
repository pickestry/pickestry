import * as React from 'react'
import { head } from 'lodash-es'
import { get } from 'lodash-es'
import { isArray } from 'lodash-es'
import { compact } from 'lodash-es'

export const useOnEvent = (on, cb) => {
  const finalOn = compact(isArray(on) ? on : [on])

  if(finalOn.length === 0) throw new Error('invalid type')

  function onEvent(_e, args) {
    const a = head(args)
    const type = get(a, 'type')
    const data = get(a, 'data')

    if(finalOn.includes(type))
      cb.apply(null, [data, type])
  }

  React.useEffect(() => {
    window.ipc.on('event', onEvent)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [])
}
