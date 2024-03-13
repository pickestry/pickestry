// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { Select } from '../controls/Select.jsx'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const SelectField = React.forwardRef((props, ref) => {
  const {
    error = '',
    inline = false,
    required = false,
    testId = 'select-field',
    withEmptyOption,
    form,
    hint,
    label,
    name,
    onChange,
    style,
    options
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

  const finalValue = React.useMemo(() => value, [value])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <Select
        name={name}
        onChange={onChangeInner}
        ref={ref}
        options={options}
        form={form}
        defaultValue={finalValue}
        withEmptyOption={withEmptyOption}
      />
        { error && <Error data-testid={`Select-${name}-error`}>{error}</Error> }
    </FormGroup>
  )
})

SelectField.displayName = 'SelectField'

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`
