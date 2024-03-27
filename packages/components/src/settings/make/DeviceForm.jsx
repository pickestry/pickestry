import * as React from 'react'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Form } from '../../form/index.mjs'
import { SwitchField } from '../../form/index.mjs'
import { Busy } from '../../Busy.jsx'
import { useControl } from '../control/index.mjs'
import { DevOnly } from '../../DevOnly.jsx'
import { Alert } from '../../Alert.jsx'

export const DeviceForm = () => {

  const [settings, setSettings] = React.useState()

  const [message, setMessage] = React.useState()

  const clearMessage = React.useCallback(() => {
    setMessage(undefined)
  }, [])

  const appInvoker = useControl('app')

  React.useEffect(() => {
    appInvoker.settingsWithOptions()
      .then((o) => { setSettings(o) })
      .catch(console.log) // eslint-disable-line no-console
  }, [])

  const actualSettings = React.useMemo(() => get(settings, 'settings', {}), [settings])

  const { scan_beep } = actualSettings

  const onSubmit = React.useCallback((o) => {
    return appInvoker.updateSettings(o)
      .then((st) => {
        setSettings(produce((draft) => {
          draft.settings = st
        }))
      })
  }, [])

  return settings ? (
      <>
        { message && <Alert type='success' message={message} onClose={clearMessage} /> }
        <Form entity={{ scan_beep }} onSubmit={onSubmit} onSuccess={() => { setMessage('Settings saved') }}>
        <SwitchField
          name='scan_beep'
          label='Scan beep'
          hint='Play a beep sound on successful scans' />
        </Form>
        <DevOnly entity={settings} />
      </>
    ) : <Busy busy={true} />
}

