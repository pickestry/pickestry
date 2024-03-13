// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { produce } from 'immer'
import { isNil } from 'lodash-es'
import { useClick } from '@floating-ui/react'
import { useDismiss } from '@floating-ui/react'
import { useFloating } from '@floating-ui/react'
import { useInteractions } from '@floating-ui/react'
import { useMergeRefs } from '@floating-ui/react'
import { BlankLink  } from '../misc/index.mjs'
import { H } from '../layout/index.mjs'
import { Money } from './Money.jsx'
import { Tax as TaxInput } from './Tax.jsx'
import { cssPointer } from '../core/index.mjs'


const MoneyTaxComponent = React.forwardRef(({
  testid = 'money-tax',
  iso = 'usd',
  name,
  decimal = '.',
  separator = ',',
  symbol = '$',
  onPriceChange,
  onTaxChange,
  defaultTax: defaultTaxProps,
  defaultValue = 0,
  disabled = false
}, ref) => {

  const [draftTax, setDraftTax] = React.useState()

  const addRef = React.useRef()

  const defaultTax = isNil(defaultTaxProps) ? [] : defaultTaxProps

  const onAddTax = React.useCallback((e) => {
    e.preventDefault()

    if(draftTax && draftTax.value > 0 && draftTax.name && draftTax.name.length > 0) {
      const newTax = produce(defaultTax, (draft) => {
        draft.push(draftTax)
      })
      onTaxChange(newTax)
      setDraftTax(undefined)
      setMenuOpen(false)

      if(newTax.length < 2) addRef.current?.focus()
    }
  }, [draftTax, defaultTax])

  const removeTax = React.useCallback((idx) => {
    const newTax = produce(defaultTax, (draft) => { draft.splice(idx, 1) })
    onTaxChange(newTax)
  }, [defaultTax])

  const canAddTax = React.useMemo(() => {
    return defaultTax?.length < 2 || isNil(defaultTax)
  }, [defaultTax])

  // layout
  const taxRef = React.useRef()

  const moneyRef = React.useRef()

  const mergedRefs = useMergeRefs([ref, moneyRef])

  const [menuOpen, setMenuOpen] = React.useState(false)

  const {
    x: menuX,
    y: menuY,
    refs: menuRefs,
    strategy: menuStrategy,
    context: menuContext
  } = useFloating({
    placement: 'bottom',
    open: menuOpen,
    onOpenChange: setMenuOpen
  })

  const {
    getReferenceProps: getMenuReferenceProps,
    getFloatingProps: getMenuFloatingProps
  } = useInteractions([useClick(menuContext), useDismiss(menuContext)])

  const mergedAddRef = useMergeRefs([addRef, menuRefs.setReference])

  React.useEffect(() => { if(menuOpen === true) taxRef.current?.focus() }, [menuOpen, taxRef])

  return (
    <Root>
      <Money
        testid={`${testid}-money`}
        iso={iso}
        decimal={decimal}
        separator={separator}
        symbol={symbol}
        ref={mergedRefs}
        name={name}
        onChange={onPriceChange}
        value={defaultValue}
        disabled={disabled}
      />
      { canAddTax &&  <Add disabled={disabled} title='Add Tax' data-testid={`${testid}-add`} ref={mergedAddRef} {...getMenuReferenceProps()}>+</Add> }
      {
        menuOpen && (
          <div
            data-testid={`${testid}-tax-group`}
            ref={menuRefs.setFloating}
            style={{
              position: menuStrategy,
              left: menuX ?? 0,
              top: menuY ?? 0,
              background: 'white',
              border: '1px solid #cecece',
              borderRadius: '2px',
              padding: 10,
              marginTop: '4px',
              zIndex: 100
            }}
            {...getMenuFloatingProps()}
          >
            <TaxInput testid={`${testid}-tax`} ref={taxRef} value={draftTax} name="tax" onChange={setDraftTax} />
            <TaxActions>
              <button data-testid={`${testid}-tax-add`} onClick={onAddTax}>Add</button>
              <button type="button" data-testid={`${testid}-tax-cancel`} onClick={() => {setMenuOpen(false)}}>Cancel</button>
            </TaxActions>
          </div>
        )
      }
      <H>
        {
          defaultTax?.map((o, idx) => (
            <H.Item key={idx}>
              <Tax tabIndex={0} onKeyPress={(e) => { if(e.code === 'Enter') removeTax(idx) }}>
                <span data-testid={`${testid}-tax-display-${idx}`}>{`+${o?.name}`}</span>
                <BlankLink data-testid={`${testid}-tax-remove-${idx}`} tabIndex={0} className="remove-link" onClick={() => removeTax(idx)}>Remove</BlankLink>
              </Tax>
            </H.Item>
          ))
        }
      </H>
    </Root>
  )
})

MoneyTaxComponent.displayName = 'MoneyTax'

export const MoneyTax= Object.assign(MoneyTaxComponent, { })

const Add = styled.button.attrs({
  type: 'button'
})`
  position: absolute;
  right: -24px;
  top: 6px;
`

const Root = styled.div`
  position: relative;
  padding-right: 162px;
  width: 16px;
  height: 46px;
`

const Tax = styled.span`
  display: flex;
  font-size: 10px;
  margin-top: 4px;

  ${cssPointer}

  & > .remove-link {
    display: none;
  }

  &:hover,
  &:focus {
    > .remove-link {
      display: block;
    }
  }
`
const TaxActions = styled.span`
  display: block;
  margin-top: 5px;

  & > button + button {
    margin-left: 5px;
  }
`
