// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Entity } from '../controls/entity/index.mjs'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { FormError } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const EntityField = React.forwardRef(({
  form,
  name,
  testid = 'entity-field',
  width = '250px',
  readOnly = false,
  withMore,
  onSearch,
  onInit,
  onFetch,
  onClear,
  onChange,
  error = '',
  inline = false,
  required = false,
  label,
  hint,
  style
}, ref) => {

  const { getValue, updateModel, removeFields, addError } = useForm()

  const value = getValue({ name, form })

  const onChangeInner = React.useCallback((o) => {
    updateModel({
      name,
      value: o.id,
      form
    })

    onChange?.(o.id)
  }, [updateModel, onChange, name, form])

  const onClearInner = React.useCallback((id) => {
    removeFields({
      fields: [name],
      form
    })

    onClear?.(id)

    return Promise.resolve()
  }, [ removeFields, onClear, name, form])

  const requiredEl = required ? <span className="required">*</span> : ''

  return (
    <FormGroup data-testid={testid} $inline={inline} style={style} $error={error}>
      { label ? <FormLabel htmlFor={name}>{label} {requiredEl}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <Entity
        name={name}
        onChange={onChangeInner}
        readOnly={readOnly}
        ref={ref}
        form={form}
        value={value}
        width={width}
        onError={(err) => { addError({code: 'err', field: name, message: err}) }}
        onSearch={onSearch}
        onInit={onInit}
        onFetch={onFetch}
        onClear={onClearInner}
        withMore={withMore}
      />
      { error && <FormError data-testid={`${testid}-error`}>{error}</FormError> }
    </FormGroup>
  )

})

EntityField.displayName = 'EntityField'
