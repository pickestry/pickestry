// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import {createRoot} from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import { Route } from 'react-router-dom'
import { Routes } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { ThemeProvider } from '@pickestry/components'
import { createGlobalStyle } from '@pickestry/components'
import { Layout } from './spec/Layout'
import { Alerts } from './spec/Alerts'
import { Buttons } from './spec/Buttons'
import { Controls } from './spec/Controls'
import { Data } from './spec/Data'
import { Dialog } from './spec/Dialog'
import { Dropdown } from './spec/Dropdown'
import { Misc } from './spec/Misc'
import { TableExample } from './spec/TableExample'
import { Theme } from './spec/Theme'
import { Form } from './spec/Form'
import { Sales } from './spec/Sales'
import { FilterExample } from './spec/FilterExample'
import { indexCss } from './indexCss'

const ROUTES = [
  { path: 'alert', component: Alerts },
  { path: 'buttons', component: Buttons },
  { path: 'controls', component: Controls},
  { path: 'data', component: Data },
  { path: 'dialog', component: Dialog },
  { path: 'dropdown', component: Dropdown },
  { path: 'layout', component: Layout },
  { path: 'misc', component: Misc },
  { path: 'form', component: Form },
  { path: 'theme', component: Theme },
  { path: 'tables', component: TableExample },
  { path: 'filters', component: FilterExample },
  { path: 'sales', component: Sales }
]

const GlobalStyle = createGlobalStyle(indexCss)

function App() {
  const { pathname } = useLocation()

  return (
    <>
      <main>
        {pathname === '/' && (
          <>
            <h1>React Components Testing Grounds</h1>
            <p>
              Welcome! On the left there is a navigation bar to browse through
              the different test files. These files, and the control buttons, are
              used by Playwright to take screenshots for us to visualy inspect the results.
            </p>
          </>
        )}
        <Outlet />
      </main>
      <nav>
        <div className="nav-top">
          <Link to="/" className="home-button">
            Tests
          </Link>
        </div>
        <ul>
          {ROUTES.map(({path}) => (
            <Link
              key={path}
              to={`/${path}`}
              className="nav-link"
              style={{
                color: pathname === `/${path}` ? 'black' : '',
                fontWeight: pathname === `/${path}` ? 'bold' : '',
              }}
            >
              {path.replace('-', ' ')}
            </Link>
          ))}
        </ul>
      </nav>
    </>
  )
}

createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <ThemeProvider>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            {
              ROUTES.map(({ path, component: Comp }) => {
                return <Route key={path} path={path} element={<Comp />} />
              })
            }
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)

