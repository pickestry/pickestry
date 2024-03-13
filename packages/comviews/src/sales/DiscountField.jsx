// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { Discount } from './Discount.jsx'
import { isFunction } from 'lodash-es'
import { useForm } from '@pickestry/components'
import { FormProvider } from '@pickestry/components'
import { PopoverTrigger } from '@pickestry/components'
import { Popover } from '@pickestry/components'
import { PopoverContent } from '@pickestry/components'
import { cssNoSelect } from '@pickestry/components'
import { BlankLink } from '@pickestry/components'
import { Muted } from '@pickestry/components'
import { orderCalculator } from '@pickestry/utils'
import { V } from '@pickestry/components'
import { produce } from 'immer'

export const DiscountField = React.forwardRef((props, ref) => {
  const {
    testid = 'discount-field',
    form,
    name,
    onChange,
    currency,
    separator,
    decimal,
    symbol,
    disabled
  } = props

  const [open, setOpen] = React.useState(false)

  const { getValue, updateModel } = useForm()

  const discounts = getValue({
    name,
    defaultValue: [],
    form
  }) ?? []

  const addDiscount = React.useCallback((v) => {
    const finalValue = produce(discounts, (draft) => {
      draft.push(Object.assign({}, v, { id: draft.length + 1 }))
    })

    updateModel({
      name,
      value: finalValue,
      form
    })

    if(isFunction(onChange)) onChange(finalValue)

    setOpen(false)

    return Promise.resolve(v)
  }, [updateModel, onChange, name, discounts])

  const canAdd = React.useMemo(() => discounts.length < 2, [discounts])

  const removeDiscount = React.useCallback((id) => {
    const idx = discounts.findIndex((o) => o.id == id)
    if(idx > -1) {
      const finalValue = produce(discounts, (draft) => {
        draft.splice(idx, 1)
      })

      updateModel({
        name,
        value: finalValue,
        form
      })

      if(isFunction(onChange)) onChange(finalValue)
    }
  }, [discounts])

  return (
    <Root data-testid={testid}>
      <V>
      {
        discounts.map((discount) => (
          <DiscountLine data-testid='lines' key={discount.id} onKeyPress={(e) => { if(e.code === 'Enter') removeDiscount(discount.id) }}>
            <Muted>{discount.name}</Muted> { orderCalculator.displayDiscountAmount(discount, decimal) }
            <Remove onClick={() => removeDiscount(discount.id)}>✕</Remove>
          </DiscountLine>
        ))
      }
      </V>
      {
        canAdd && (
          <Popover open={open}>
            <PopoverTrigger asChild onClick={(e) => { e.preventDefault(); setOpen(true) }}>
              <button disabled={disabled} ref={ref}>Add Discount</button>
            </PopoverTrigger>
            <PopoverContent>
              <FormProvider>
                <Discount
                  currency={currency}
                  entity={{ type: 'fixed' }}
                  decimal={decimal}
                  symbol={symbol}
                  separator={separator}
                  onSubmit={addDiscount}
                  onCancel={() => { setOpen(false) }}
                />
              </FormProvider>
            </PopoverContent>
          </Popover>
        )
      }
    </Root>
  )

})

DiscountField.displayName = 'DiscountField'

const Root = styled.div`

`

const DiscountLine = styled(V.Item).attrs({
  tabIndex: 0
})`
  margin-bottom: 4px;
  ${cssNoSelect}

  &:hover, &:focus {
    outline: 3px solid ${({ theme: { palette: { primary } } }) => primary.lighter};

    & > [data-action="remove"] {
      // visibility: visible;
      display: inline-block;
    }
  }
`

const Remove = styled(BlankLink).attrs({
  ['data-action']: 'remove'
})`
  // visibility: hidden;
  display: none;
  margin-left: 8px;
`
