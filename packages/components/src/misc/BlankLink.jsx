// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { pointer } from '../core/params.mjs'

export const BlankLink = styled.button.attrs({
  type: 'button'
})`
  background-color: transparent;
  border: none;
  text-decoration: none;
  display: inline;
  color: ${({ theme }) => theme.palette.primary.main};
  margin: 0;
  padding: 0;
  ${pointer}

  &:focus-visible {
    outline: 1px dashed #cecece;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.light};
  }

  &:disabled {
    background-color: transparent;
    cursor: auto;
    color: ${({ theme }) => theme.palette.textMuted};

    &:hover {
      color: ${({ theme }) => theme.palette.textMuted};
    }
  }
`
