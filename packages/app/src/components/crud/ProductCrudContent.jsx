import * as React from 'react'
import { CrudContent } from './CrudContent.jsx'
import { appInvoker } from '../../common/appInvoker.mjs'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { usePage } from '../page/usePage.mjs'
import * as c from '../../c.mjs'

export const ProductCrudContent = () => {

  const { navigate } = usePage()

  const actions = React.useCallback((o) => {
    const _actions = [
      {
        name: 'Edit',
        action: ({ id }) => { appInvoker.showDialog('product-update', {id}) },
        primary: true
      }, {
        name: 'Delete',
        action: ({ id }) => {
          if(window.confirm('Realy delete?'))
            ctrlInvoker.destroyEntity({ model: 'product', id })
        }
      }, {
        name: 'Parts',
        action: ({ id }) => { navigate('products.products.parts', {id}) }
      }
    ]

    if(o.options) {
      _actions.push({
        name: 'New Variant',
        action: ({ id }) => { appInvoker.showDialog(c.DLG_NEW_VARIANT, {id}) }
      })
    }

    return _actions
  }, [])

  return (
    <CrudContent
      type='product'
      hint="Products, Parts, Variants"
      actions={actions}
    />
  )
}
