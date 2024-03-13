// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { FormProvider } from '@pickestry/components'
import { Frame } from '@pickestry/components'
import { cssPointer } from '@pickestry/components'
import { PageProvider } from '../page/PageProvider.jsx'
import { Render } from '../page/Render.jsx'
import { Link } from '../page/index.mjs'
import { LocaleForm } from './LocaleForm.jsx'
import { AccountForm } from './AccountForm.jsx'
import { MakeGroup } from './make/MakeGroup.jsx'
import { H } from '@pickestry/components'
import { V } from '@pickestry/components'
import XIcon from 'assets/x.svg'

export const Settings = () => {
  return (
    <Root>
      <Header>Settings<X onClick={() => {window.close()}} /></Header>
      <PageProvider>
        <PageWrapper>
          <Menu>
            <h1>Account</h1>
            <Nav>
              <NavItem><Link to='/' markActive>Main</Link></NavItem>
              <NavItem><Link to='locale' markActive loose>Place & Time</Link></NavItem>
              <NavItem><Link to='make' markActive loose>Make</Link></NavItem>
            </Nav>
          </Menu>
          <Content>
            <FormProvider>
              <Render on='/' element={<AccountForm />} />
              <Render on='locale' element={<LocaleForm />} />
              <Render on='make' loose element={<MakeGroup />} />
            </FormProvider>
          </Content>
        </PageWrapper>
      </PageProvider>
    </Root>
  )
}

const Root = styled(Frame).attrs({ $bare: true })`
  margin: 0;
  padding: 0;
  padding-bottom: 4px;
  height: 100%;
`

const Header = styled.h3`
  margin: 0;
  padding: 8px 0 8px 4px;
  font-size: 24px;
  text-align: left;
  background: white;
  border-bottom: 1px solid #ccc;
  color: #3e3e3e;
`

const Menu = styled(H.Item)`
  width: 230px;
  background: white;
  padding-top: 16px;
  padding-left: 8px;
`

const Content = styled(H.Item)`
  height: 100%;
  width: 100%;
`

const Nav = styled(V)`
  margin-top: 14px;
  padding-left: 8px;
  justify-content: start;
  gap: 14px;
`

const NavItem = styled(H.Item)`
  font-size: 16px;
`

const PageWrapper = styled(H)`
  justify-content: start;
  height: 100%;
`

const X = styled(XIcon)`
  position: absolute;
  top: 10px;
  right: 9px;

  fill: #eee;
  stroke: ${({theme: { palette: {primary}}}) => primary.main};

  ${cssPointer}
`
