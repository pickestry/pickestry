import * as React from 'react'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Form } from '../form/index.mjs'
import { TextField } from '../form/index.mjs'
import { TextAreaField } from '../form/index.mjs'
import { Busy } from '../Busy.jsx'
import { useControl } from '../control/index.mjs'
import { DevOnly } from '../DevOnly.jsx'
import { Alert } from '../Alert.jsx'

export const AccountForm = () => {

  const [settings, setSettings] = React.useState()

  const [message, setMessage] = React.useState()

  const appInvoker = useControl('app')

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
