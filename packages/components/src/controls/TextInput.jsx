// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import styled from 'styled-components'
import { cssInput } from '../core/index.mjs'
import { useMergeRefs } from '@floating-ui/react'
import { isFunction } from 'lodash-es'
import { isInteger } from 'lodash-es'
import classnames from 'classnames'

export const TextInput = React.forwardRef(({
    name,
    value,
    max,
    width = '158px',
    error: errorProp,
    form,
    autoFocus = false,
    onChange,
    disabled = false
  }, ref) => {

  const inputRef = React.useRef(null)

  const [error, setError] = React.useState(errorProp)

  const [chars, setChars] = React.useState(0)

  const info = React.useMemo(() => {
    let msg = ''
    if(max && max > 0 && isInteger(max) && max < Number.MAX_SAFE_INTEGER) {
      msg += `${chars}/${max}`
    }

    return msg
  }, [max, chars])

  const validLen = React.useCallback((v) => {
    if(v && max) {
      return v.length <= max
    }

    return true
  }, [max])

  const onBeforeInput = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0

    const v = Array.from(e.currentTarget.value)

    v.splice(start, end, e.data)

    if(!validLen(v.join(''))) {
      ee.target.classList.add('error')

      setTimeout(() => {ee.target.classList.remove('error')}, 300)

      e.preventDefault()

      return
    }
  }, [validLen])

  const onChangeInner = React.useCallback((e) => {
    setError(undefined)

    setChars(e.currentTarget.value.length)

    if(isFunction(onChange)) {
      onChange(e.currentTarget.value)
    }
  }, [onChange])

  const mRefs = useMergeRefs([ref, inputRef])

  const finalValue = React.useMemo(() => {
    if(value) {
      if(inputRef.current) {
        inputRef.current.value = value
      }

      setChars(value.length)

      return value
    }
  }, [value])

  return (
    <Root width={width} data-testid={`textinput-${name}-root`} className={classnames({'with-info': info, error})}>
      <StyledTextInput
        data-testid={`textinput-${name}-input`}
        key={`${name}`}
        ref={mRefs}
        name={name}
        width={width}
        onBeforeInput={onBeforeInput}
        onChange={onChangeInner}
        defaultValue={finalValue}
        autoCorrect='no'
        autoComplete='off'
        autoFocus={autoFocus}
        form={form}
        disabled={disabled} />
        { info && <Info data-testid={`textinput-${name}-info`}>{info}</Info> }
        { error && <Error data-testid={`textinput-${name}-error`}>{error}</Error> }
    </Root>
  )
})

const Root = styled.div`
  position: relative;
  width: ${({width}) => width};

  &.with-info > input {
    margin-bottom: 0;
  }

  &.error > input {
    border-color: ${({ theme: { palette } }) => palette.danger.main};
  }
`

const StyledTextInput = styled.input`
  ${cssInput}
  // letter-spacing: 2px;
  width: ${({width = '158px'}) => width};
  text-align: left;
  z-index: 10;
`

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
  margin-top: -4px;
`

const Info = styled.div`
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.textMuted};
  text-align: right;
`

TextInput.displayName = 'TextInput'
