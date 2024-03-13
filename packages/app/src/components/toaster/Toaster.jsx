// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { head } from 'lodash-es'
import { get } from 'lodash-es'
import { capitalCase } from 'case-anything'
import { cssEllipsis } from '@pickestry/components'
import { cssNoSelect } from '@pickestry/components'

const CLOSE_DELAY = 2000 // 2 sec

let TMOUT

export const Toaster = () => {

  const [message, setMessage] = React.useState()

  const [show, setShow] = React.useState(false)

  const addMessage = React.useCallback((message) => {
    setMessage(message)
  }, [])

  React.useEffect(() => {
    function onEvent(_e, data) {

      const ev = head(data)

      const [object, action] = ev.type.split('.')

      const o = capitalCase(object.split('_').join(' '))

      const tryName = get(ev.data, 'name')

      const tryRefNum = get(ev.data, 'refNum')

      const tryId = get(ev.data, 'id')


      const id = tryName || tryRefNum || tryId

      let msg = '-'
      if(ev.data) {
        msg = `${o} ${id} ${action}`
      }

      addMessage(msg)
      setShow(true)

      clearTimeout(TMOUT)
      TMOUT = setTimeout(() => {
        setMessage('')
        setShow(false)
      }, CLOSE_DELAY)
    }

    window.ipc.on('event', onEvent)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [addMessage])

  return show && (
    <Popup title={message}>
      {message}
    </Popup>
  )
}

const Popup = styled.div`
  position: fixed;
  bottom: 30px;
  left: 30px;
  color:  ${({ theme: { palette: { success } } }) => success.main};
  background: ${({ theme: { palette: { success } } }) => success.lighter};
  border: 1px solid  ${({ theme: { palette: { success } } }) => success.light};;
  border-radius: 4px;
  padding: 8px;
  max-width: calc(40vw);
  max-height: 70px;
  ${ cssEllipsis }
  ${ cssNoSelect }
`
