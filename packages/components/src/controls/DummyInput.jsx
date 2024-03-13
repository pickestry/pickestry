// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/* eslint-disable */
import * as React from 'react'
import styled from 'styled-components'
import { cssInput } from '../core/index.mjs'
import { DateUtils } from './DateUtils.mjs'
import c from 'ansi-colors'

const validator = new DateUtils()

export const DummyInput = () => {

  const onKeyDown = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0

    if(validator.isNavigate(e.key)) return

    if(start > 9) {
      e.preventDefault()
    }
  }, [])

  const onBeforeInput = React.useCallback((e) => {
    const ee = e
    let start = ee.target.selectionStart || 0
    let end = ee.target.selectionEnd || 0
    const len = e.currentTarget.value.length

    if(start < len) {
      const v = Array.from(e.currentTarget.value)

      // skip slash
      const ch = v.at(start)
      if(ch === '/') {
        ee.target.selectionStart = start + 1
        ee.target.selectionEnd = end + 1
        e.preventDefault()
      } else {
        v.splice(start, 1)
        e.currentTarget.value = v.join('')
        ee.target.selectionStart = start
        ee.target.selectionEnd = end
      }
    }
  }, [])

  const onChange = React.useCallback((e) => {
    console.log(c.bgRed(`--> Change <-- %O`), e)

    // const ee = (e as unknown) as React.ChangeEvent<HTMLInputElement>
    // let start = ee.target.selectionStart || 0
    // let end = ee.target.selectionEnd || 0

    // make sure value has the expected format
    let normalized
    try {
      normalized = validator.normalize(e.currentTarget.value)
      e.currentTarget.value = normalized
    } catch(err) {
      console.log(c.red(`Failed to normalize \`${e.currentTarget.value}\`: ${err}`))
    }
  }, [])

  const onKeyUp = React.useCallback((e) => {
    // const ee = (e as unknown) as React.ChangeEvent<HTMLInputElement>

    // let start = ee.target.selectionStart || 0
    // let end = ee.target.selectionEnd || 0
  }, [])

  return <Root
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onBeforeInput={onBeforeInput}
            onChange={onChange}/>
}

const Root = styled.input`
  ${cssInput}
`
DummyInput.displayName = 'DummyInput'
