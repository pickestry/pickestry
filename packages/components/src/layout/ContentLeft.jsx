// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'

export function ContentLeft({ children }) {
  return (
    <StyledContainer>
      {children}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`

const Content = function({children}) {
  return (
    <StyledContent>
      {children}
    </StyledContent>
  )
}

const StyledContent = styled.div`
  flex-grow: 4.2;
`

const SideList = function({ children }) {
  return (
    <StyledSide>
      {children}
    </StyledSide>
  )
}

const StyledSide = styled.div`
  flex-grow: 0;
  margin-left: 4px;
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
`

const SideItem = function({ children }) {
  return <StyledSideItem>{ children }</StyledSideItem>
}

const StyledSideItem = styled.div`
  &+& {
    margin-top: 4px;
  }
`

ContentLeft.Content = Content

ContentLeft.SideList = SideList

ContentLeft.SideItem = SideItem
