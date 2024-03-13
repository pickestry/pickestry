// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { options } from '@pickestry/defs'
import { Form } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { RadioField } from '@pickestry/components'
import { MoneyField } from '@pickestry/components'
import { PercentField } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { Panel } from '@pickestry/components'
import { produce } from 'immer'

export const Discount = ({
  onSuccess,
  onSubmit,
  onCancel,
  entity = {},
  decimal,
  separator,
  currency,
  symbol
}) => {

  const { getValue } = useForm()

  let type
  try {
    type = getValue({ name: 'type' })
  } catch(error) {
    console.log(error)  // eslint-disable-line no-console
  }

  const onSubmitInner = React.useCallback((o) => {
    return onSubmit(produce(o, (draft) => {
      if(draft.type === 'fixed') {
        draft.currency = currency
      }
    }))
  }, [onSubmit])

  return (
    <Panel>
      <Form
        testid="discount-form"
        onSuccess={onSuccess}
        onSubmit={onSubmitInner}
        onCancel={onCancel}
        submitText='Use'
        entity={entity}
        focus
      >
        <RadioField
          name="type"
          defs={options.discount}
        />
        <TextField width={80} name="name" label="Name" max={20} hint="Optional name" />
        {
          type === 'fixed'
            ? <MoneyField name="amount" label="Amount" separator={separator} decimal={decimal} currency={currency} symbol={symbol} />
            : <PercentField name="amount" label="Value" />
        }
      </Form>
    </Panel>
  )
}
