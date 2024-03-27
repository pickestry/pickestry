import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { omitBy } from 'lodash-es'
import { isNil } from 'lodash-es'
import { pick } from 'lodash-es'
import { produce } from 'immer'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { Hr } from '@pickestry/components'
import { ReadOnlyField } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { ItemsField } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { DevOnly } from '@pickestry/components'
import { H } from '@pickestry/components'
import { useControl } from '@pickestry/components'
import { useSettings } from '@pickestry/components'
import { usePage } from '@pickestry/components'
import { orderCalculator } from '@pickestry/utils'
import { enums } from '@pickestry/defs'
import { displayAmount } from '@pickestry/utils'
import { useOptSection } from 'hooks/useOptSection.jsx'

export const BuyForm = ({ entity }) => {

  const {
    getValue,
    updateModel,
    updateModelBulk,
    reset
  } = useForm()

  const { navigate } = usePage()

  const ctrlInvoker = useControl()

  const supplier = getValue({ name: 'supplier' })

  const items = getValue({
    name: 'items',
    defaultValue: []
  })

  const {
    address,
    currency,
    moneyDecimal,
    moneySeparator
  } = useSettings()

  React.useEffect(() => {
    if(address) {
      updateModel({
        name: 'shippingAddress',
        value: address
      })
    }
  }, [address, updateModel])

  React.useEffect(() => {
    const {
      net,
      tax,
      gross
    } = orderCalculator.calculateTotals(items)
    
    const model = {
      _net: displayAmount(net, currency),
      _tax: displayAmount(tax, currency),
      _gross: displayAmount(gross, currency)
    }
    
    updateModelBulk({ model })
  }, [items, updateModelBulk, currency])

  const onSearchSupplier = React.useCallback((v, limit) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Supplier',
        offset: 0,
        limit,
        query: { name: { includes: v } }
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const onFetchSupplier = React.useCallback((id) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getEntity({
        model: 'Supplier',
        id
      })
      .then(({name}) => resolve(name))
      .catch(reject)
    })
  }, [])

  const onSupplierChange = React.useCallback((id) => {
    ctrlInvoker.getEntity({
      model: 'Supplier',
      id
    })
    .then(({address}) => {
      updateModel('shippingAddress', address)
    })
  }, [])

  const onSubmit = React.useCallback((o) => {
    const finalObject = produce(o, (draft) => {
      draft.currency = currency

      draft.items = draft.items.map((item) => pick(item, ['id', 'tax', 'amount', 'qty', 'total', 'currency']))

      draft.items = draft.items.map((item) => omitBy(item, isNil))

      if(!entity?.id) {
        draft.items = draft.items.map((item) => Object.assign(item, { currency }))
      }
    })

    return entity?.id ? ctrlInvoker.updateBuyOrder(finalObject) : ctrlInvoker.createBuyOrder(finalObject)
  }, [entity, currency])

  const onProductSearch = React.useCallback((v, limit = 5) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Product',
        offset: 0,
        limit,
        query: {
          name: { includes: v },
          can_be_bought: { eq: true }
        }
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const isNew = React.useMemo(() => !entity?.id, [entity])

  const notes = useOptSection(<TextAreaField name="notes" label="Notes" col={10} rows={5} />, 'Notes', !isNil(get(entity, 'notes')))

  return (
    <>
      <DevOnly entity={entity} />
      <Form
        onSubmit={onSubmit}
        onSuccess={() => { navigate('..') }}
        onCancel={() => { navigate('..') }}
        entity={entity}
        focus
      >
        <H>
          <H.Item>
            <EntityField
              name="supplier"
              label="Supplier"
              withMore
              onSearch={onSearchSupplier}
              onFetch={onFetchSupplier}
              readOnly={!!entity}
              onChange={onSupplierChange}
              onClear={reset}
            />
            <TextAreaField name="shippingAddress" label="Shipping Address" col={10} rows={4} />
          </H.Item>
          <H.Item>
            {
              !isNew && (
                <SelectField
                  name="status"
                  label="Status"
                  options={enums.purchaseOrderStatus}
                  withEmptyOption={false}
                />
              )
            }
            { notes }
          </H.Item>
        </H>
        {
          supplier && (
            <>
              <Hr />
              {
                <ItemsField
                  name="items"
                  onSearch={onProductSearch}
                  label="Purchase Order Items"
                  decimal={moneyDecimal}
                  separtor={moneySeparator}
                  currency={currency}
                  amountField='cost'
                />
              }

              <Footer>
                <Total>
                  <ReadOnlyField name="_net" label="Net Total" />
                  <ReadOnlyField style={{marginTop: '8px'}} name="_tax" label="Tax Total" />
                  <ReadOnlyField style={{marginTop: '8px'}} name="_gross" label="Gross Total" />
                </Total>
              </Footer>
            </>
          )
        }
      </Form>
    </>
  )
}

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Total = styled.div`
  margin-top: 32px;
`
