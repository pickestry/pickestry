// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import styled from 'styled-components'
import { cssInputBase } from '../core/index.mjs'
import { useMergeRefs } from '@floating-ui/react'
import { isFunction, isInteger } from 'lodash-es'
import classnames from 'classnames'

export const TextArea = React.forwardRef(({
    name,
    value,
    max,
    cols = 28,
    rows = 10,
    error: errorProp,
    form,
    autoFocus = false,
    onChange
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
    <Root data-testid={`textarea-${name}-root`} className={classnames({'with-info': info, error})}>
      <StyledTextArea
        data-testid={`textarea-${name}`}
        key={`${name}`}
        ref={mRefs}
        name={name}
        onBeforeInput={onBeforeInput}
        onChange={onChangeInner}
        defaultValue={finalValue}
        autoCorrect='no'
        autoComplete='off'
        autoFocus={autoFocus}
        form={form}
        cols={cols}
        rows={rows}
        />
        { info && <Info data-testid={`textarea-${name}-info`}>{info}</Info> }
        { error && <Error data-testid={`textarea-${name}-error`}>{error}</Error> }
    </Root>
  )
})

const Root = styled.div`
  position: relative;
  width: max-content;

  &.with-info > input {
    margin-bottom: 0;
  }

  &.error > input {
    border-color: ${({ theme: { palette } }) => palette.danger.main};
  }
`

const StyledTextArea = styled.textarea`
  ${cssInputBase}
  text-align: left;
  z-index: 10;
  resize: none;
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

TextArea.displayName = 'TextArea'
