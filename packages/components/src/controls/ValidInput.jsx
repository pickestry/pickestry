// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { useMergeRefs } from '@floating-ui/react'
import styled from 'styled-components'
import { produce } from 'immer'
import { isNil } from 'lodash-es'
import { isString } from 'lodash-es'
import { get } from 'lodash-es'
import classnames from 'classnames'
import { cssInput } from '../core/index.mjs'
import { ClearLink } from '../misc/index.mjs'
import { Busy } from '../Busy.jsx'

let TMOUT

const TMOUT_DELAY = 300 // ms

export const ValidInput = React.forwardRef(({
  testid = 'valid-input',
  name,
  value,
  error: errorFromProps,
  disabled = false,
  acceptText = 'Accept',
  onCheck,
  onAccept,
  onRemove
}, ref) => {

  const inputRef = React.useRef()

  const [state, setState] = React.useState({
    v: '',
    valid: true,
    message: errorFromProps
  })

  const [busy, setBusy] = React.useState(false)

  const onChangeInner = React.useCallback((e) => {
    const v = e.target.value

    if(v?.trim() === '') return

    clearTimeout(TMOUT)
    TMOUT = setTimeout(() => {
      setBusy(true)
      onCheck(v)
      .then(({ valid, message }) => {
        setState(produce((draft) => {
          draft.v = v
          draft.valid = valid
          draft.message = message
        }))
      })
      .finally(() => { setBusy(false) })
    }, TMOUT_DELAY)

    // check if valid?
  }, [onCheck])

  const onRemoveInner = React.useCallback(() => {
    setBusy(true)
    onRemove()
      .then(({ valid, message }) => {
        setState(produce((draft) => {
          if(valid)
            draft.v = ''
          draft.valid = valid
          draft.message = message
        }))
      })
      .finally(() => { setBusy(false) })
  }, [name])

  const hasValue = React.useMemo(() => !isNil(value), [value])

  const error = React.useMemo(() => get(state, 'message'), [state])

  const v = React.useMemo(() => {
    return state.v
  }, [state])

  const onAcceptInner = React.useCallback(() => {
    onAccept(v)
  }, [v])

  const canAccept = React.useMemo(() => {
    if(busy) return false

    const blankV = isString(state.v) && state.v.trim() === ''

    return state.valid && !blankV && !state.message
  }, [state, busy])

  const mRefs = useMergeRefs([ref, inputRef])

  return (
    <Root data-testid={`${testid}-root`} className={classnames({error})}>
      {
        hasValue ? (
          <Readonly>
            <Value>{ value }</Value>
            <ClearLink data-testid={`${testid}-remove`} tabIndex={0} className='remove' title="Remove" onClick={(e) => { e.preventDefault(); onRemoveInner() }}>clear</ClearLink>
          </Readonly>
        ) : (
          <InputRoot>
            <Input ref={mRefs} data-testid={`${testid}-input`} name={name} onChange={onChangeInner} disabled={disabled} />
            <BusyWrapper>
              <Busy testid={`${testid}-busy`} busy={busy} />
            </BusyWrapper>
            <Accept data-testid={`${testid}-accept`} type='button' disabled={!canAccept} onClick={onAcceptInner}>{acceptText}</Accept>
          </InputRoot>
        )
      }
      { error && <ErrorDisplay data-testid={`${testid}-error`}>{error}</ErrorDisplay> }
    </Root>
  )

})

const Root = styled.div`
  width: ${({width}) => width};

  &.with-info > input {
    margin-bottom: 0;
  }

  &.error > input {
    border-color: ${({ theme: { palette } }) => palette.danger.main};
  }
`

const Readonly = styled.span`
  display: flex;
`

const Value = styled.span`
  padding-top: 4px;
`

const InputRoot = styled.div`
  display: flex;
`

const Input = styled.input.attrs({
  type: 'text'
})`
  ${cssInput}
`

const BusyWrapper = styled.div`
  display: block;
  position: absolute;
  right: 93px;
  padding-top: 10px;
`

const Accept = styled.button.attrs({ type: 'button' })`
  margin-left: 8px;
`

const ErrorDisplay = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
  margin-top: 4px;
`

ValidInput.displayName = 'ValidInput'
