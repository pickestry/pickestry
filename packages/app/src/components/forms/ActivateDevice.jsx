import * as React from 'react'
import { Form } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { ctrlInvoker } from '../../common/ctrlInvoker.mjs'

export const ActivateDevice = ({
    id,
    name,
    onSuccess
  }) => {

  const [channels, setChannels] = React.useState()

  React.useEffect(() => {
    ctrlInvoker.getAllChannels()
      .then(({ data }) => { setChannels(data) })
    }
  , [id])

  const onSubmit = React.useCallback(({ channel }) => {
    return ctrlInvoker.linkDevice({id, channel})
  }, [id])

  if(!channels) return <div>Loading...</div>

  return (
    <Form
      testId='link-device-form'
      onSuccess={onSuccess}
      onSubmit={onSubmit}
      submitText='Activate'
      focus
      style={{width: '300px'}}
    >
      <SelectField
        name='channel'
        label='Channel'
        hint={`Link ${name} to a channel to activate it and start processing barcodes`}
        options={
          channels.map((o) => {
            return {
              name: o.name,
              value: o.id
            }
          })} />
    </Form>
  )
}
