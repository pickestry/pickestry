// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isNil } from 'lodash-es'
import { Switch } from '../controls/Switch.jsx'
import { isFunction } from 'lodash-es'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const SwitchField = React.forwardRef((props, ref) => {
  const {
    error = '',
    inline = false,
    required = false,
    testId = 'switch-field',
    form,
    hint,
    label,
    name,
    onChange,
    style,
    width
  } = props

  const { getValue, updateModel } = useForm()

  const value = getValue({ name, form })

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
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error} $width={width}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      {
      isNil(finalValue) ? (
        <Switch
          testId={`${testId}-switch`}
          key={name}
          name={name}
          onChange={onChangeInner}
          ref={ref}
          form={form}
        /> ) : (
        <Switch
          testId={`${testId}-switch`}
          key={name}
          name={name}
          onChange={onChangeInner}
          ref={ref}
          form={form}
          checked={finalValue}
        />)
      }
      { error && <Error data-testid={`switch-${name}-error`}>{error}</Error> }
    </FormGroup>
  )
})

SwitchField.displayName = 'SwitchField'

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`
