// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { padStart } from 'lodash-es'
import { useMergeRefs } from '@floating-ui/react'
import { useFloating } from '@floating-ui/react'
import { autoUpdate } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useClick } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { FloatingFocusManager } from '@floating-ui/react'
import { autoPlacement } from '@floating-ui/react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { pointer } from '../core/index.mjs'
import { cssInput }  from '../core/index.mjs'
import { dateUtils } from './DateUtils.mjs'

export const DateInput = React.forwardRef(({
  name,
  value,
  timezone = 'UTC',
  monthFirst = false,
  onChange,
  form,
  disabled = false
}, ref) => {

  const [isInvalid, setInvalid] = React.useState(false)

  const [calendar, setCalendar] = React.useState(false)

  const inputRef = React.useRef()

  const timezoneOffset = React.useMemo(() => {
    const options = {
      timeZone: timezone,
      timeZoneName: 'longOffset'
    }
    const dateText = Intl.DateTimeFormat([], options).format(new Date())

    return dateText.split(' ')[1].slice(3) || '+00:00'
  }, [])

  const propsValue = React.useMemo(() => {
    if(value) {
      const d = dateUtils.adjustForTimezone(new Date(value), timezoneOffset)
      const day = padStart('' + d.getUTCDate(), 2, '0')
      const mo = padStart('' + (d.getUTCMonth() + 1), 2, '0')
      const yr = d.getFullYear()

      return `${monthFirst ? mo : day}/${monthFirst ? day : mo}/${yr}`
    } else {
      return ''
    }
  }, [value, timezoneOffset])

  const valueDate = React.useMemo(() => {
    if(propsValue) {
      const parts = propsValue.split('/')

      if(parts.length === 3) {
        const d = new Date()
        if(monthFirst) {
          d.setUTCDate(parseInt(parts[1]))
          d.setUTCMonth(parseInt(parts[0]) - 1)
          d.setFullYear(parseInt(parts[2]))
        } else {
          d.setUTCDate(parseInt(parts[0]))
          d.setUTCMonth(parseInt(parts[1]) - 1)
          d.setFullYear(parseInt(parts[2]))
        }

        return d
      }
    }

    return new Date()
  }, [propsValue])

  const onFocus = (e) => { // eslint-disable-line
    // if(!isNil(inputRef.current)) {
    //   inputRef.current?.setSelectionRange(0, 1)
    // }
  }

  const onKeyDown = React.useCallback((e) => {
    const ee = e

    const start = ee.target.selectionStart || 0

    if(dateUtils.isNavigate(e.key)) return

    if(start > 9) {
      e.preventDefault()
    }
  }, [])

  const onBeforeInput = React.useCallback((e) => {
    const ee = e
    const start = ee.target.selectionStart || 0
    const end = ee.target.selectionEnd || 0
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

  const onChangeInner = React.useCallback((e) => {
    let normalized = ''
    try {
      normalized = dateUtils.normalize(e.currentTarget.value)
      e.currentTarget.value = normalized
    } catch(err) {
      e.preventDefault()

      return
    }

    try {
      const finalUnixtime = dateUtils.parse(normalized, {
        offset: timezoneOffset,
        monthFirst
      })

      const dt = new Date(finalUnixtime)

      if(isFunction(onChange)) onChange(+dt)
    } catch(err) {
      setInvalid(normalized.length === 10)

      if(normalized.length === 0 && isFunction(onChange)) onChange(undefined)
    }

  }, [timezoneOffset])

  const onBlur = React.useCallback((e) => {
    const v = e.target.value

    if(v.length !== 10) {
      e.target.value = propsValue

      return
    }

    try {
      dateUtils.parse(v, {
        offset: timezoneOffset,
        monthFirst
      })
    } catch(err) {
      e.target.value = propsValue
    }
  }, [propsValue])

  const showCalendar = React.useCallback(() => {
    setCalendar(true)
  }, [])

  // ** Previous implementation
  //
  // const valueDate = React.useMemo(() => {
  //   return value ? new Date(value) : new Date()
  // }, [value])

  const dayPickerDone = React.useCallback((d) => {
    if(!d) {
      d = dateUtils.now(true)
    }
    if(d && isFunction(onChange)) onChange(+d)
    setCalendar(false)
  }, [onChange])

  // Calendar popup

  const { refs: { setReference, setFloating }, floatingStyles, context } = useFloating({
    open: calendar,
    onOpenChange: setCalendar,
    middleware: [autoPlacement()],
    whileElementsMounted: autoUpdate
  })

  const click = useClick(context, {
    enabled: false
  })
  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss
  ])

  const mRefs = useMergeRefs([ref, inputRef, setReference])

  return (
    <Root data-testid={`dateinput-${name}`}>
      <StyledDateInput
        form={form}
        key={`${name}-${propsValue}`}
        name={name}
        type='text'
        ref={mRefs}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChangeInner}
        onBeforeInput={onBeforeInput}
        placeholder={`${monthFirst ? 'MM/DD/YYYY' : 'DD/MM/YYYY'}`}
        defaultValue={propsValue}
        $error={isInvalid}
        disabled={disabled}
        {...getReferenceProps()}
      />
      <a onClick={showCalendar}>
        <Svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 448 512" xmlSpace="preserve" width={17.92} height={20.48}>
          <path fill='pink' d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z"/>
        </Svg>
      </a>
      {
        calendar && (
          <FloatingFocusManager context={context} modal={false}>
            <Popup
              ref={setFloating}
              style={floatingStyles}
              {...getFloatingProps()}>
              <StyledDayPicker
                mode="single"
                defaultMonth={valueDate}
                selected={valueDate}
                onSelect={dayPickerDone}
              />
            </Popup>
          </FloatingFocusManager>
        )
      }
    </Root>
  )
})

DateInput.displayName = 'DateInput'

const Root = styled.div`
  width: 160px;
  position: relative;
`

const StyledDateInput = styled.input`
  ${cssInput}
  letter-spacing: 2px;
  width: 158px;
  text-align: left;
  z-index: 10;
`

const Svg = styled.svg`
  position: absolute;
  top: 7px;
  right: 8px;
  z-index: 11;

  & > path {
    fill: ${({ theme: { palette } }) => palette.primary.main};
  }

  &:hover {
    ${pointer}
  }
`

const Popup = styled.div`
  z-index: 100;
  background: white;
  border-radius: 4px;
  ${({theme}) => theme.shadow}
`

const StyledDayPicker = styled(DayPicker)`
  & .rdp-day_selected {
    background-color: ${({ theme: { palette } }) => palette.primary.main};
  }
`
