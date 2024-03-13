// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { isFinite } from 'lodash-es'
import classnames from 'classnames'
import { cssInput } from '../core/index.mjs'
import { useMergeRefs } from '@floating-ui/react'
import { controlUtils } from './ControlUtils.mjs'

export const NumberInput = React.forwardRef(({
  name,
  value,
  onChange,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  form,
  width = '130px',
  hideInfo = false,
  center = false,
  disabled = false
}, ref) => {

  const inputRef = React.useRef(null)

  const info = React.useMemo(() => {
    let msg = ''
    if(min > Number.MIN_SAFE_INTEGER) {
      msg += `min: ${min} `
    }
    if(max < Number.MAX_SAFE_INTEGER) {
      msg += `max: ${max}`
    }

    return hideInfo ? undefined : msg
  }, [min, max, hideInfo])

  const [error, setError] = React.useState()

  const isValid = React.useCallback((num) => {
    return isFinite(num) && num >= min && num <= max
  }, [min, max])

  const finalValue = React.useMemo(() => {
    if(value && isValid(+value)) {
      if(inputRef.current) {
        inputRef.current.value = ''+value
      }

      return value
    } else if(typeof value === 'undefined') {
      if(inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }, [value, isValid])

  const onKeyDown = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0

    const v = Array.from(e.currentTarget.value)
    if(start < end) {
      return
    } else if(controlUtils.isNumber(e.key)) {
      if(start === 0 && v.at(0) === '-') {
        v.splice(1, 1)
        e.currentTarget.value = v.join('')

        ee.target.selectionStart = 1
        ee.target.selectionEnd = 1
      } else {
        v.splice(start, 1)
        e.currentTarget.value = v.join('')

        ee.target.selectionStart = start
        ee.target.selectionEnd = end
      }
    } else if(e.key === 'Enter') {
      const num = +e.currentTarget.value
      if(isFunction(onChange)) {
        if(isValid(num)) {
          onChange(num === 0 ? undefined : num)
        } else {
          if(error) {
            setError(undefined)
            e.currentTarget.value = ''+(finalValue || '')
          } else {
            setError('Invalid input')

            e.preventDefault()
            e.currentTarget.focus()
          }
        }
      }
    }
  }, [onChange, isValid, error])

  const onBeforeInput = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0

    const v = Array.from(e.currentTarget.value)

    v.splice(start, end, e.data)

    const resulting = v.join('')
    const num = +resulting

    if(controlUtils.isMinus(e.data) && start === 0 && min < 0) return

    if(isFinite(num) && e.data.trim() !== '') {
      // console.log(clrs.magenta(`Valid: ${num}`))
    } else {
      ee.target.classList.add('error')
      setTimeout(() => {ee.target.classList.remove('error')}, 300)
      e.preventDefault()

      return
    }
  }, [min, isFinite])

  const onBlur = React.useCallback((e) => {
    const num = +e.currentTarget.value

    if(isFunction(onChange)) {
      if(isValid(num)) {
        onChange(num === 0 ? undefined : num)
      } else {
        if(error) {
          setError(undefined)
          e.currentTarget.value = ''+(finalValue || '')
        } else {
          setError('Invalid input')

          e.preventDefault()
          e.currentTarget.focus()
        }
      }
    }
  }, [isValid, finalValue, error])

  const mRefs = useMergeRefs([ref, inputRef])

  return (
    <Root data-testid={`number-${name}-root`} className={classnames({'with-info': info, error})}>
      <Input
        ref={mRefs}
        data-testid={`number-${name}-input`}
        name={name}
        defaultValue={finalValue}
        onKeyDown={onKeyDown}
        onBeforeInput={onBeforeInput}
        $width={width}
        onBlur={onBlur}
        form={form}
        $center={center}
        disabled={disabled}
        />
        { error && <Error data-testid={`number-${name}-error`}>{error}</Error> }
        { info && <Info data-testid={`number-${name}-info`}>{info}</Info> }
    </Root>
  )
})

const Root = styled.div`
  width: fit-content;

  &.with-info > input {
    margin-bottom: 0;
  }

  &.error > input {
    border-color: ${({ theme: { palette } }) => palette.danger.main};
  }
`

const Input = styled.input`
  ${cssInput}
  width: ${({ $width = '158px' }) => $width };
  text-align: ${({$center}) => $center ? 'center': 'right' };
`

const Info = styled.span`
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.textMuted};
`
const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`

NumberInput.displayName = 'NumberInput'
