// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { ThemeProvider as ThemeProviderOriginal } from 'styled-components'
import { defaultTheme } from './defaultTheme.mjs'

export const ThemeProvider = ({ theme, children }) => {
  return (<ThemeProviderOriginal theme={theme || defaultTheme}>{children}</ThemeProviderOriginal>)
}
