// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import { Link } from './page/index.mjs'
import styled from 'styled-components'
import { V } from '@pickestry/components'

export const SubNav = ({ links = []}) => {

  return (
    <Root>
      <V style={{maxWidth: 400, margin: '16px auto'}}>
      {
        links.map((link) => (<Item key={link.target}><Link to={link.target} markActive loose>{link.name}</Link></Item>))
      }
      </V>
    </Root>
  )
}

const Root = styled.div`
  min-width: 100px;
  margin-right: 32px;
`

const Item = styled(V.Item)`
  & + & {
    margin-top: 8px;
  }
`
