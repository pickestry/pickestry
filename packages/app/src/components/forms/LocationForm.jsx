import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { get } from 'lodash-es'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'


export const LocationForm = ({ id, onSuccess }) => {

  const [fetched, setFetched] = React.useState()

  React.useEffect(() => {
    if(id) {
      ctrlInvoker.getEntity({
          model: 'Location',
          id
        })
        .then((entity) => {
          setFetched(entity)
        })
      }
  }, [id])

  const onSubmit = React.useCallback((o) => {
    return ctrlInvoker.saveEntity({
      model: 'Location',
      data: o
    })
  }, [])

  const isNew = React.useMemo(() => !id, [id])

  const locationTypes = React.useMemo(() => get(window, 'defs.enums.locationTypes', []), [])

  if(id && !fetched) return <div>Loading...</div>

  return (
    <Form
      focus
      testId='location-form'
      entity={fetched}
      onSubmit={onSubmit}
      onSuccess={onSuccess}
    >
      <TextField name="name" label="Name" />
      { isNew && <SelectField name="type" label="Location Type" options={locationTypes.map((v) => ({name: v, value: v}))} /> }
      <TextAreaField name="address" label="Address" rows={4} />
    </Form>
  )
}
