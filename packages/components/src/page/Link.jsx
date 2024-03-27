import * as React from 'react'
import styled from 'styled-components'
import { BlankLink } from '@pickestry/components'
import { usePage } from './usePage.mjs'

export const Link = ({
  to,
  children,
  disabled = false,
  markActive = false,
  loose,
  margin = '0'
}) => {

  const { navigate, checkActive } = usePage()

  return (
    <StyledLink
      $margin={margin}
      disabled={disabled}
      className={`${(markActive && checkActive(to, loose)) && 'link-active' }`}
      onClick={() => { navigate(to) }}>
        { children }
    </StyledLink>
  )
}

const StyledLink = styled(BlankLink)`
  user-select: none;
  margin: ${({$margin}) => $margin};

  &.link-active {
    font-weight: bold;
  }
`
