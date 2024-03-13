// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { Muted } from '../misc/index.mjs'
import { pointer } from '../core/index.mjs'

export const AvailableFilter = ({
    name,
    label = name,
    hint,
    onClick
  }) => {

  return (
    <Root data-testid={`available-filter-${name}`} onClick={(e) => { e.preventDefault(); onClick?.(name) }}>
      <Title>{label}</Title>
      <HelpText>{hint}</HelpText>
    </Root>
  )
}

const Root = styled.div`
  padding: 8px;

  &:hover {
    background-color: ${({theme: { palette }}) => palette.primary.lighter};
    border-radius: 4px;
    ${pointer}
  }
`

const Title = styled.div`
`

const HelpText = styled(Muted)`
  display: block;
  margin-top: 4px;

`
