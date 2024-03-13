// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { Money as MoneyInput } from '../controls/Money.jsx'
import { isFunction } from 'lodash-es'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint }  from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const MoneyField = React.forwardRef((props, ref) => {
  const {
    error = '',
    inline = false,
    required = false,
    testId = 'base-field',
    form,
    hint,
    label,
    name,
    onChange,
    style,
    iso,
    onFocus,
    disabled
  } = props

  const {
    getValue,
    updateModel
  } = useForm()

  const value = getValue( { name, form })

  const onChangeInner = React.useCallback((v) => {
    updateModel({
      name,
      value: v,
      form
    })

    if(isFunction(onChange)) onChange(v)
  }, [updateModel, onChange, name, form])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <MoneyInput
        name={name}
        onChange={onChangeInner}
        ref={ref}
        form={form}
        value={value}
        iso={iso}
        onFocus={onFocus}
        disabled={disabled}
      />
        { error && <Error data-testid={`Money-${name}-error`}>{error}</Error> }
    </FormGroup>
  )
})

MoneyField.displayName = 'MoneyField'

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`
