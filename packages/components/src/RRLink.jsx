// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import styled from 'styled-components'
import { Link as ReactRouterLink } from 'react-router-dom'
import { pointer } from './core/index.mjs'

export const RRLink = styled(ReactRouterLink)`
  background-color: transparent;
  border: none;
  text-decoration: none;
  display: inline;
  color: ${({ theme }) => theme.palette.primary.main};
  margin: 0;
  padding: 0;
  ${pointer}
  padding: 6px 8px;
  font-size: 0.875rem;

  &:focus {
    text-decoration: none;
    outline:0;
  }

  &:hover {
    color: ${({ theme }) => theme.palette.primary.light};
    text-decoration: none;
  }

  &:disabled {
    color: gray;
    cursor: auto;
  }
`

