// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isNil } from 'lodash-es'
import { Shipping } from './Shipping.jsx'
import { isFunction } from 'lodash-es'
import { useForm } from '@pickestry/components'
import { FormProvider } from '@pickestry/components'
import { PopoverTrigger } from '@pickestry/components'
import { Popover } from '@pickestry/components'
import { PopoverContent } from '@pickestry/components'
import { AmountLine } from '@pickestry/components'
import { AmountLineRemove } from '@pickestry/components'
import { Muted } from '@pickestry/components'
import { displayAmount } from '@pickestry/utils'
import { V } from '@pickestry/components'

export const ShippingField = React.forwardRef((props, ref) => {
  const {
    testid = 'shipping-field',
    form,
    name,
    onChange,
    currency,
    separator,
    decimal,
    symbol
  } = props

  const [open, setOpen] = React.useState(false)

  const { getValue, updateModel, removeFields } = useForm()

  const shipping = getValue({
    name,
    form
  })

  const addShipping = React.useCallback((v) => {
    const finalValue = Object.assign({}, v, { currency })

    updateModel({
      name,
      value: finalValue,
      form
    })

    if(isFunction(onChange)) onChange(finalValue)

    setOpen(false)

    return Promise.resolve(v)
  }, [updateModel, onChange, name, currency])

  const canAdd = React.useMemo(() => isNil(shipping), [shipping])

  const removeShipping = React.useCallback(() => {
    removeFields({
      fields: [name],
      form
    })

    if(isFunction(onChange)) onChange(undefined)
  }, [removeFields])

  return (
    <Root data-testid={testid}>
      <V>
      {
        !isNil(shipping) ? (
          <AmountLine data-testid='shipping-amount' key={shipping.amount} onKeyPress={(e) => { if(e.code === 'Enter') removeShipping() }}>
            <Muted>{shipping.name}</Muted> + { displayAmount(shipping.amount, shipping.currency) }
          <AmountLineRemove onClick={() => removeShipping()}>✕</AmountLineRemove>
          </AmountLine>
        ) : null
      }
      </V>
      {
        canAdd && (
          <Popover open={open}>
            <PopoverTrigger asChild onClick={(e) => { e.preventDefault(); setOpen(true) }}>
              <button ref={ref} >Add Shipping</button>
            </PopoverTrigger>
            <PopoverContent>
              <FormProvider>
                <Shipping
                  currency={currency}
                  decimal={decimal}
                  separator={separator}
                  symbol={symbol}
                  onSubmit={addShipping}
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

ShippingField.displayName = 'ShippingField'

const Root = styled.div`
`
