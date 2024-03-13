// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { DateField, Form, SwitchField } from '../../../../components/src/form'
import { TextAreaField } from '../../../../components/src/form'
import { TextField } from '../../../../components/src/form'
import { NumberField } from '../../../../components/src/form'
import { MoneyField } from '../../../../components/src/form'
import { SelectField } from '../../../../components/src/form'
import { TagsField } from '../../../../components/src/form'
import { ReadOnlyField } from '../../../../components/src/form'
import { EntityField } from '../../../../components/src/form'
import { ItemsField } from '../../../../components/src/form'
import { RadioField } from '../../../../components/src/form'

const SAMPLE_ENTITY = {
  loanValue: 14566,
  loanIso: 'usd',
  agree: true,
  customer: 2,
  patron: 2,
  age: 44,
  notes: `Some notes here about this entity.
  It can be quite big, that's why you need to make
  sure it fits the size you've specified.
  `,
  perma: 'Perma Value',
  semiperma: 'Semi-perma',
  invoiceItems: [{
    id: '1',
    name: 'Entity 1',
    unit: 'ea',
    amount: 4566,
    currency: 'cad',
    tax: [{ value: 1300, name: 'HST' }],
    qty: 25,
    total: 7800000
  }, {
    id: '6',
    name: 'Entity 6',
    unit: 'kg',
    amount: 366,
    currency: 'cad',
    tax: [{ value: 1400, name: 'HST' }],
    qty: 15,
    total: 7556000
  }],
  preferredSize: 'md'
}

const DELAY_MS = 1

export function WithEntity() {

  const [model, setModel] = React.useState(SAMPLE_ENTITY)

  // Entity
  const onSearch = React.useCallback((v) => {
    if (v === 'no') {
      return Promise.resolve([])
    } else if (v === 'many') {
      return Promise.resolve([
        { id: '1', name: 'Entity 1' },
        { id: '2', name: 'Entity 2' },
        { id: '3', name: 'Entity 3' },
        { id: '4', name: 'Entity 4' },
        { id: '5', name: 'Entity 5' },
        { id: '6', name: 'Entity 6' },
        { id: '7', name: 'Entity 7' },
        { id: '8', name: 'Entity 8' }
      ])
    } else {
      return Promise.resolve([
        { id: '1', name: 'Entity 1' },
        { id: '2', name: 'Entity 2' }
      ])
    }
  }, [])

  const onInit = React.useCallback(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'rec_1', name: 'Recommended 1' },
          { id: 'rec_2', name: 'Recommended 2' },
        ])
      }, DELAY_MS)
    })
  }, [])

  const onFetch = React.useCallback((id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if(id == '2') resolve('Entity 2')
        else resolve()
      }, DELAY_MS)
    })
  }, [])

  return (
    <>
      <Form
        testId='with-entity-form'
        entity={SAMPLE_ENTITY}
        onSubmit={(o) => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if(o.name === 'throw') {
                reject(new Error('Name is throw!'))
              } else {
                setModel(o)
                resolve()
              }
            }, DELAY_MS)
          })
        }}
      >
        <TextField name='name' label='Name' hint='Your full name' />
        <TextField name='nickname' label='Nickname' max={20} />
        <NumberField name='age' label='Age' max={150} />
        <SwitchField name='agree' label='Agree with Terms?' />
        <DateField name='birthday' label='Date of Birth' />
        <MoneyField name='salary' label='Salary' iso='usd' />
        <MoneyField name="loan" label="Load" iso="usd" flatModel />
        <SelectField name='mood' label='Mood' options={['one', 'two', 'three']} />
        <TagsField name='tags' label='Tags' />
        <EntityField name='customer' label='Customer' onSearch={onSearch} onInit={onInit} onFetch={onFetch} />
        <EntityField testid='patron' name='patron' label='Patron' onFetch={onFetch} readOnly />
        <TextAreaField name='notes' label='Notes'  cols={28} rows={14} max={150} />
        <ReadOnlyField name='perma' label='Permanent Value' />
        <TextField name="semiperma" label="Semi Perma" disabled />
        <ItemsField name="invoiceItems" label="Invoice Items" onSearch={onSearch} onInit={onInit}  currency='cad' />
        <RadioField name="preferredSize" required hint="Select your size" label="Preferred Size" defs={[{
          name: 'Small',
          value: 'sm',
          hint: 'Small size'
        }, {
          name: 'Medium',
          value: 'md',
          hint: 'Medium size'
        }, {
          name: 'Large',
          value: 'lg',
          hint: 'large size'
        }]} />
      </Form>
      {
        model && (
          <div data-testid='model-with-entity'>
            {JSON.stringify(model, null, 2)}
          </div>
        )
      }
    </>
  )
}
