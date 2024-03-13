import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'

export const SupplierForm = ({
  id,
  onSuccess
}) => {

  const [fetched, setFetched] = React.useState()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
          model: 'Supplier',
          id
        })
        .then((entity) => { setFetched(entity) })
      }
  }, [id])

  const onSubmit = React.useCallback((o) => {
    return ctrlInvoker.saveEntity({
      model: 'Supplier',
      data: o
    })
  }, [])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      testId='supplier-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      entity={fetched}
      focus
    >
      <TextField name="name" label="Name" />
      <TextField name="email" label="Email" />
      <TextField name="phone" label="Phone" />
    </Form>
  )
}
