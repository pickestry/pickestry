// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Alert } from '@pickestry/components'
import { get } from 'lodash-es'

export const Alerts = () => {

  const [message, setMessage] = React.useState()

  React.useEffect(() => {
    function onError(_e, args) {
      setMessage(get(args, '[0].message'))
    }

    window.ipc.on('error', onError)

    return function cleanup() {
      window.ipc.off('error', onError)
    }
  }, [])

  return message && (
    <Alert message={message} type='danger' onClose={() => {setMessage()}} />
  )
}
