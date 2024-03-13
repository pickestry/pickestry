import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { appInvoker } from '../../common/appInvoker.mjs'

export const AddLicense = ({ onSuccess }) => {

  const onSubmit = React.useCallback((o) => {
    return appInvoker.addLicense(o.license)
  }, [])

  return (
    <Form
      testId='add-license-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      submitText='Add License'
      focus
    >
      <TextAreaField name="license" label="License" cols={38} rows={10} hint="Copy/Paste the license sent to you via email" />
    </Form>
  )
}
