// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { cssInput } from '../core/index.mjs'
import { useMergeRefs } from '@floating-ui/react'
import { padStart } from 'lodash-es'
import { get } from 'lodash-es'
import { isFunction } from 'lodash-es'
import { isNil } from 'lodash-es'
import { controlUtils } from './ControlUtils.mjs'
import { cssNoSelect } from '../core/index.mjs'

export const display = (v, decimal = '.') => {
  if(isNil(v)) return ''

  const vArr = Array.from(''+ v.value)
  vArr.splice(vArr.length - 2, 0, decimal)

  return `${vArr.join('')}% ${get(v, 'name', '')}`
}

export const Tax = React.forwardRef(({
  name,
  value = { value: 0 },
  decimal = '.',
  testid = 'tax-control',
  form,
  onChange
}, ref) => {

  const nameRef = React.useRef(null)

  const taxRef = React.useRef(null)

  const refs = useMergeRefs([ref, taxRef])

  const normalizeValue = React.useCallback((v = '0.00') => {
    const vArr = Array.from(padStart(v.replaceAll('.', '').replaceAll(',', ''), 3, '0'))
    vArr.splice(vArr.length - 2, 0, decimal)

    return vArr.join('')
  }, [decimal])

  const finalValue = React.useMemo(() => {

    if(isNil(value)) return undefined

    const { value: v } = value

    const normalized = normalizeValue('' + v)

    if (taxRef.current) {
      taxRef.current.value = normalized
    }

    return value ? normalized : `0${decimal}00`
  }, [value, decimal])

  const procOnChange = React.useCallback((v) => {
    if (isFunction(onChange)) {
      onChange(v)
    }
  }, [onChange])

  const onKeyDown = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0
    const len = e.currentTarget.value.length

    // console.log(`DOWN Value is \`${e.currentTarget.value}\` keypressed is \`${e.key}\` cursor at ${start}:${end}[${e.currentTarget.value.at(start)}][${len}]`)

    if (e.currentTarget.value === '0.00' && start === 4) {
      // console.log('DOWN  We are at the end...')
      e.currentTarget.value = '.00'

      ee.target.selectionStart = 0
      ee.target.selectionEnd = 0

      return
    }

    const le = len - end
    if (start < end && (le < 3)) {
      ee.target.selectionStart = 0
      ee.target.selectionEnd = 0

      return
    }

    if (controlUtils.isNavigate(e.key)) return

    if (controlUtils.isBackspace(e.key) && ((len - start) < 2)) {

      const v = Array.from(e.currentTarget.value)

      // console.log(`DOWN Within decimal. Replace and move backwards`)

      v.splice(start - 1, 1, '0')
      e.currentTarget.value = v.join('')

      const bumpNum = (len - end) + 1
      ee.target.selectionStart = start - bumpNum
      ee.target.selectionEnd = end - bumpNum

      procOnChange({
        value: Math.trunc(+e.currentTarget.value * 100),
        name: nameRef.current?.value
      })

      e.preventDefault()

      return
    }

    if (e.key === '.') {
      ee.target.selectionStart = start + 1
      ee.target.selectionEnd = end + 1

      e.preventDefault()

      return
    }

    if (controlUtils.isIrrelevant(e.key)) {
      e.preventDefault()

      return
    }

    if (start === len) {
      e.preventDefault()

      return
    }

    if (start === end && le < 3) {
      const v = Array.from(e.currentTarget.value)
      const keyToUse = controlUtils.isDelete(e.key) ? '0' : e.key
      v.splice(start, 1, keyToUse)
      e.currentTarget.value = v.join('')

      procOnChange({
        value: Math.trunc(+e.currentTarget.value * 100),
        name: nameRef.current?.value
      })

      ee.target.selectionStart = start + 1
      ee.target.selectionEnd = end + 1

      e.preventDefault()

      return
    }

    // console.log('DOWN done!')
  }, [])

  const onBeforeInput = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0
    const len = e.currentTarget.value.length

    const v = Array.from(e.currentTarget.value)

    // console.log(`BEF Value is \`${e.currentTarget.value}\` Key pressed is \`${e.data}\` and cursor at ${start}:${end}[${v.at(start)}][${len}]`)

    if (start === len) {
      e.preventDefault()

      return
    }

    // if (len >= 5) {
    //   if (start <= 2) {
    //     e.preventDefault()

    //     ee.target.selectionStart = 3
    //     ee.target.selectionEnd = 3

    //     return
    //   }
    // }

    // if(ch === decimal) {
    //  // console.log(clrs.magenta('Decimal character, will continue normally'))
    //   return
    // }

    if (e.data === decimal) {
      if (v.at(start) === decimal) {
        // console.log(' BEF Encountered a decimal character, moving cursor 1 place forward')
        ee.target.selectionStart = start + 1
        ee.target.selectionEnd = end + 1
      } else {
        // console.log('BEF Not a valid value. Do nothing')
      }

      e.preventDefault()

      return
    }

    // if number, replace
    if (controlUtils.isNumber(e.data)) {
      if (v.at(start) === decimal) {
        // console.log('BEF Do nothing')
        return
      }

      v.splice(start, 1)
      e.currentTarget.value = v.join('')

      ee.target.selectionStart = start
      ee.target.selectionEnd = end

      // console.log(`BEF Changed value from \`${v.join('')}\` to \`${e.currentTarget.value}\`, Moved cursor to ${ee.target.selectionStart}:${ee.target.selectionEnd}`)

      return
    }

    // console.log('BEF done!')
  }, [])

  const onChangeInner = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0

    // console.log(`CHANGE Non-normalized value: ${e.currentTarget.value}, Cursor at ${start}:${end}[${Array.from(e.currentTarget.value).at(start)}]`)

    const normalized = normalizeValue(e.currentTarget.value)

    // console.log('CHANGE Normalized value is ' + normalized)

    if (e.currentTarget.value !== normalized) {
      // console.log(`Changed from \`${e.currentTarget.value}\`[${e.currentTarget.value.length}] to \`${normalized}\`[${normalized.length}]`)
      // console.log(`Length before: ${e.currentTarget.value.length}, Length after: ${normalized.length}`)

      const lenDiff = normalized.length - e.currentTarget.value.length

      e.preventDefault()

      const oldValue = Array.from(e.currentTarget.value)
      const newValue = normalized

      e.currentTarget.value = newValue

      const isAtDecimal = (oldValue.at(start) === decimal)

      // console.log(`CHANGE Cursor ${oldValue.at(start)} at decimal ` + isAtDecimal)

      ee.currentTarget.selectionStart = (isAtDecimal ? start : start + 1) + lenDiff
      ee.currentTarget.selectionEnd = (isAtDecimal ? end : end + 1) + lenDiff

      // console.log(`CHANGE Value changed manually to \`${e.currentTarget.value}\`. Moving cursor from ${start}:${end}[${oldValue.at(start)}] to ${ee.currentTarget.selectionStart}:${ee.currentTarget.selectionEnd}`)
    } else if (Array.from(e.currentTarget.value).at(start) === decimal && start === 2) {
      ee.currentTarget.selectionStart = start + 1
      ee.currentTarget.selectionEnd = end + 1

      // console.log(`CHANGE Moving cursor to ${ee.currentTarget.selectionStart}:${ee.currentTarget.selectionEnd}`)
    }

    procOnChange({
      value: Math.trunc(+(e.currentTarget.value || 0) * 100),
      name: nameRef.current?.value
    })
  }, [])

  const onChangeName = React.useCallback((e) => {
    e.preventDefault()
    procOnChange({
      value: Math.trunc(+(taxRef.current?.value || 0) * 100),
      name: nameRef.current?.value
    })
  }, [])

  return (
    <Root data-testid={testid}>
      <TaxStyled
        name={`${name}-value`}
        ref={refs}
        form={form}
        placeholder={`0${decimal}00`}
        defaultValue={finalValue}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBeforeInput={onBeforeInput}
        onChange={onChangeInner}
      />
      <Symbol>%</Symbol>
      <NameStyled
        name={`${name}-name`}
        placeholder='Name'
        ref={nameRef}
        maxLength={6}
        tabIndex={0}
        defaultValue={value?.name}
        onChange={onChangeName}
      />
    </Root>
  )
})

const Root = styled.div`
  width: 165px;
  position: relative;
  height: 39px;
`

const NameStyled = styled.input`
  ${cssInput}
  text-align: left;
  width: 82px;
  position: absolute;
  top: 0;
  right: 0;
`

const TaxStyled = styled.input`
  ${cssInput}
  position: absolute;
  left: 0px;
  top: 0px;
  width: 82px;
  text-align: right;
  padding-right: 24px;
`

const Symbol = styled.span`
  position: absolute;
  left: 59px;
  top: 7px;
  ${ cssNoSelect }
`

Tax.displayName = 'Tax'
