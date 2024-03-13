// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { isFunction } from 'lodash-es'
import { Radio } from '../controls/Radio.jsx'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const RadioField = React.forwardRef((props, ref) => {
  const {
    error = '',
    inline = false,
    required = false,
    testid = 'radio-field',
    defs = [],
    form,
    hint,
    label,
    name,
    onChange,
    style,
    disabled,
    width,
    height
  } = props

  // console.log('RadioField: ', form)

  const { getValue, updateModel } = useForm()

  const value = getValue({ name, form })

  const onChangeInner = React.useCallback((v) => {

    // console.log(form, name, v)

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
    <FormGroup data-testid={testid} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <Radio
        name={name}
        onChange={onChangeInner}
        ref={ref}
        form={form}
        value={finalValue}
        defs={defs}
        width={width}
        height={height}
        disabled={disabled}
        />
    </FormGroup>
  )
})

RadioField.displayName = 'RadioField'
