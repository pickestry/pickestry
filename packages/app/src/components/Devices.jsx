// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/* eslint-disable no-console */

import * as React from 'react'
import styled from 'styled-components'
import { Alert } from '@pickestry/components'
import { Panel } from '@pickestry/components'
import { H } from '@pickestry/components'
import { List } from '@pickestry/components'
import { Muted } from '@pickestry/components'
import { Switch } from '@pickestry/components'
import { appInvoker } from '../common/appInvoker.mjs'
import { ctrlInvoker } from '../common/ctrlInvoker.mjs'
import { ErrorBoundary } from '@pickestry/components'
import { produce } from 'immer'
import * as c from '../c.mjs'

export const Devices = () => {

  const [errorMessage, setErrorMessage] = React.useState()

  const [data, setData] = React.useState([])

  const startScanner = React.useCallback((id) => {
    appInvoker.startScanner(id)
      .then((res) => {
        console.log('Scanner started!', res)

        setData(produce((draft) => {
          const o = draft.find((o) => o.mid === id)
          o.started = res.started
        }))
      }).catch((error) => {
        console.log('Failed to start scanner', error)
        const errors = error.message.split(':')
        setErrorMessage(errors[errors.length - 1])
      })
  }, [])

  const stopScanner = React.useCallback((id) => {
    appInvoker.stopScanner(id)
      .then((res) => {
        console.log('Scanner stoped', res)
        setData(produce((draft) => {
          const o = draft.find((o) => o.mid === id)
          o.started = res.started
        }))
      })
      .catch((error) => {
        console.log('Failed to stop scanner', error)
        setErrorMessage(errorMessage)
      })
  }, [])

  const onAutostart = React.useCallback((id, autostart) => {
    console.log('autostart: ' + id + ', ' + autostart)
    if(autostart === true) {
      appInvoker.autostartScannerOn(id)
        .then(() => {
          console.log(`${id} will autostart`)
          setData(produce((draft) => { draft[draft.findIndex((o) => o.mid === id)].autostart = true }))
        })
        .catch((error) => { console.log('Failed to turn autostart on', error) })
    } else {
      appInvoker.autostartScannerOff(id)
        .then(() => {
          console.log(`${id} disabled autostart`)
          setData(produce((draft) => { draft[draft.findIndex((o) => o.mid === id)].autostart = false }))
        })
        .catch((error) => { console.log('Failed to turn autostart off', error) })
    }
  }, [])

  React.useEffect(() => {
    appInvoker.getScanners(false)
      .then(setData)
      .catch(console.err)
  }, [])

  React.useEffect(() => {
    function onEvent() {
      appInvoker.getScanners(false)
        .then(setData)
        .catch(console.err)
    }

    window.ipc.on('event', onEvent)

    appInvoker.getScanners(false)
      .then(setData)
      .catch(console.err)

    return function cleanup() {
      window.ipc.off('event', onEvent)
    }
  }, [])

  return (
    <Panel title="Devices" hint="Manage barcode scanners">
      <ErrorBoundary>
        { errorMessage && <Alert type='danger' message={errorMessage} onClose={() => {setErrorMessage()}} /> }
        <List
          data={data}
          renderItem={(o) => {
            return (
              <Line key={o.mid}>
                {o.name} {o.Channel && `- Channel: ${o.Channel.name}`}
                <StyledMuted>{o.mid}</StyledMuted>
                <br />
                <Actions>
                  <H>
                    <H.Item>
                      <H $justifyContent="flex-start">
                        <H.Item><button disabled={o.started} onClick={() => { startScanner(o.mid) }}>Start</button></H.Item>
                        <H.Item><button disabled={!o.started} onClick={() => { stopScanner(o.mid) }}>Stop</button></H.Item>
                        <H.Item>
                          {
                            o.Channel
                              ? (
                                <button onClick={() => {
                                  if(window.confirm('Deactivate?')) {
                                    ctrlInvoker.unlinkDevice({id: o.mid})
                                  }
                                }
                                }>Deactivate</button>
                              ) : (
                                <button onClick={() => { appInvoker.showDialog(c.DLG_ACTIVATE_DEVICE, { id: o.mid, name: o.name }) }}>Activate</button>
                              )
                          }
                        </H.Item>
                      </H>
                      </H.Item>
                      <H.Item>
                        <div className="autostart-switch">
                          <H $justifyContent="flex-start">
                            <H.Item style={{paddingTop: '2px'}}>Autostart:</H.Item>
                            <H.Item style={{marginRight: '6px'}}><Switch name="autostart" onChange={(v) => {onAutostart(o.mid, v)}} checked={o.autostart} /></H.Item>
                          </H>
                        </div>
                      </H.Item>
                  </H>
                </Actions>
              </Line>
            )
          }}
        />
      </ErrorBoundary>
    </Panel>
  )
}

const Line = styled.div`
  background-color: ${({theme: { palette: { primary } }}) => primary.lighter};
  padding: 4px;
  border-radius: 4px;
`

const Actions = styled.div`
  margin-top: 18px;
`

const StyledMuted = styled(Muted)`
  float: right;
`
