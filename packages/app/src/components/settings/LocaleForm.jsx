import * as React from 'react'
import { Form } from '@pickestry/components'
import { useForm } from '@pickestry/components'
import { SelectField } from '@pickestry/components'
import { Busy } from '@pickestry/components'
import { appInvoker } from '../../common/appInvoker.mjs'
import { DevOnly } from '../DevOnly.jsx'
import { get } from 'lodash-es'
import { produce } from 'immer'
import { Alert } from '@pickestry/components'

export const LocaleForm = () => {

  const [settings, setSettings] = React.useState()

  const [message, setMessage] = React.useState()

  const { getValue } = useForm()

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

  const locale = getValue({
    name: 'locale',
    defaultValue: 'en-US'
  })

  const timezones = React.useMemo(() => {
    const localeInst = new Intl.Locale(locale)

    return localeInst.timeZones
  }, [locale])

  return settings ? (
      <>
        { message && <Alert type='success' message={message} onClose={clearMessage} /> }
        <Form entity={get(settings, 'settings')} onSubmit={onSubmit} onSuccess={() => { setMessage('Settings saved') }}>
          <SelectField name='locale' label='Locale' options={get(settings, 'options.localeOptions', [])} withEmptyOption={false} />
          <SelectField name='timezone' label='Timezone' options={timezones} withEmptyOption={false} />
          <SelectField name='currency' label='Currency' options={get(settings, 'options.currencyOptions', [])} withEmptyOption={false} />
          <SelectField name='displayTime' label='Time Format' options={get(settings, 'options.displayTimeOptions', [])} withEmptyOption={false} />
          <SelectField name='displayDate' label='Date Format' options={get(settings, 'options.displayDateOptions', [])} withEmptyOption={false} />
        </Form>
        <DevOnly entity={settings} />
      </>
    ) : <Busy busy={true} />
}
