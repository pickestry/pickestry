// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { isFunction } from 'lodash-es'
import { TextInput } from '../controls/TextInput.jsx'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const TextField = React.forwardRef((props, ref) => {
  const {
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
    disabled
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

  const finalValue = React.useMemo(() => (value || ''), [value])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <TextInput
        max={max}
        name={name}
        error={error}
        onChange={onChangeInner}
        ref={ref}
        form={form}
        value={finalValue}
        width={`${width}px`}
        disabled={disabled}
        />
    </FormGroup>
  )
})

TextField.displayName = 'TextField'
