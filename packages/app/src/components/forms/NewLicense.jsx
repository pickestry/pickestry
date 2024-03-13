import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'

export const NewLicense = ({
  onSuccess
}) => {

  const onSubmit = React.useCallback(() => {
    // console.log('ADD LICENSE ', o)
  }, [])


  return (
    <Form
      testId='add-license-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      submitText='Add License'
      focus
    >
      <TextField name="name" label="Name" required />
      <TextField name="email" label="Email" required />
      <TextField name="taxNumber" label="Tax Number (If Avaialble)" />
    </Form>
  )
}
