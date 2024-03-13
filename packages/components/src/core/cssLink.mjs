// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'
import { pointer } from './params.mjs'

export const cssLink = css`
  background-color: transparent;
  border: none;
  text-decoration: none;
  display: inline;
  color: ${({ theme }) => theme.palette.primary.main};
  margin: 0;
  padding: 0;
  ${pointer}

  &:focus {
    outline: none;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.light};
  }
`
