// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'

export const NotFound = () => {
  return (
    <Root>
      No results found
    </Root>
  )
}

const Root = styled.div`
  width: 400px;
  height: 80px;
  margin: 0px auto;
  text-align: center;
  padding: calc(6vh) 0 calc(10vh) 0;
  color: ${({theme: {palette}}) => palette.textMuted};
`
