// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { SimpleForm } from './form/SimpleForm'
import { WithEntity } from './form/WithEntity'
import { Form1 } from './form/Form1'
import { FormProvider } from  '../../../components/src/form'
import { Dialog } from  '../../../components/src/dialog'
import { DialogBody } from  '../../../components/src/dialog'
import { DialogHeader } from  '../../../components/src/dialog'

export function Form() {

  const [form1, setForm1] = React.useState(false)

  return (
    <>
      <h1>Form</h1>
      <FormProvider>
        <SimpleForm />
      </FormProvider>

      <h1>With Entity</h1>
      <FormProvider>
        <WithEntity />
      </FormProvider>

      {
        form1 && (
          <FormProvider>
            <Dialog modal={true} open={form1} onOpenChange={setForm1}>
              <DialogHeader>Form 1</DialogHeader>
              <DialogBody>
                <Form1 onSuccess={() => {
                  setForm1(false)
                }} />
              </DialogBody>
            </Dialog>
          </FormProvider>
        )
      }

      <button onClick={() => { setForm1(true) }}>Form 1</button>
    </>
  )
}
