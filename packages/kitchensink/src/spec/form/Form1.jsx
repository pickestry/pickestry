// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Form } from '../../../../components/src/form'
import { SelectField } from '../../../../components/src/form'
import { NumberField } from '../../../../components/src/form'

export function Form1({onSuccess}) {
  return (
    <Form testId='form-1'
        onSubmit={(o) => Promise.resolve(o)}
        onSuccess={onSuccess}
        focus
      >
      <SelectField name="type" options={['one', 'two', 'three']} />
      <NumberField name="count" lable="Count" />
    </Form>
  )
}
