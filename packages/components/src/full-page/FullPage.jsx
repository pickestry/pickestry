// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import React from 'react'
import styled from 'styled-components'
import { Header } from './Header.jsx'
import { Content } from './Content.jsx'

export function FullPage({ children }) {

    return (
    <Root data-testid="full-page">
      {
        children
      }
    </Root>
  )
}

FullPage.Header = Header

FullPage.Content = Content

const Root = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: white;
  z-index: 10;
  overflow-y: auto;
`
