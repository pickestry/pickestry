// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { ImageInput } from '../controls/ImageInput.jsx'
import { isFunction } from 'lodash-es'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const ImageField = React.forwardRef((props, ref) => {
  const {
    form,
    error = '',
    inline = false,
    required = false,
    testId = 'image-field',
    hint,
    label,
    name,
    onChange,
    style
  } = props

  const { getValue, updateModel, removeFields } = useForm()

  const value = getValue({ name, form })

  const onChangeInner = React.useCallback((v) => {
    const encodedData = v.data

    updateModel({
      name,
      value: encodedData,
      form
    })

    if(isFunction(onChange)) onChange(v)
  }, [updateModel, onChange, name, form])

  const onClearInner = React.useCallback(() => {
    removeFields({
      fields: [name],
      form
    })
    if(isFunction(onChange)) onChange(undefined)
  }, [removeFields, onChange, name, form])

  const finalValue = React.useMemo(() => (value || '') ,[value])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testId} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <ImageInput
        name={name}
        error={error}
        onChange={onChangeInner}
        onClear={onClearInner}
        ref={ref}
        form={form}
        value={finalValue}
      />
    </FormGroup>
  )
})

ImageField.displayName = 'ImageField'
