import * as React from 'react'
import { CrudContent } from './index.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'
import { schema } from '@pickestry/defs'

export const POCrudContent = () => {

  const { navigate } = usePage()

  React.useEffect(() => {
  // init defs
    schema.setEntitySearch('PurchaseOrder', 'supplier', (v) => {
      return new Promise((resolve, reject) => {
        ctrlInvoker.getCollection({
          model: 'Supplier',
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
      type='purchaseOrder'
      globalActions={[{
        name: 'New',
        action: () => { navigate('make.buy.new', {}) }
      }]
      }
      actions={[
        {
          name: 'Edit',
          action: ({ id }) => { navigate('make.buy.edit', {id}) },
          primary: true
        }, {
          name: 'Delete',
          action: ({ id }) => {
            if(window.confirm('Realy delete?'))
              ctrlInvoker.destroyEntity({
                model: 'PurchaseOrder',
                id
              })
          }
        }]
      }
    />
  )
}
