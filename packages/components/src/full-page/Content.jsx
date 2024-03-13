// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'

export function Content({
  width = '98%',
  children
}) {
  return (
    <Root width={width} data-qa="full-page-content">
      { children }
    </Root>
  )
}

const Root = styled.div`
  width: ${({ width }) => width};
  padding: 12px;
  margin: 55px auto 0;
  margin-bottom: 50px;
`
