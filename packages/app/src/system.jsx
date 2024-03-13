// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { createRoot } from 'react-dom/client'
import { SystemInfo } from './components/SystemInfo.jsx'
import { ErrorBoundary } from '@pickestry/components'

const root = createRoot(document.getElementById('root'))
root.render(<ErrorBoundary><SystemInfo /></ErrorBoundary>)

