// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Form } from '@pickestry/components'
import { MoneyField } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { Panel } from '@pickestry/components'

export const Shipping = ({
  onSuccess,
  onSubmit,
  onCancel,
  entity = {},
  decimal,
  separator,
  currency,
  symbol
}) => {

  return (
    <Panel>
      <Form
        testid="shipping-form"
        onSuccess={onSuccess}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitText='Add Shipping'
        entity={entity}
        focus
      >
        <TextField name="name" label="Name" max={20} width={200} hint="Optional name" />
        <MoneyField name="amount" label="Amount" separator={separator} decimal={decimal} currency={currency} symbol={symbol} />
      </Form>
    </Panel>
  )
}
