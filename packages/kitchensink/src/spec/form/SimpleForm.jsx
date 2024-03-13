// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Form } from '../../../../components/src/form'
import { DateField } from '../../../../components/src/form'
import { SwitchField } from '../../../../components/src/form'
import { TextField } from '../../../../components/src/form'
import { NumberField } from '../../../../components/src/form'
import { MoneyField } from '../../../../components/src/form'
import { SelectField } from '../../../../components/src/form'
import { TagsField } from '../../../../components/src/form'
import { EntityField } from '../../../../components/src/form'
import { TextAreaField } from '../../../../components/src/form'
import { ImageField } from '../../../../components/src/form'

const DELAY_MS = 1

export function SimpleForm() {

  const [model, setModel] = React.useState()

  const [success, setSuccess] = React.useState('')

  const [failed, setFailed] = React.useState('')

  const customerRef = React.useRef()

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

  return (
    <>
      <Form
        testId='simple-form'
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
        entity={model}
        onSuccess={() => {setSuccess('Success!')}}
        onFailed={(message) => {setFailed('Failed! ' + message)}}
      >
        <TextField name='name' label='Name' hint='Your full name. Type `throw` to throw!' />
        <TextField name='nickname' label='Nickname' max={20} />
        <NumberField name='age' label='Age' max={150} />
        <NumberField name='floors' label='Floors' min={0} hint='min:0, but it should not show it' hideInfo />
        <SwitchField name='agree' label='Agree to Terms' />
        <SwitchField testId='accept-switch' name='accept' label='Accept to Terms' />
        <DateField name='birthday' label='Date of Birth' />
        <MoneyField name='salary' label='Salary' iso='usd' />
        <MoneyField name="loan" label="Load" iso="usd" flatModel />
        <SelectField name='mood' label='Mood' options={['one', 'two', 'three']} />
        <SelectField name="position" label="Position" hint="Required, not allowed to be empty" options={['first', 'second', 'third']} withEmptyOption={false} />
        <TagsField name='tags' label='Tags' />
        <EntityField name='customer' label='Customer' onSearch={onSearch} onInit={onInit} ref={customerRef} />
        <TextAreaField name="notes" label='Notes' />
        <ImageField name="primaryImage" label='Primary Image' />
      </Form>
      {
        model && (
          <div data-testid='model'>
            {JSON.stringify(model, null, 2)}
          </div>
        )
      }
      {
        success && (<span>{success}</span>)
      }
      {
        failed && (<span>{failed}</span>)
      }

      <button onClick={() => { customerRef.current.focus() }}>Go to customer</button>
    </>
  )
}
