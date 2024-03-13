import * as React from 'react'
import styled from 'styled-components'
import { get } from 'lodash-es'
import { omitBy } from 'lodash-es'
import { isNil } from 'lodash-es'
import { pick } from 'lodash-es'
import { Form } from '@pickestry/components'
import { EntityField } from '@pickestry/components'
import { Hr } from '@pickestry/components'
import { ReadOnlyField } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { ItemsField } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { H } from '@pickestry/components'
import { DiscountField } from '@pickestry/comviews'
import { ShippingField } from '@pickestry/comviews'
import { orderCalculator } from '@pickestry/utils'
import { enums } from '@pickestry/defs'
import { displayAmount } from '@pickestry/utils'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'
import { useSettings } from '../settings/useSettings.mjs'
import { usePage } from '../page/usePage.mjs'
import { useOptSection } from 'hooks/useOptSection.jsx'
import { produce } from 'immer'
import { DevOnly } from 'components/DevOnly.jsx'

export const SellForm = ({ entity }) => {

  const {
    getValue,
    updateModel,
    updateModelBulk,
    reset
  } = useForm()

  const { navigate } = usePage()

  const customer = getValue({ name: 'customer' })

  const discounts = getValue({ name: 'discounts', defaultValue: [] })

  const shipping = getValue({ name: 'shipping' })

  const items = getValue({
    name: 'items',
    defaultValue: []
  })

  const finalTotal = getValue({ name: '_final' })

  const {
    currency = 'usd',
    moneyDecimal,
    moneySeparator
  } = useSettings()

  React.useEffect(() => {
    const totals = orderCalculator.calculateTotals(items)

    const final = orderCalculator.calculateFinal(totals, discounts, shipping)

    const {
      net,
      tax,
      gross
    } = totals

    const model = {
      _net: displayAmount(net, currency),
      _tax: displayAmount(tax, currency),
      _gross: displayAmount(gross, currency),
      _final: (final !== 0 && final !== gross) && displayAmount(final, currency)
    }
    updateModelBulk({ model })
  }, [items, updateModelBulk, currency, discounts, shipping])

  const onSearchCustomer = React.useCallback((v, limit) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Customer',
        offset: 0,
        limit,
        query: { name: { includes: v } }
      }).then(({ data }) => {
        resolve(data)
      }).catch(reject)
    })
  }, [])

  const onFetchCustomer = React.useCallback((id) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getEntity({
        model: 'Customer',
        id
      })
      .then((o) => resolve(o.name))
      .catch(reject)
    })
  }, [])

  const onCustomerChange = React.useCallback((id) => {
    ctrlInvoker.getEntity({
      model: 'Customer',
      id
    })
    .then(({address}) => {
      updateModel({
        name: 'shippingAddress',
        value: address
      })
    })
  }, [updateModel])

  const onSubmit = React.useCallback((o) => {
    const finalObject = produce(o, (draft) => {
      draft.currency = currency

      draft.items = draft.items.map((item) => pick(item, ['id', 'tax', 'amount', 'qty', 'total', 'currency']))

      draft.items = draft.items.map((item) => omitBy(item, isNil))

      if(!entity?.id) {
        draft.items = draft.items.map((item) => Object.assign(item, { currency }))
      }
    })

    return entity?.id ? ctrlInvoker.updateSalesOrder(finalObject) : ctrlInvoker.createSalesOrder(finalObject)
  }, [entity, currency])

  const onProductSearch = React.useCallback((v, limit) => {
    return new Promise((resolve, reject) => {
      ctrlInvoker.getCollection({
        model: 'Product',
        offset: 0,
        limit,
        query: {
          name: { includes: v },
          can_be_sold: { eq: true }
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
              name="customer"
              label="Customer"
              withMore
              onSearch={onSearchCustomer}
              onFetch={onFetchCustomer}
              readOnly={!!entity}
              onChange={onCustomerChange}
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
                  options={enums.salesOrderStatus}
                  withEmptyOption={false}
                />
              )
            }
            { notes }
          </H.Item>
        </H>
        {
          customer && (
            <>
              <Hr />
              {
                <ItemsField
                  name="items"
                  onSearch={onProductSearch}
                  label="Sales Order Items"
                  decimal={moneyDecimal}
                  separtor={moneySeparator}
                  currency={currency}
                  amountField='price'
                />
              }

              <Footer>
                <Total>
                  <ReadOnlyField name="_net" label="Net Total" />
                  <ReadOnlyField style={{marginTop: '8px'}} name="_tax" label="Tax Total" />
                  <ReadOnlyField style={{marginTop: '8px'}} name="_gross" label="Gross Total" />
                  <Hr />
                  <DiscountField name="discounts" decimal={moneyDecimal} separtor={moneySeparator} currency={currency} />
                  <Hr />
                  <ShippingField name="shipping" decimal={moneyDecimal} separtor={moneySeparator} currency={currency} />
                  {
                    finalTotal && (<><Hr /><ReadOnlyField style={{marginTop: '8px'}} name="_final" label="Final Total" /></>)
                  }
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
  text-align: right;

  // border: 1px solid green;

  label {
    display: block;
    width: 100%;
    // border: 1px solid red;
  }

  span {
    display: block;
    width: 100%;
    // border: 1px solid blue;
    margin-top: 1px;
  }
`
