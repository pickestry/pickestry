import * as React from 'react'
import { Form } from '@pickestry/components'
import { NumberField } from '@pickestry/components'
import { Label } from '@pickestry/components'
import { get } from 'lodash-es'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'

export const ChangePartQtyForm = ({
    id,
    partId,
    onSuccess
  }) => {

  const [fetched, setFetched] = React.useState()

  const onSubmit = React.useCallback(({ qty }) => {
    return ctrlInvoker.addPart({
      id,
      partId,
      qty
    })
  }, [])

  React.useEffect(() => {
    ctrlInvoker.getEntity({
      model: 'Product',
      id,
      include: [{association: 'parts'}]
    })
    .then((o) => { setFetched(o) })
  }, [])

  const part = React.useMemo(() => {
    const _part = fetched?.parts.find(({id}) => id == partId)

    if(!_part) return

    return {
      qty: get(_part, 'ProductPart.qty'),
      unit: _part.unit
    }
  }, [fetched])

  return fetched && (
    <Form
      testId='change-part-qty-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      entity={part}
      focus
    >
      <NumberField name="qty" label="Qty" />
      <br />
      <Label>Unit:</Label><div>{part.unit}</div>
    </Form>
  )
}
