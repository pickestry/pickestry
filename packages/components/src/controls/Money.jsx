// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { useMergeRefs } from '@floating-ui/react'
import { isFunction } from 'lodash-es'
import currency from 'currency.js'
import { cssInput } from '../core/index.mjs'
import { cssNoSelect } from '../core/index.mjs'
import { controlUtils } from './ControlUtils.mjs'

const MoneyComponent = React.forwardRef(({
  testid = 'money',
  name,
  value,
  iso,
  onChange,
  decimal = '.',
  separator = ',',
  form,
  symbol = '$',
  autoFocus = false,
  onFocus,
  disabled = false
}, ref) => {

  const inputRef = React.useRef(null)

  const finalValue = React.useMemo(() => Money.display(value, decimal, separator, iso, inputRef), [value, decimal, separator, iso])

  const procOnChange = React.useCallback((v) => {
    if (isFunction(onChange)) {
      const _v = currency(v, { separator, decimal, symbol })

      onChange(_v.intValue)
    }
  }, [onChange])

  const onFocusInner = React.useCallback((e) => {
    onFocus?.(e)
  }, [onFocus])

  const onKeyDown = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0
    const len = e.currentTarget.value.length

    if(e.currentTarget.value === '0.00' && start === 4) {
      e.currentTarget.value = '.00'

      ee.target.selectionStart = 0
      ee.target.selectionEnd = 0

      return
    }

    const le = len - end
    if(start < end && (le < 3)) {
      ee.target.selectionStart = 0
      ee.target.selectionEnd = 0

      return
    }

    if (controlUtils.isNavigate(e.key)) return

    if (controlUtils.isBackspace(e.key) && ((len - start) < 2)) {

      const v = Array.from(e.currentTarget.value)

      v.splice(start - 1, 1, '0')
      e.currentTarget.value = v.join('')

      const bumpNum = (len - end) + 1
      ee.target.selectionStart = start - bumpNum
      ee.target.selectionEnd = end - bumpNum

      procOnChange(e.currentTarget.value)

      e.preventDefault()

      return
    }

    if(e.key === '.') {
      ee.target.selectionStart = start + 1
      ee.target.selectionEnd = end + 1

      e.preventDefault()

      return
    }

    if(controlUtils.isIrrelevant(e.key)) {
      e.preventDefault()

      return
    }

    if(start === len) {
      e.preventDefault()

      return
    }

    if(start === end && le < 3) {
      const v = Array.from(e.currentTarget.value)
      v.splice(start, 1, e.key)
      e.currentTarget.value = v.join('')

      procOnChange(e.currentTarget.value)

      ee.target.selectionStart = start + 1
      ee.target.selectionEnd = end + 1

      e.preventDefault()

      return
    }
  }, [])

  const onBeforeInput = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0
    const len = e.currentTarget.value.length

    const v = Array.from(e.currentTarget.value)

    if (start === len) {
      e.preventDefault()

      return
    }

    if (len >= 13) {
      if (start <= 10) {
        e.preventDefault()

        ee.target.selectionStart = 11
        ee.target.selectionEnd = 11

        return
      }
    }

    if (e.data === decimal) {
      if (v.at(start) === decimal) {
        ee.target.selectionStart = start + 1
        ee.target.selectionEnd = end + 1
      }

      e.preventDefault()

      return
    }

    // if number, replace
    if (controlUtils.isNumber(e.data)) {
      if (v.at(start) === decimal) {
        return
      }

      v.splice(start, 1)
      e.currentTarget.value = v.join('')

      ee.target.selectionStart = start
      ee.target.selectionEnd = end

      return
    }
  }, [])

  const onChangeInner = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0

    let normalized = ''

    const o = currency(e.currentTarget.value.replaceAll(',', '').replaceAll('.', '').replaceAll(' ', ''), {
      pattern: '#',
      fromCents: true
    })

    normalized = o.format({
      decimal,
      separator
    })

    if(e.currentTarget.value !== normalized) {
      const lenDiff = normalized.length - e.currentTarget.value.length

      e.preventDefault()

      const oldValue = Array.from(e.currentTarget.value)
      const newValue = normalized

      e.currentTarget.value = newValue

      const isAtDecimal = (oldValue.at(start) === decimal)

      ee.currentTarget.selectionStart = (isAtDecimal ? start : start + 1) + lenDiff
      ee.currentTarget.selectionEnd = (isAtDecimal ? end : end + 1) + lenDiff
    } else {
      if(ee.currentTarget.value.at(start) === separator) {
        ee.currentTarget.selectionStart = start + 1
        ee.currentTarget.selectionEnd = start + 1
      }
    }

    procOnChange(e.currentTarget.value)
  }, [])

  const mRefs = useMergeRefs([ref, inputRef])

  return (
    <Root data-testid={`${testid}-group`}>
      <StyledInput
        data-testid={`${testid}-input`}
        name={name}
        key={`${name}`}
        ref={mRefs}
        defaultValue={finalValue}
        onKeyDown={onKeyDown}
        onBeforeInput={onBeforeInput}
        onChange={onChangeInner}
        form={form}
        autoFocus={autoFocus}
        onFocus={onFocusInner}
        disabled={disabled}
      />
      <Symbol>{symbol}</Symbol>
    </Root>
  )
})

const display = (v, decimal, separator, iso, inputRef) => {
  const val = ''+v
  let normalized = ''

  const o = currency(val.replaceAll(',', '').replaceAll('.', '').replaceAll(' ', ''), {
    pattern: '#',
    fromCents: true
  })

  normalized = o.format({
    decimal,
    separator
  })

  if(inputRef?.current) {
    inputRef.current.value = normalized
  }

  return val ? normalized : `0${decimal}00`
}

MoneyComponent.displayName = 'Money'

export const Money = Object.assign(MoneyComponent, { display })

const Root = styled.div`
  width: 156px;
  height: 37px;
  position: relative;
`

const StyledInput = styled.input`
  ${cssInput}
  text-align: right;
  padding-right: 24px;
`

const Symbol = styled.span`
  position: absolute;
  right: 8px;
  top: 10px;

  ${ cssNoSelect }
`
