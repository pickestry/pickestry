// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { FormLabel } from './foundation.mjs'
import { FormGroup } from './foundation.mjs'
import { FormHint } from './foundation.mjs'
import { useForm } from './useForm.mjs'

export const ReadOnlyField = ({
  form,
  name,
  testid = 'readonly-field',
  inline = false,
  label,
  hint,
  style
}) => {

  const { getValue } = useForm()

  const value = getValue({
    name,
    form
  })

  return (
    <FormGroup data-testid={testid} $inline={inline} style={style}>
      { label ? <FormLabel htmlFor={name}>{label}</FormLabel> : null }
      { hint ? <FormHint>{hint}</FormHint> : null }
      <EntityDisplay>{value}</EntityDisplay>
    </FormGroup>
  )

}

ReadOnlyField.displayName = 'ReadOnlyField'

const EntityDisplay = styled.span`
`
