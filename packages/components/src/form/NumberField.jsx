// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { NumberInput } from '../controls/NumberInput.jsx'
import { isFunction } from 'lodash-es'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint }  from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const NumberField = React.forwardRef((props, ref) => {
  const {
    min,
    max,
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
    width = 250,
    hideInfo,
    disabled
  } = props

  const { getValue, updateModel } = useForm()

  const value = getValue({
    name,
    form
  })

  const onChangeInner = React.useCallback((v) => {
    updateModel({
      name,
      value: v,
      form
    })

    if(isFunction(onChange)) onChange(v)
  }, [updateModel, onChange, name, form])

  const finalValue = React.useMemo(() => value ,[value])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <NumberInput
        min={min}
        max={max}
        name={name}
        onChange={onChangeInner}
        ref={ref}
        form={form}
        value={finalValue}
        hideInfo={hideInfo}
        width={`${width}px`}
        disabled={disabled}
      />
        { error && <Error data-testid={`numberinput-${name}-error`}>{error}</Error> }
    </FormGroup>
  )
})

NumberField.displayName = 'NumberField'

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`
