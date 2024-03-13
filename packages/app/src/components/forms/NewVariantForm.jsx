import * as React from 'react'
import { Form } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { get } from 'lodash-es'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'

export const NewVariantForm = ({
    id,
    onSuccess
  }) => {

  const [fetched, setFetched] = React.useState()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
          model: 'Product',
          id
        })
        .then((entity) => {
          setFetched(entity)
        })
      }
  }, [id])

  const onSubmit = React.useCallback((o) => {
    return ctrlInvoker.createVariant({
      id: fetched.id,
      variant: o
    })
  }, [fetched])

  const options = React.useMemo(() => {
    return get(fetched, 'options', [])
  }, [fetched])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      focus
      testId='new-variant-form'
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    >
      {
        options.map(({name, values}) => (<SelectField key={name} name={name} options={values} />))
      }
    </Form>
  )
}
