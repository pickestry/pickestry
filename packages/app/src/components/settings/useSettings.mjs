// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { SettingsContext } from './SettingsContext.mjs'
import { produce } from 'immer'

export const useSettings = () => {
  const { settings } = React.useContext(SettingsContext)

  const { amount } = settings

  return produce(settings, (draft) => {
    draft.moneyDecimal = (amount === 'dot_comma') ? '.' : ','
    draft.moneySeparator = (amount === 'dot_comma') ? ',' : '.'
  })
}
