// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'

export function FlexItem({
  children,
  style = {}
}) {

  return (
    <Root style={style}>
      { children }
    </Root>
  )
}

const Root = styled.div`
`
