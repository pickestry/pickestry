// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { DateInput } from '../controls/DateInput.jsx'
import { isFunction } from 'lodash-es'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const DateField = React.forwardRef((props, ref) => {
  const {
    form,
    error = '',
    inline = false,
    required = false,
    testId = 'base-field',
    hint,
    label,
    name,
    onChange,
    style,
    disabled
  } = props

  const { getValue, updateModel } = useForm(form)

  const value = getValue({ name, form })

  const onChangeInner = React.useCallback((v) => {
    updateModel({
      name,
      value: v,
      form
    })

    if(isFunction(onChange)) onChange(v)
  }, [updateModel, onChange, name])

  const finalValue = React.useMemo(() => value, [value])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <DateInput
        name={name}
        onChange={onChangeInner}
        ref={ref}
        form={form}
        value={finalValue}
        disabled={disabled}
      />
        { error && <Error data-testid={`textinput-${name}-error`}>{error}</Error> }
    </FormGroup>
  )
})

DateField.displayName = 'DateField'

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`
