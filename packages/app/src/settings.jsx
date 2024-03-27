// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { createRoot } from 'react-dom/client'
import { Settings } from '@pickestry/components'
import { ThemeProvider } from '@pickestry/components'
import { ErrorBoundary } from '@pickestry/components'
import { GlobalStyle } from './components/GlobalStyle.jsx'
import { defaultTheme } from './common/theme.mjs'

const root = createRoot(document.getElementById('root'))

root.render(
  <ThemeProvider theme={defaultTheme}>
    <GlobalStyle />
    <ErrorBoundary>
      <Settings />
    </ErrorBoundary>
  </ThemeProvider>
)
