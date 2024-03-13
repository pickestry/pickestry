import * as React from 'react'
import { Form } from '@pickestry/components'
import { TextField } from '@pickestry/components'
import { TextAreaField } from '@pickestry/components'
import { Busy } from '@pickestry/components'
import { appInvoker } from '../../common/appInvoker.mjs'
import { DevOnly } from '../DevOnly.jsx'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Alert } from '@pickestry/components'

export const AccountForm = () => {

  const [settings, setSettings] = React.useState()

  const [message, setMessage] = React.useState()

  const clearMessage = React.useCallback(() => {
    setMessage(undefined)
  }, [])

  React.useEffect(() => {
    appInvoker.settingsWithOptions()
      .then((o) => {
        setSettings(o)
      })
      .catch(console.log) // eslint-disable-line no-console
  }, [])

  const onSubmit = React.useCallback((o) => {
    return appInvoker.updateSettings(o)
      .then((settings) => {
        setSettings(produce((draft) => {
          draft.settings = settings
        }))
      })
  }, [])

  return settings ? (
      <>
        { message && <Alert type='success' message={message} onClose={clearMessage} /> }
        <Form entity={get(settings, 'settings')} onSubmit={onSubmit} onSuccess={() => { setMessage('Settings saved') }}>
          <TextField name='name' label='Name' hint="Legal name, company name" />
          <TextAreaField name="address" label="Address" rows={4} />
        </Form>
        <DevOnly entity={settings} />
      </>
    ) : <Busy busy={true} />
}
