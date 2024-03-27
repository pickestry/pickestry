import * as React from 'react'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { NumberField } from '@pickestry/components'
import { useControl } from '@pickestry/components'

export const AddPartForm = ({
  id,
  onSuccess
}) => {

  const ctrlInvoker = useControl()

  const onSubmit = React.useCallback(({
      partId,
      qty
    }) => {
    return ctrlInvoker.addPart({
      id,
      partId,
      qty
    })
  }, [])

  const onSearch = React.useCallback((v) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Product',
        offset: 0,
        limit: 5,
        query: {name:{includes: v}}
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  return (
    <Form
      testId='add-part-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      focus
    >
      <EntityField name="partId" label="Part" onSearch={onSearch} />
      <NumberField name="qty" label="Qty" />
    </Form>
  )
}
