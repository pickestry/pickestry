// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { get } from 'lodash-es'
import { dates } from '@pickestry/utils'
import { SettingsContext } from './SettingsContext.mjs'

export const SettingsProvider = ({ children }) => {

  const [settings, setSettings] = React.useState()

  React.useEffect(() => {
    function onevent(_e, args) {

      const type = get(args, '[0].type')
      const o = get(args, '[0].data')

      if(type === 'settings:changed') {
        const hourCycle = o.displayTime === '24h' ? 'h24' : 'h12'
        dates.configure({
          locale: o.locale,
          timeZone: o.timezone,
          dateFormat: o.dateFormat,
          hourCycle
        })
      }
    }

    window.ipc.on('event', onevent)

    const o = localStorage.getItem('state')
    const hourCycle = o.displayTime === '24h' ? 'h24' : 'h12'
    dates.configure({
      locale: o.locale,
      timeZone: o.timezone,
      dateFormat: o.dateFormat,
      hourCycle
    })

    setSettings(JSON.parse(o))

    return function cleanup() {
      window.ipc.off('event', onevent)
    }
  }, [])

  return (
    <SettingsContext.Provider value={{ settings }}>
      { settings && children }
    </SettingsContext.Provider>
  )
}
