// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { produce } from 'immer'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { isArray } from 'lodash-es'
import { useFloating } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { offset } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { autoPlacement } from '@floating-ui/react'
import { cssPointer } from '../core/index.mjs'
import { TextInput } from '../controls/index.mjs'
import { DateInput } from '../controls/index.mjs'
import { NumberInput } from '../controls/index.mjs'
import { MultiSelect } from '../controls/index.mjs'
import { EntityMultiSelect } from '../controls/index.mjs'
import { H } from '../layout/index.mjs'
import { Select } from '../controls/index.mjs'
import { Money } from '../controls/index.mjs'
import { BlankLink } from '../misc/index.mjs'
import { useFilter } from './useFilter.mjs'
import { operations } from './operations.mjs'

export const Filter = ({
  name,
  label = name,
  type,
  ops,
  options,
  onApply,
  displayDate,
  entitySearch
}) => {

  const [edit, setEdit] = React.useState(false)

  const {
    getSelected,
    getValue,
    updateQuery,
    config = {},
    onDeactivate
  } = useFilter()

  const selected = getSelected(name)

  const value = getValue(name)

  const [innerSelected, setInnerSelected] = React.useState(() => (selected ? selected : ops[0]))

  const suggestInitValue = React.useCallback((op) => {
    let v
    switch(op) {
    case 'has':
    case 'hasnot':
      v = true
      break
    case 'between':
    case 'in':
    case 'nin':
      v = []
      break
    default:
      v = undefined
    }

    return v
  }, [])

  const [innerValue, setInnerValue] = React.useState(() => {
    return value ? value : suggestInitValue((selected ? selected : ops[0]))
  })

  const ref = React.useRef(null)

  const finalOps = React.useMemo(() => {
    return ops.map((opName) => {
      const op = operations.getOperation(opName)
      return op ? {name: op.text, value: op.value} : {name: opName, value: opName}
    })
  }, [])

  const changeSelected = React.useCallback((op) => {
    setInnerSelected(op)
    setInnerValue(suggestInitValue(op))
  }, [suggestInitValue])

  const onTextInput = React.useCallback((value) => {
    setInnerValue(value)
  }, [])

  const onIntegerInput = React.useCallback((value) => {
    setInnerValue(value)
  }, [])

  const onIntegerRange = React.useCallback((idx, value) => {
    setInnerValue(produce((draft) => {
      if(!isArray(draft)) draft = []
      set(draft, [idx], value)
    }))
  }, [])

  const onDateInput = React.useCallback((value) => {
    setInnerValue(value)
  }, [])

  const onDateRange = React.useCallback((idx, value) => {
    onIntegerRange(idx, value)
  }, [onIntegerRange])

  const onMoneyInput = React.useCallback((value) => {
    setInnerValue(value)
  }, [])

  const onMoneyRange = React.useCallback((idx, value) => {
    onIntegerRange(idx, value)
  }, [onIntegerRange])

  const onOpenChange = React.useCallback((v) => {
    if(v === false) {
      setInnerValue(value)
      setInnerSelected((selected ? selected : ops[0]))
    }
    setEdit(v)
  }, [value, selected, ops])

  const singleInput = React.useCallback(() => {
    const moneyIso = get(config, 'moneyIso', 'usd')
    const moneySymbol = get(config, 'moneySymbol')
    const moneyDecimal = get(config, 'moneyDecimal')
    const moneySeparator = get(config, 'moneySeparator')
    const timezone = get(config, 'timezone')

    switch(type) {
      case 'string':
        return <TextInput ref={ref} name={name} value={innerValue} onChange={onTextInput} />
      case 'integer':
        return <NumberInput ref={ref} name={name} value={innerValue} onChange={onIntegerInput} />
      case 'date':
        return <DateInput ref={ref} name={name} value={innerValue} onChange={onDateInput} timezone={timezone} />
      case 'money':
        return <Money ref={ref} name={name} iso={moneyIso} symbol={moneySymbol} decimal={moneyDecimal} separator={moneySeparator} value={innerValue} onChange={onMoneyInput} />
      default:
        return <div>no input</div>
    }
  }, [type, name, innerValue])

  const rangeInput = React.useCallback(() => {
    const moneyIso = get(config, 'moneyIso', 'usd')
    const moneySymbol = get(config, 'moneySymbol')
    const moneyDecimal = get(config, 'moneyDecimal')
    const moneySeparator = get(config, 'moneySeparator')
    const timezone = get(config, 'timezone')

    const val = innerValue
    const vFrom = get(val, '[0]', 0)
    const vTo = get(val, '[1]', 0)

    switch(type) {
      case 'integer':
        return (
          <H>
            <H.Item><NumberInput name={`${name}-from`} value={vFrom} onChange={(v) => onIntegerRange(0, v)} /></H.Item>
            <H.Item><NumberInput name={`${name}-to`} value={vTo} onChange={(v) => onIntegerRange(1, v)} /></H.Item>
          </H>
        )
      case 'date':
        return (
          <H>
            <H.Item><DateInput name={`${name}-from`} value={vFrom} onChange={(v) => onDateRange(0, v)} timezone={timezone} /></H.Item>
            <H.Item><DateInput name={`${name}-to`} value={vTo} onChange={(v) => onDateRange(1, v)} timezone={timezone} /></H.Item>
          </H>
        )
      case 'money':
        return (
          <H>
            <H.Item>
              <Money
                testid='money-from'
                name={`${name}-from`}
                iso={moneyIso}
                symbol={moneySymbol}
                decimal={moneyDecimal}
                separator={moneySeparator}
                value={vFrom}
                onChange={(v) => onMoneyRange(0, v)}
              />
            </H.Item>
            <H.Item>
              <Money
                testid='money-to'
                name={`${name}-to`}
                iso={moneyIso}
                symbol={moneySymbol}
                decimal={moneyDecimal}
                separator={moneySeparator}
                value={vTo}
                onChange={(v) => onMoneyRange(1, v)}
              />
            </H.Item>
          </H>
        )
      default:
        return <div>no input</div>
    }
  }, [type, name, innerValue])

  const multiInput = React.useCallback(() => {
    switch(type) {
    case 'enum':
      return options && (
        <MultiSelect
          defaultSelected={innerValue}
          name={`${name}`}
          options={options}
          onChange={(v) => {
            setInnerValue(v)
          }}
        />
      )
    case 'entity-enum':
      return isFunction(entitySearch) && (
        <EntityMultiSelect
          name={name}
          defaultSelected={innerValue}
          onChange={(v) => { setInnerValue(v) }}
          onSearch={entitySearch}
        />
      )
    }
  }, [type, name, innerValue, options, entitySearch])

  const renderInput = React.useCallback((op) => {
    switch(op) {
    case 'eq':
    case 'gt':
    case 'gte':
    case 'lt':
    case 'lte':
    case 'includes':
      return singleInput()
    case 'has':
    case 'hasnot':
      return null
    case 'between':
      return rangeInput()
    case 'in':
    case 'nin':
      return multiInput()
    default: return <div>-</div>
    }
  }, [singleInput])

  const onInnerApply = React.useCallback((e) => {
    e.preventDefault()

    setEdit(false)

    updateQuery(name, { [innerSelected]: innerValue })

    onApply?.(innerValue)
  }, [name, innerSelected, onApply, innerValue, updateQuery])

  const display = React.useMemo(() => {
    let v

    const moneyDecimal = get(config, 'moneyDecimal', ',')
    const moneySeparator = get(config, 'moneySeparator', '.')
    const moneyIso = get(config, 'moneyIso', 'usd')

    switch(type) {
    case 'string':
      v = innerValue
      break
    case 'integer':
      if(innerValue)
        v = ''+innerValue
      break
    case 'money':
      if(isArray(innerValue)) {
        const moneyFrom = Money.display(get(innerValue, '[0]', 0), moneyDecimal, moneySeparator, moneyIso, ref) + ' ' + config.moneySymbol
        const moneyTo = Money.display(get(innerValue, '[1]', 0), moneyDecimal, moneySeparator, moneyIso, ref) + ' ' + config.moneySymbol
        v = moneyFrom + ' - ' + moneyTo
      } else {
        v = Money.display(innerValue,
          moneyDecimal,
          moneySeparator,
          moneyIso,
          ref) + ' ' + config.moneySymbol
      }
      break
    case 'date':
      if(innerValue) {
        if(isArray(innerValue)) {
          let dateFrom = ''
          const dateUnixFrom = get(innerValue, '[0]', 0)
          if(dateUnixFrom > 0)
            dateFrom = isFunction(displayDate) ? displayDate(dateUnixFrom) : new Date(dateUnixFrom).toISOString()

          let dateTo = ''
          const dateUnixTo = get(innerValue, '[1]', 0)
          if(dateUnixTo > 0)
            dateTo = isFunction(displayDate) ? displayDate(dateUnixTo) : new Date(dateUnixTo).toISOString()

          v = dateFrom + ' - ' + dateTo
        } else {
          v = isFunction(displayDate) ? displayDate(innerValue) : new Date(innerValue).toISOString()
        }
      }
      break
    case 'enum':
      if(isArray(innerValue)) {
        v = innerValue.join(', ')
      }
      break
    case 'entity-enum':
      if(isArray(innerValue)) {
        v = innerValue.map((o) => o.name).join(', ')
      }
      break
    }

    if(v) {
      if(innerSelected === 'has' || innerSelected === 'hasnot') {
        v = operations.getShort(innerSelected)
      } else {
        v = `${operations.getShort(innerSelected)} ${v}`
      }
    }

    return v
  }, [innerValue, innerSelected, type])

  // floating-ui
  const { refs, floatingStyles, context } = useFloating({
    placement: 'bottom-start',
    open: edit,
    onOpenChange,
    middleware: [
      autoPlacement({
        allowedPlacements: ['bottom-start', 'bottom-end']
      }),
      offset(2)
    ]
  })

  const dismiss = useDismiss(context)

  const { getReferenceProps, getFloatingProps } = useInteractions([ dismiss ])

  return (
    <>
      <Root data-testid={`filter-${name}`} ref={refs.setReference} {...getReferenceProps()}>
        <Label onClick={(e) => { e.preventDefault(); if(!edit) setEdit(true)}}>
          <LabeName>{label}:</LabeName>
          <Value data-testid='filter-display' title={display}>{ display }</Value>
          { edit && (<BlankLink title="Remove" onClick={() => { onDeactivate?.(name) }}>x</BlankLink>) }
        </Label>
      </Root>
      {
        edit && (
          <EditPopup data-testid="active-item-floating" ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            <FormWrapper>
              <form onSubmit={onInnerApply}>
                <Select
                  autoFocus
                  name="op"
                  defaultValue={innerSelected}
                  onChange={(v) => { changeSelected(v) } }
                  options={finalOps}
                  withEmptyOption={false}
                />
                { renderInput(innerSelected) }
                <button type="submit">Apply</button>
                <button type="button" onClick={(e) => { e.preventDefault(); onOpenChange(false) }}>Cancel</button>
              </form>
            </FormWrapper>
          </EditPopup>
        )
      }
    </>
  )
}

if(__DEV__) {
  Filter.displayName = 'Filter'
}

const FormWrapper = styled.div`
  padding: 2px;

  & > form > * {
    margin: 2px;
  }
`

const Root = styled.div`
  border: ${({theme: {components: { filter }}}) => filter.activeBorder};
  border-radius: ${({theme: {components: { filter }}}) => filter.activeBorderRadius};
  padding: ${({theme: {components: { filter }}}) => filter.activePadding};
  background-color: ${({ theme: { palette: { primary } } }) => primary.lighter};
  height: 32px;
  max-width: 300px;
`

const Label = styled.div`
  display: flex;
  align-items: baseline;
  ${ cssPointer }
`

const LabeName = styled.div`
  display: inline-block;
  margin-top: 2px;
`

const Value = styled.div`
  color: #999;
  display: inline-block;
  margin-left: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
  height: 18px;
`

const EditPopup = styled.div`
  background-color: ${({ theme: { palette: { primary } } }) => primary.lighter};
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  z-index: 99;
`
