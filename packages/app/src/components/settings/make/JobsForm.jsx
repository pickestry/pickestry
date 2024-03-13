import * as React from 'react'
import { Form } from '@pickestry/components'
import { SwitchField } from '@pickestry/components'
import { Busy } from '@pickestry/components'
import { appInvoker } from '../../../common/appInvoker.mjs'
import { DevOnly } from '../../DevOnly.jsx'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Alert } from '@pickestry/components'

export const JobsForm = () => {

  const [settings, setSettings] = React.useState()

  const [message, setMessage] = React.useState()

  const clearMessage = React.useCallback(() => {
    setMessage(undefined)
  }, [])

  React.useEffect(() => {
    appInvoker.settingsWithOptions()
      .then((o) => { setSettings(o) })
      .catch(console.log) // eslint-disable-line no-console
  }, [])

  const actualSettings = React.useMemo(() => get(settings, 'settings', {}), [settings])

  const { job_bump_counter_cap } = actualSettings

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
        <Form entity={{ job_bump_counter_cap }} onSubmit={onSubmit} onSuccess={() => { setMessage('Settings saved') }}>
        <SwitchField
          name='job_bump_counter_cap'
          label='Limit progress'
          hint='Do not increase counter beyond planned quantity' />
        </Form>
        <DevOnly entity={settings} />
      </>
    ) : <Busy busy={true} />
}

