// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/* eslint-disable no-console */

import * as React from 'react'
import { Discount } from '../../../comviews'
import { Form } from '../../../components/src/form/index.mjs'
import { FormProvider } from '../../../components/src/form/index.mjs'
import { DiscountField } from '../../../comviews/src/sales/DiscountField.jsx'

export function Sales() {

  const [radio, setRadio] = React.useState('control')

  const [discountControl, setDiscountControl] = React.useState({ type: 'fixed' })

  return (
    <FormProvider>

      <section data-testid="discount">
        <h1>Discount {radio}</h1>
        <button data-testid='switch-discount-control' onClick={() => { setRadio('control') }}>Control</button>
        <button data-testid='switch-discount-form' onClick={() => { setRadio('form') }}>Form</button>
        {
          radio === 'control' ? (
            <>
              <Discount
                testid='discount-control'
                onSubmit={(o) => { setDiscountControl(o); return Promise.resolve(o) }}
                onSuccess={() => Promise.resolve()}
                entity={discountControl}
                currency='cad'
                symbol='$'
              />
              <span data-testid='discount-control-out'>
              { JSON.stringify(discountControl) }
              </span>
            </>
          ) : (
            <Form testid='discount-field-test'>
              <DiscountField name="discounts" currency='cad' onChange={(v) => { console.log(v) }} />
            </Form>
          )
        }
      </section>

    </FormProvider>
  )
}
