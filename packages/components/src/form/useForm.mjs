// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { FormContext } from './FormContext.jsx'

export function useForm(config = {}) {

  const {
    id,
    entity = {}
  } = config

  const ctx = React.useContext(FormContext)

  React.useEffect(() => {
    if(id) ctx.init(id, entity)

    return function cleanup() {
      if(id) {
        ctx.resetContext(id)
     }
    }
  }, [])

  return ctx
}
