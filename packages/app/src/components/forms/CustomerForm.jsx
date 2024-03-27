import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { useControl } from '@pickestry/components'

export const CustomerForm = ({
  id,
  onSuccess
}) => {

  const [fetched, setFetched] = React.useState()

  const ctrlInvoker = useControl()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
          model: 'Customer',
          id
        })
        .then((entity) => { setFetched(entity) })
      }
  }, [id])

  const onSubmit = React.useCallback((o) => {
    return ctrlInvoker.saveEntity({
      model: 'Customer',
      data: o
    })
  }, [])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      testId='customer-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      entity={fetched}
      focus
    >
      <TextField name="name" label="Name" />
      <TextField name="email" label="Email" />
      <TextField name="phone" label="Phone" />
      <TextAreaField name="address" label="Address" rows={4} />
    </Form>
  )
}
