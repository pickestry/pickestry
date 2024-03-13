// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { FormError } from './foundation.mjs'
import { useForm } from './useForm.mjs'
import { Items } from '../controls/items/index.mjs'

export const ItemsField = React.forwardRef(({
  form,
  name,
  testid = 'items-field',
  disabled = false,
  onSearch,
  onInit,
  onChange,
  error = '',
  label,
  hint,
  style,
  currency,
  symbol,
  decimal = '.',
  separator = ',',
  amountField
}, ref) => {

  const { getValue, updateModel, addError } = useForm()

  const value = getValue({
    name,
    defaultValue: [],
    form
  })

  const onChangeInner = React.useCallback((items) => {
    updateModel({
      name,
      value: items,
      form
    })

    onChange?.(items)
  }, [updateModel, onChange, name, form])

  return (
    <FormGroup data-testid={testid} $inline={false} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <Items
        items={value}
        onChange={onChangeInner}
        disabled={disabled}
        ref={ref}
        onError={(err) => { addError({ code: 'err', field: name, message: err }) }}
        onSearch={onSearch}
        onInit={onInit}
        currency={currency}
        symbol={symbol}
        decimal={decimal}
        separator={separator}
        amountField={amountField}
      />
      { error && <FormError data-testid='error'>{error}</FormError> }
    </FormGroup>
  )

})

ItemsField.displayName = 'ItemsField'
