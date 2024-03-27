import * as React from 'react'
import { CrudContent } from './index.mjs'
import { usePage } from '../page/usePage.mjs'
import { Link } from '../page/Link.jsx'

export const TxCrudContent = () => {

  const { metaAll, setItem } = usePage()

  const { Product, Location } = metaAll()

  setItem('product', Product)
    setItem('location', Location)
    const q = {
      product_id: {
        'eq': Product.id
      }
    }
    if(Location) {
      q.location_id = {
        'eq': Location.id
      }
    } else {
      q.location_id = { 'hasnot': true }
    }

    setItem('query', q)
    setItem('order', [['createdAt', 'DESC']])

  return (
    <>
      <Link to="..">Back to Inventory</Link>
      <CrudContent
        type='inventoryTx'
        globalActions={[]}
        actions={[]}
      />
    </>
  )
}
