// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { set } from 'lodash-es'
import { produce } from 'immer'
import { useMergeRefs } from '@floating-ui/react'
import { TextInput } from './TextInput.jsx'

export const Metadata = React.forwardRef(({
    testid = 'metadata',
    name,
    value = {},
    onChange,
    disabled = false
  }, ref) => {

  const [key, setKey] = React.useState('')

  const [val, setVal] = React.useState('')

  const keyRef = React.useRef()

  const valRef = React.useRef()

  const mRefs = useMergeRefs([ref, keyRef])

  const onAdd = React.useCallback((e) => {
    e.preventDefault()

    if(key.trim() === '') {
      keyRef.current?.focus()
    } else {
      onChange(produce(value, (draft) => {
        draft[key] = val
      }))
      setKey('')
      setVal('')


      set(keyRef, 'current.value', '')
      set(valRef, 'current.value', '')
      keyRef.current?.focus()
    }
  }, [key, val])

  const entries = React.useMemo(() => Object.keys(value).map(key => ({ key, value: value[key] })), [value])

  return (
    <Root data-testid={testid}>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            entries.map(({key, value}) => (
              <tr key={key} onFocus={() => { /* console.log('onFocus: ', e) */ }} tabIndex={0}>
                <td>{key}</td>
                <td>{value}</td>
                <td></td>
              </tr>
            ))
          }
          <tr key='entry'>
            <td>
              <TextInput
                ref={mRefs}
                name={`${name}-key`}
                value={key}
                onChange={(v) => { setKey(v || '') }}
                disabled={disabled}
              />
            </td>
            <td>
              <form onSubmit={onAdd}>
                <TextInput
                  ref={valRef}
                  name={`${name}-value`}
                  value={val}
                  onChange={(v) => { setVal(v || '') }}
                  disabled={disabled}
                />
              </form>
            </td>
            <td><button onClick={onAdd}>Add</button></td>
          </tr>
        </tbody>
      </Table>
    </Root>
  )
})

const Root = styled.div`
`

const Table = styled.table`
`

Metadata.displayName = 'Metadata'
