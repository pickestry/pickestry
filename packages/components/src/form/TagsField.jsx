// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { isFunction } from 'lodash-es'
import { Tags } from '../controls/Tags.jsx'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const TagsField = React.forwardRef((props, ref) => {
  const {
    error = '',
    inline = false,
    required = false,
    testId = 'tags-field',
    form,
    hint,
    label,
    name,
    onChange,
    style
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
      <Tags
        name={name}
        onChange={onChangeInner}
        ref={ref}
        form={form}
        defaultTags={finalValue} />
        { error && <Error data-testid={`Select-${name}-error`}>{error}</Error> }
    </FormGroup>
  )
})

TagsField.displayName = 'SelectField'

const Error = styled.span`
  display: block;
  font-size: 12px;
  color: ${({theme: { palette }}) => palette.danger.main};
`
