// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { css } from 'styled-components'
import { pointer } from './params.mjs'

export const baseLineItem = css`
  background: ${({theme}) => theme.palette.primary.lighter};
  border-radius: 4px;
  padding: 4px;

  &+& {
    margin-top: 4px;
  }

  &:hover {
    ${ ({ theme, hasOnClick }) => hasOnClick ? `background: ${theme.palette.highlight}` : null };
    ${ ({ hasOnClick }) => hasOnClick ? pointer : null };
  }
`
