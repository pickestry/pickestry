// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import * as React from 'react'
import styled from 'styled-components'
import { css } from 'styled-components'
import { isFunction } from 'lodash-es'
import { BlankLink } from '../misc/BlankLink.jsx'

export const MenuItem = React.forwardRef(({
  render,
  label,
  disabled = false,
  ...props
}, ref) => {

  if (isFunction(render)) {
    return render(props, ref)
  }

  return (
    <StyledButton {...props} ref={ref} role="menuitem" disabled={disabled} type='button'>
      {label}
    </StyledButton>
  )
})

MenuItem.displayName = 'MenuItem'

const baseStyled = css`
    display: flex;
    justify-content: space-between;
    background: ${({
  open,
  theme: { palette } }) => open ? palette.primary.light : 'white'};
    padding: 8px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 400px;
    text-align: left;
    line-height: 1.8;
    min-width: 110px;
    width: 100%;
    margin: 0;
    outline: 0;

    &:focus,
    &:not([disabled]):active {
        background: ${({ theme: { palette } }) => palette.primary.light};
        color: white;

        & > span {
            color: ${({ open, theme: { palette } }) => open ? palette.primary.light : palette.primary.invert};
        }
    }
`

const StyledButton = styled(BlankLink)`
    ${baseStyled}
`

export const MenuItemWrapper = styled.div`
    ${baseStyled}
`
