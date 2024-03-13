import * as React from 'react'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { NumberField } from '@pickestry/components'
import { isNil } from 'lodash-es'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { DevOnly } from '../DevOnly.jsx'

export const InventoryTxForm = ({
  id,
  onSuccess
}) => {

  const [init, setInit] = React.useState()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
          model: 'InventoryItem',
          id,
          include: [
            { association: 'Product' },
            { association: 'Location' }
          ]
        })
        .then(({ ProductId, LocationId }) => {
          setInit({
            product: ProductId,
            location: LocationId
          })
        })
      }
  }, [id])

  const onProductSearch = React.useCallback((v) => {
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

  const onProductFetch = React.useCallback((id) => {
    return ctrlInvoker.getEntity({
      model: 'Product',
      id
    }).then(({name}) => name)
  }, [])

  const onLocationSearch = React.useCallback((v) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Location',
        offset: 0,
        limit: 5,
        query: {
          name:{ includes: v },
          type: { 'eq': 'warehouse' }
        }
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const onLocationFetch = React.useCallback((id) => {
    return ctrlInvoker.getEntity({
      model: 'Location',
      id
    }).then(({name}) => name)
  }, [])

  const onSubmit = React.useCallback((o) => {
    return ctrlInvoker.createInventoryTx(o)
  }, [])

  const hideLocation = React.useMemo(() => {
    return !isNil(id) && isNil(init?.LocationId)
  }, [init, id])

  if(id && !init) return <div>Loading...</div>

  return (
    <Form
      testId='inventoryTx-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      entity={init}
      focus
    >
      <EntityField name="product" label="Product" readOnly={!isNil(id)} onSearch={onProductSearch} onFetch={onProductFetch} />
      {
        !hideLocation && <EntityField name="location" label="Location" readOnly={!isNil(id)} onSearch={onLocationSearch} onFetch={onLocationFetch} />
      }
      <SelectField name="type" options={[{
        value: 'in',
        name: 'Import'
      }, {
        value: 'in_negative',
        name: 'Reverse Import'
      }, {
        value: 'out',
        name: 'Export'
      }, {
        value: 'out_negative',
        name: 'Reverse Export'
      }]} label="Type" />
      <NumberField name="count" label="Count" hint="Number of products" min="1" hideInfo />
      <DevOnly entity={init} />
    </Form>
  )
}
