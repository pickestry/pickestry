// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { ThemeProvider } from '@pickestry/components'
import { ErrorBoundary } from '@pickestry/components'
import { defaultTheme } from '../common/theme.mjs'
import { GlobalStyle } from './GlobalStyle.jsx'
import { Header } from './Header.jsx'
import { Alerts } from './Alerts.jsx'
import { Nav } from './Nav.jsx'
import { Dialogs } from './dialogs/index.jsx'
import { PageProvider } from './page/index.mjs'
import { Main } from './Main.jsx'
import { SubNav } from './SubNav.jsx'
import { Render } from './page/index.mjs'
import { Toaster } from './toaster/Toaster.jsx'
import { SettingsProvider } from './settings/SettingsProvider.jsx'

export const App = () => {

  return (
    <ThemeProvider theme={defaultTheme}>
      <SettingsProvider>
        <GlobalStyle />
        <Header />
        <Alerts />
        <PageProvider>
          <PageContent>
            <Nav />
            <LayoutSide>
              <LayoutSideList>
                <div style={{marginTop: '25px'}} />
                <LayoutSideItem>
                  <Render
                    on='make'
                    loose
                    element={
                      <SubNav links={[
                        {name: 'Jobs', target: 'make.orders'},
                        {name: 'Pipelines', target: 'make.pipelines'},
                        {name: 'Buy', target: 'make.buy'},
                        {name: 'Supplier', target: 'make.suppliers'}
                        ]} />} />
                </LayoutSideItem>
                <LayoutSideItem><Render on='products' loose element={<SubNav links={[{name: 'Products', target: 'products.products'}, {name: 'Packages', target: 'products.packages'}, {name: 'Inventory', target: 'products.inventory'}]} />} /></LayoutSideItem>
                <LayoutSideItem>
                  <Render
                    on='sales'
                    loose
                    element={
                      <SubNav
                        links={[
                          {name: 'Sales Orders', target: 'sales.orders'},
                          {name: 'Customers', target: 'sales.customers'},
                          {name: 'Tax Reports', target: 'sales.tax'}
                        ]}
                      />} />
                </LayoutSideItem>
                <LayoutSideItem><Render on='more' loose element={<SubNav links={[{name: 'Locations', target: 'more.locations'}, {name: 'Devices', target: 'more.devices'}]} />} /></LayoutSideItem>
              </LayoutSideList>
              <LayoutSideContent>
                <div style={{marginTop: '16px'}} />
                <ErrorBoundary>
                  <Main />
                </ErrorBoundary>
              </LayoutSideContent>
            </LayoutSide>
          </PageContent>
          <Dialogs />
          <Toaster />
        </PageProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}

const PageContent = styled.main`
  padding: 0px 16px;
  height: calc(100vh - 114px);
  width: 100%;
  overflow: unset;
`

const LayoutSide = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: calc(100vh - 160px);
`

const LayoutSideContent = styled.div`
  flex-grow: 4.2;
  overflow: auto;
`

const LayoutSideList = styled.div`
  flex-grow: 0;
  margin-left: 4px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
`

const LayoutSideItem = styled.div`
  &+& {
    margin-top: 4px;
  }
`
