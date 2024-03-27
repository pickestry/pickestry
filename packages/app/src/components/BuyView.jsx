// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { get } from 'lodash-es'
import { set } from 'lodash-es'
import { FormProvider } from '@pickestry/components'
import { Panel } from '@pickestry/components'
import { DevOnly } from '@pickestry/components'
import { useControl } from '@pickestry/components'
import { usePage } from '@pickestry/components'
import { useSettings } from '@pickestry/components'
import { GoBack } from './GoBack.jsx'
import { BuyForm } from './forms/BuyForm.jsx'


export const BuyView = () => {

  const [fetched, setFetched] = React.useState()

  const { meta } = usePage()

  const ctrlInvoker = useControl()

  const {
    name,
    address
  } = useSettings()

  const id = React.useMemo(()=> meta('id'), [])

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
        model: 'PurchaseOrder',
        id,
        include: [{ association: 'items' }]
      }).then(setFetched)
    }
  }, [id])

  const order = React.useMemo(() => {
    if(fetched) {
      const supplier = fetched.SupplierId

      const items = []

      for(const p of fetched.items) {
        items.push({
          id: p.id,
          name: p.name,
          qty: get(p, 'PurchaseOrderItem.qty'),
          amount: get(p, 'PurchaseOrderItem.amount'),
          total: get(p, 'PurchaseOrderItem.total'),
          tax: get(p, 'PurchaseOrderItem.tax')
        })
      }

      const ret = {
        id,
        refNum: fetched.refNum,
        notes: fetched.notes,
        status: fetched.status,
        shippingAddress: fetched.shippingAddress,
        currency: fetched.currency,
        supplier,
        items
      }

      if(fetched.net) {
        set(ret, 'net', fetched.net)
      }
      if(fetched.tax) {
        set(ret, 'tax', fetched.tax)
      }
      if(fetched.gross) {
        set(ret, 'gross', fetched.gross)
      }

      return ret
    }

    return undefined
  }, [fetched])


  const actions = React.useMemo(() => {
    const arr = []

    arr.push({
      name: 'Export to docx',
      action: () => {
        ctrlInvoker.exportBuyOrder({
          id,
          to: name,
          toAddress: address
        }).then(({ content }) => {
          const a = document.createElement('a')
          const finalBlob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.documen' })
          const url = window.URL.createObjectURL(finalBlob)
          a.href = url
          a.download = 'po.docx'
          document.body.append(a)
          a.click()
          a.remove()
          window.URL.revokeObjectURL(url)
        })
      }
    })

    return arr
  }, [id, name, address])

  return (
    <>
      <GoBack title='Back to Purchase Orders'/>
      <Panel title={`${id ? `Edit Purchase Order ${order?.refNum}` : 'Create New Purchase Order'}`} actions={actions}>
        <DevOnly entity={order} />
        <FormProvider>
          {
            ((id && order) || !id) && <BuyForm entity={order} />
          }
        </FormProvider>
      </Panel>
    </>
  )
}
