import * as React from 'react'
import { CrudContent } from './index.mjs'
import { useControl } from '../control/index.mjs'
import { usePage } from '../page/usePage.mjs'
import { schema } from '@pickestry/defs'

export const InventoryCrudContent = () => {

  const { navigate } = usePage()

  const appInvoker = useControl('app')

  const ctrlInvoker = useControl()

  React.useEffect(() => {
  // init defs
    schema.setEntitySearch('InventoryItem', 'location', (v) => {
      return new Promise((resolve, reject) => {
        ctrlInvoker.getCollection({
          model: 'Location',
          offset: 0,
          limit: 5,
          query: {
            name: { includes: v },
            type: { eq: 'warehouse' }
          }
        }).then(({ data }) => {
          resolve(data)
        }).catch(reject)
      })
    })
  }, [])

  return (
    <CrudContent
      type='inventoryItem'
      globalActions={[{
        name: 'New Transaction',
        action: () => { appInvoker.showDialog('inventory-tx-new') }
      }]
      }
      actions={[
        {
          name: 'Transactions',
          action: ({ Location, Product }) => { navigate('products.inventory.txs', { Location, Product }) },
          primary: true
        },
        {
          name: 'New Transaction',
          action: ({ id }) => { appInvoker.showDialog('inventory-tx-new', { id }) }
        }]
      }
      customGetCollection={(page, query, order) => ctrlInvoker.getInventoryItems({page, query, order})}
    />
  )
}
