import * as React from 'react'
import { CrudContent } from './index.mjs'
import { useControl } from '../control/index.mjs'
import { usePage } from '../page/usePage.mjs'
import { schema } from '@pickestry/defs'

export const SalesOrderCrudContent = () => {

  const { navigate } = usePage()

  const ctrlInvoker = useControl()

  React.useEffect(() => {
  // init defs
    schema.setEntitySearch('SalesOrder', 'customer', (v) => {
      return new Promise((resolve, reject) => {
        ctrlInvoker.getCollection({
          model: 'Customer',
          offset: 0,
          limit: 5,
          query: {name:{includes: v}}
        }).then(({ data }) => {
          resolve(data)
        }).catch(reject)
      })
    })
  }, [])

  return (
    <CrudContent
      type='salesOrder'
      globalActions={[{
        name: 'New',
        action: () => { navigate('sales.orders.new', {}) }
      }]
      }
      actions={[
        {
          name: 'Edit',
          action: ({ id }) => { navigate('sales.orders.edit', { id }) },
          primary: true
        }, {
          name: 'Delete',
          action: ({ id }) => {
            if(window.confirm('Realy delete?'))
              ctrlInvoker.destroyEntity({
                model: 'SalesOrder',
                id
              })
          }
        }]
      }
    />
  )
}
