import * as React from 'react'
import { CrudContent } from './index.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'

export const TaxReports = ({ type = 'sales-tax' }) => {

  const { navigate } = usePage()

  const q = {
    type: {
      eq: type
    }
  }

  // setItem('query', q)
  // setItem('order', [['createdAt', 'DESC']])

  return (
    <>
      <CrudContent
        type='taxReport'
        globalActions={[{
          name: 'New',
          action: () => { navigate('sales.tax.new', { type }) }
        }]}
        actions={[{
          name: 'Delete',
          action: ({ id }) => {
            if(window.confirm('Realy delete?'))
              ctrlInvoker.destroyEntity({
                model: 'Report',
                id
              })
          }
        }, {
          name: 'View',
          action: ({ id }) => { navigate('sales.tax.view', { id }) },
          primary: true
        }]}
        customGetCollection={(page) => ctrlInvoker.getCollection({
          model: 'Report',
          offset: (page - 1) * 10,
          limit: 10,
          query: q,
          order: [['createdAt', 'DESC']]
        })}
      />
    </>
  )
}
